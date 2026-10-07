// Exports the collected data as JSON, for import into the main
// university_platform project.
//
//   node scripts/export.mjs --url https://<collector-domain> --out ./export
//
// Reads every page of `institutes`, `departments`, `teachers` and `media`,
// once per locale, and writes:
//
//   <slug>.uk.json, <slug>.en.json   the documents, `depth: 0`, so
//                                    relationships are their raw ids
//   manifest.json                    counts, source, and an id → slug map per
//                                    collection
//
// The id map is the point. Ids are assigned by this database and mean nothing
// in another one, so an importer resolves every relationship — a department's
// `institute`, a teacher's `appointments[].unit` — through the slug it maps to.
//
// Authentication: the three content collections are readable without it (the
// same `read: () => true` the main project has). Pass --email/--password, or
// set EXPORT_EMAIL/EXPORT_PASSWORD, only if that ever changes.

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function arg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const BASE_URL = (arg("url", process.env.EXPORT_URL ?? "http://localhost:3000")).replace(/\/+$/, "");
const OUT_DIR = path.resolve(arg("out", "./export"));
const EMAIL = arg("email", process.env.EXPORT_EMAIL);
const PASSWORD = arg("password", process.env.EXPORT_PASSWORD);
const LOCALES = ["uk", "en"];
const COLLECTIONS = ["institutes", "departments", "teachers", "media"];
const PAGE_SIZE = 100;

async function login() {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Login failed (${res.status}): ${await res.text()}`);
  }
  const { token } = await res.json();
  return `JWT ${token}`;
}

async function fetchPage(collection, locale, page, auth) {
  const qs = new URLSearchParams({
    locale,
    depth: "0",
    limit: String(PAGE_SIZE),
    page: String(page),
    sort: "id",
  });
  const res = await fetch(`${BASE_URL}/api/${collection}?${qs}`, {
    headers: auth ? { Authorization: auth } : {},
  });
  if (!res.ok) {
    throw new Error(`${collection} (${locale}) page ${page} failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

async function fetchAll(collection, locale, auth) {
  const docs = [];
  for (let page = 1; ; page++) {
    const body = await fetchPage(collection, locale, page, auth);
    docs.push(...body.docs);
    if (!body.hasNextPage) break;
  }
  return docs;
}

const auth = EMAIL && PASSWORD ? await login() : null;

fs.mkdirSync(OUT_DIR, { recursive: true });

const manifest = {
  source: BASE_URL,
  exportedAt: new Date().toISOString(),
  locales: LOCALES,
  pageSize: PAGE_SIZE,
  collections: {},
};

for (const collection of COLLECTIONS) {
  const idMap = {};
  let total = 0;

  for (const locale of LOCALES) {
    const docs = await fetchAll(collection, locale, auth);
    // The id → slug map only needs building once; both locales carry the same
    // ids, and `slug` is not localized.
    if (locale === LOCALES[0]) {
      for (const doc of docs) {
        if (doc.id != null) idMap[String(doc.id)] = doc.slug ?? null;
      }
      total = docs.length;
    }
    const file = path.join(OUT_DIR, `${collection}.${locale}.json`);
    fs.writeFileSync(file, `${JSON.stringify(docs, null, 2)}\n`, "utf8");
    console.log(`${path.relative(process.cwd(), file)} — ${docs.length} records`);
  }

  manifest.collections[collection] = { total, idMap };
}

const manifestFile = path.join(OUT_DIR, "manifest.json");
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`${path.relative(process.cwd(), manifestFile)} — id → slug map for ${COLLECTIONS.length} collections`);
