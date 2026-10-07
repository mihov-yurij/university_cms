import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import { uk } from "@payloadcms/translations/languages/uk";
import { en } from "@payloadcms/translations/languages/en";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Institutes } from "./collections/Institutes";
import { Departments } from "./collections/Departments";
import { Teachers } from "./collections/Teachers";

// Data-collection instance of the main university_platform CMS. Same Payload
// version, same collection and field names — only the collections nobody here
// fills in (pages, news, specialities, programmes, disciplines, publications,
// documents, the header global and the translate endpoint) are left out, so a
// record exported from this admin imports into the main project unchanged.

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Media lives in a Cloudflare R2 bucket in every deployed environment. Locally
// the R2 variables are optional: leave them unset and uploads fall back to the
// `media/` directory on disk.
const r2Enabled = Boolean(process.env.R2_BUCKET);

// `payload migrate` sets PAYLOAD_MIGRATING. Neon offers a pooled endpoint
// (PgBouncer) for the running app and a direct one for schema changes; DDL and
// the advisory locks around it want the direct connection.
const connectionString =
  process.env.PAYLOAD_MIGRATING === "true"
    ? (process.env.DATABASE_URI_UNPOOLED ?? process.env.DATABASE_URI)
    : process.env.DATABASE_URI;

const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

// Mirrors the push condition in @payloadcms/drizzle's connect: the schema is
// synced automatically outside production, unless a migration command is
// driving the connection.
const willPushSchema =
  process.env.NODE_ENV !== "production" &&
  process.env.PAYLOAD_MIGRATING !== "true" &&
  process.env.PAYLOAD_ALLOW_REMOTE_PUSH !== "true";

// A dev server pointed at a deployed database rewrites that database's schema
// on startup, without asking, and stamps a `dev` row (batch -1) into
// payload_migrations — which then makes `payload migrate` stop and ask an
// interactive question that nothing answers on a build server, so the deploy
// goes green with an unmigrated database. Refuse to start instead.
if (connectionString && willPushSchema) {
  let host: null | string = null;
  try {
    host = new URL(connectionString).hostname;
  } catch {
    // Unparseable connection string: leave it to the adapter to complain.
  }

  if (host && !LOCAL_DATABASE_HOSTS.has(host)) {
    throw new Error(
      `Refusing to start: dev mode would push schema changes to "${host}".\n\n` +
        `DATABASE_URI must point at a local Postgres for development — ` +
        `\`npm run db:up\` starts one.\n\n` +
        `To push to ${host} deliberately, set PAYLOAD_ALLOW_REMOTE_PUSH=true.`,
    );
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — ОНМУ (збір даних)",
    },
    theme: "light",
  },
  // The sidebar order. Group labels fix where each group sits; this instance
  // has exactly three — Структура (what the administrator fills in), Медіа and
  // Система.
  collections: [Institutes, Departments, Teachers, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, "migrations"),
    // Payload otherwise tries to CREATE DATABASE when it cannot find one, which
    // a managed provider will refuse. Failing loudly is the better outcome.
    disableCreateDatabase: process.env.NODE_ENV === "production",
    pool: {
      connectionString,
      // Serverless functions each hold their own pool, so keep it small in
      // production and let the provider's pooler do the multiplexing.
      max: process.env.NODE_ENV === "production" ? 5 : 10,
      idleTimeoutMillis: 30_000,
      // Generous enough for a scale-to-zero database waking up.
      connectionTimeoutMillis: 10_000,
    },
  }),
  sharp,
  upload: {
    // Global — Payload has no per-collection size limit. 60MB covers the
    // scanned PDFs and high-resolution portraits this admin receives.
    limits: { fileSize: 60 * 1024 * 1024 },
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          // An explicit `prefix` keeps the plugin's `prefix` column in the
          // schema whether or not R2 is switched on, so a developer without
          // credentials sees no schema diff against production.
          prefix: "media",
          // Without this, `url` stays pointed at Payload's own /api/media/file/
          // route and every image byte is proxied through the app server.
          generateFileURL: ({ filename: file, prefix }) =>
            [process.env.R2_PUBLIC_URL, prefix, encodeURIComponent(file)].filter(Boolean).join("/"),
        },
      },
      bucket: process.env.R2_BUCKET ?? "",
      // Upload straight from the browser to a presigned URL — hosts cap the
      // size of a request body well below what a portrait upload needs.
      clientUploads: true,
      alwaysInsertFields: true,
      enabled: r2Enabled,
      config: {
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
        },
      },
      // No `acl`: R2 does not implement S3 ACLs. Public readability is a
      // bucket-level setting in the Cloudflare dashboard.
    }),
  ],
  graphQL: {
    disable: true,
  },
  localization: {
    // Objects rather than a bare string array, so the locale dropdown shows
    // labels instead of raw codes. `localeCodes` comes out identical either
    // way, so the schema is unchanged.
    locales: [
      { code: "uk", label: { uk: "Українська", en: "Ukrainian" } },
      { code: "en", label: { uk: "Англійська", en: "English" } },
    ],
    defaultLocale: "uk",
    fallback: true,
    // Publish the locale being edited rather than both at once.
    defaultLocalePublishOption: "active",
  },
  // Admin interface language — Ukrainian, matching the content default.
  i18n: {
    fallbackLanguage: "uk",
    supportedLanguages: { uk, en },
  },
});
