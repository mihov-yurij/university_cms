import { Document, Packer, Paragraph, TextRun } from "docx";

// Builds the .docx a department head's /submit form turns into — the same
// dossier layout the department collects by hand today. One function feeds two
// consumers: the email attachment sent on submit, and GET /api/submissions/:id/file
// (admin only), so a record can be re-downloaded without keeping a copy on disk.

export type ProfileSubmission = {
  fullName?: null | string;
  department?: null | string;
  position?: null | string;
  degree?: null | string;
  academicTitle?: null | string;
  orcid?: null | string;
  scopus?: null | string;
  wos?: null | string;
  googleScholar?: null | string;
  email?: null | string;
  bio?: null | string;
  publications?: null | { entry?: null | string }[];
  projects?: null | { entry?: null | string }[];
};

const FONT = "Times New Roman";
/** Half-points: 24 = 12pt, the size the collected dossiers are set in. */
const SIZE = 24;

const value = (v?: null | string) => (v ?? "").trim();

const paras = (text: string): string[] =>
  text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

const entries = (rows?: null | { entry?: null | string }[]): string[] =>
  (rows ?? []).map((row) => value(row.entry)).filter(Boolean);

// The form accepts either a full link or a bare identifier — a paste from
// Scopus is usually just the author id. Normalising here keeps the document
// clickable whatever was typed.
const httpUrl = (v: string) => /^https?:\/\//i.test(v);

const orcidUrl = (v: string) =>
  httpUrl(v) ? v : /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(v) ? `https://orcid.org/${v}` : v;

const scopusUrl = (v: string) =>
  httpUrl(v) || !/^\d+$/.test(v)
    ? v
    : `https://www.scopus.com/authid/detail.uri?authorId=${v}`;

const wosUrl = (v: string) =>
  httpUrl(v) || !/^[A-Za-z0-9-]{6,}$/.test(v)
    ? v
    : `https://www.webofscience.com/wos/author/record/${v}`;

const scholarUrl = (v: string) =>
  httpUrl(v) || !/^[A-Za-z0-9_-]{8,}$/.test(v)
    ? v
    : `https://scholar.google.com/citations?user=${v}`;

function plain(text: string, spacingAfter = 120): Paragraph {
  return new Paragraph({ spacing: { after: spacingAfter }, children: [new TextRun(text)] });
}

function heading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ bold: true, text })],
  });
}

/** "КАФЕДРА: …" on one line, for values that never wrap. */
function labelled(label: string, v: string): Paragraph {
  return plain(`${label}: ${v}`);
}

/** Label line above its value, for values that are often multi-line. */
function block(label: string, lines: string[]): Paragraph[] {
  return [plain(`${label}:`), ...lines.map((line) => plain(line)), plain("")];
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun(text)],
  });
}

function numbered(index: number, text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun(`${index}. ${text}`)],
  });
}

export function buildProfileDoc(profile: ProfileSubmission): Paragraph[] {
  const fullName = value(profile.fullName);
  const department = value(profile.department);
  const position = paras(value(profile.position));
  const degree = paras(value(profile.degree));
  const academicTitle = paras(value(profile.academicTitle));
  const email = value(profile.email);
  const bio = paras(value(profile.bio));
  const publications = entries(profile.publications);
  const projects = entries(profile.projects);

  const identifiers = [
    ["ORCID ID", value(profile.orcid) && orcidUrl(value(profile.orcid))],
    ["Scopus Author ID", value(profile.scopus) && scopusUrl(value(profile.scopus))],
    ["Web of Science ResearcherID", value(profile.wos) && wosUrl(value(profile.wos))],
    ["Google Scholar Profile", value(profile.googleScholar) && scholarUrl(value(profile.googleScholar))],
  ] as const;

  const children: Paragraph[] = [];

  if (department) children.push(labelled("КАФЕДРА", department));
  if (fullName) children.push(labelled("ПІБ", fullName));
  if (department || fullName) children.push(plain(""));

  if (position.length) children.push(...block("ПОСАДА", position));
  if (degree.length || academicTitle.length) {
    if (degree.length) children.push(...block("НАУКОВИЙ СТУПІНЬ", degree));
    if (academicTitle.length) children.push(...block("ВЧЕНЕ ЗВАННЯ", academicTitle));
    children.push(plain(""));
  }

  const shownIdentifiers = identifiers.filter(([, v]) => v);
  if (shownIdentifiers.length) {
    children.push(heading("НАУКОВИЙ ПРОФІЛІ ТА ІДЕНТИФІКАТОРИ"));
    for (const [label, v] of shownIdentifiers) children.push(bullet(`${label}: ${v}`));
    children.push(plain(""));
  }

  if (email) {
    children.push(heading("КОНТАКТ"));
    children.push(bullet(`E-mail: ${email}`));
    children.push(plain(""));
  }

  for (const paragraph of bio) children.push(plain(paragraph));

  if (publications.length) {
    children.push(heading("ПУБЛІКАЦІЇ"));
    publications.forEach((publication, index) => children.push(numbered(index + 1, publication)));
    children.push(plain(""));
  }

  if (projects.length) {
    children.push(plain("-".repeat(88), 60));
    children.push(heading("МІЖНАРОДНІ ПРОЄКТИ ТА СТАЖУВАННЯ"));
    for (const project of projects) children.push(bullet(project));
  }

  if (!children.length) children.push(plain("(порожня форма)"));

  return children;
}

export async function buildProfileDocx(profile: ProfileSubmission): Promise<Buffer> {
  const document = new Document({
    sections: [{ children: buildProfileDoc(profile) }],
    styles: {
      default: {
        document: { run: { font: FONT, size: SIZE } },
      },
    },
  });

  return Packer.toBuffer(document);
}

export function profileFileName(profile: ProfileSubmission): string {
  const safe =
    value(profile.fullName)
      // Windows/macOS cannot have these in a filename; a dossier named after
      // the person who submitted it should still download cleanly.
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);

  return `${safe || "profile"}.docx`;
}

export function contentDisposition(fileName: string): string {
  const ascii = fileName.replace(/[^\x20-\x7E]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}
