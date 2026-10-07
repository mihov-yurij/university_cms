import type { CollectionAfterChangeHook, CollectionConfig } from "payload";
import type { Submission } from "../payload-types";
import {
  buildProfileDocx,
  contentDisposition,
  profileFileName,
} from "../lib/profileDoc";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// The inbox the generated dossier is emailed to. Env-overridable so the
// address is not baked into a client bundle — but a sensible default means a
// deployment that forgets the variable still delivers the mail.
const INBOX = process.env.PROFILE_INBOX ?? "mihov.yurij@gmail.com";

/**
 * On create: turn the submitted fields into the .docx and email it. The record
 * itself is the backup — if SMTP is unconfigured or the send fails, the data is
 * already saved and `emailSent` stays false, which the admin panel shows.
 */
const sendProfileDocument: CollectionAfterChangeHook<Submission> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== "create") return doc;

  if (!process.env.SMTP_USER) {
    console.warn(
      "[submissions] SMTP_USER is not set — the submission was saved but no email was sent.",
    );
    return doc;
  }

  try {
    const buffer = await buildProfileDocx(doc);
    const fileName = profileFileName(doc);

    await req.payload.sendEmail({
      to: INBOX,
      subject: `Профіль кафедри: ${doc.fullName || doc.email}`,
      text: [
        "Надійшла нова заявка з форми збору профілів кафедр.",
        "",
        `ПІБ: ${doc.fullName ?? ""}`,
        `Кафедра: ${doc.department ?? ""}`,
        `E-mail відправника: ${doc.email ?? ""}`,
        "",
        "Сформований документ додано до листа. Той самий файл можна",
        "завантажити в адмін-панелі: Заявки → поле «Файл».",
      ].join("\n"),
      attachments: [{ content: buffer, contentType: DOCX_MIME, filename: fileName }],
    });

    await req.payload.update({
      collection: "submissions",
      id: doc.id,
      data: { emailSent: true },
      overrideAccess: true,
    });
  } catch (error) {
    console.error("[submissions] failed to email the profile document:", error);
  }

  return doc;
};

export const Submissions: CollectionConfig = {
  slug: "submissions",
  labels: {
    singular: { uk: "Заявка", en: "Submission" },
    plural: { uk: "Заявки", en: "Submissions" },
  },
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "department", "emailSent", "createdAt"],
    group: { uk: "Система", en: "System" },
    description: {
      uk: "Заявки з публічної форми /submit. Файл формується автоматично.",
      en: "Submissions from the public /submit form. The file is generated automatically.",
    },
  },
  access: {
    // The form is public — anyone holding the link may submit.
    create: () => true,
    // Everything else stays behind the admin login.
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  endpoints: [
    {
      path: "/:id/file",
      method: "get",
      handler: async (req) => {
        const id = Number(req.routeParams?.id);
        if (!Number.isInteger(id)) {
          return Response.json({ message: "Not found" }, { status: 404 });
        }
        if (!req.user) {
          return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const doc = await req.payload.findByID({
          collection: "submissions",
          depth: 0,
          id,
          overrideAccess: true,
        });

        return new Response((await buildProfileDocx(doc)) as unknown as BodyInit, {
          headers: {
            "Content-Disposition": contentDisposition(profileFileName(doc)),
            "Content-Type": DOCX_MIME,
          },
        });
      },
    },
  ],
  hooks: {
    afterChange: [sendProfileDocument],
  },
  fields: [
    {
      name: "department",
      type: "text",
      required: true,
      label: { uk: "Кафедра", en: "Department" },
    },
    {
      name: "fullName",
      type: "text",
      required: true,
      label: { uk: "ПІБ", en: "Full name" },
    },
    {
      name: "position",
      type: "textarea",
      label: { uk: "Посада", en: "Position" },
    },
    {
      name: "degree",
      type: "text",
      label: { uk: "Науковий ступінь", en: "Academic degree" },
    },
    {
      name: "academicTitle",
      type: "text",
      label: { uk: "Вчене звання", en: "Academic title" },
    },
    {
      name: "orcid",
      type: "text",
      label: "ORCID ID",
      admin: { description: { uk: "ID або повне посилання", en: "ID or full URL" } },
    },
    {
      name: "scopus",
      type: "text",
      label: "Scopus Author ID",
      admin: { description: { uk: "ID або повне посилання", en: "ID or full URL" } },
    },
    {
      name: "wos",
      type: "text",
      label: "Web of Science ResearcherID",
      admin: { description: { uk: "ID або повне посилання", en: "ID or full URL" } },
    },
    {
      name: "googleScholar",
      type: "text",
      label: "Google Scholar Profile",
      admin: { description: { uk: "ID або повне посилання", en: "ID or full URL" } },
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "E-mail",
    },
    {
      name: "bio",
      type: "textarea",
      label: { uk: "Опис (біографія, наукові напрями)", en: "Biography" },
    },
    {
      name: "publications",
      type: "array",
      label: { uk: "Публікації", en: "Publications" },
      fields: [
        {
          name: "entry",
          type: "textarea",
          label: { uk: "Публікація", en: "Publication" },
        },
      ],
    },
    {
      name: "projects",
      type: "array",
      label: { uk: "Міжнародні проєкти та стажування", en: "Projects and internships" },
      fields: [
        {
          name: "entry",
          type: "textarea",
          label: { uk: "Проєкт / стажування", en: "Project / internship" },
        },
      ],
    },
    {
      name: "emailSent",
      type: "checkbox",
      label: { uk: "Лист надіслано", en: "E-mail sent" },
      defaultValue: false,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: {
          uk: "Увімкнено, коли документ успішно надіслано на пошту. Вимкнено, якщо SMTP не налаштовано або сталася помилка.",
          en: "Checked when the document was emailed. Unchecked when SMTP is not configured or the send failed.",
        },
      },
    },
    {
      name: "fileUrl",
      type: "text",
      label: { uk: "Файл", en: "File" },
      hooks: {
        // `data` is the full document in afterRead, which is the only place
        // this hook runs — the id is what makes the link resolvable.
        afterRead: [({ data }) => (data?.id ? `/api/submissions/${data.id}/file` : null)],
      },
      admin: {
        readOnly: true,
        position: "sidebar",
        description: {
          uk: "Посилання на згенерований .docx — відкриється, увійшовши в адмін-панель.",
          en: "Link to the generated .docx — opens while signed in to the admin panel.",
        },
      },
    },
  ],
};
