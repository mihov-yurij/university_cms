# university_cms — ОНМУ, збір даних

A standalone Payload CMS instance whose only job is to collect the structural
data of Odesa National Maritime University — 5 institutes, 27 departments,
~300 faculty — through the admin panel, and hand it to the main
`university_platform` project.

The original project is not modified in any way. Everything here was copied
from it: same Payload version (3.88.0), same Next.js (16.3.0), same collection
slugs, field names, labels and validation. A record created here imports into
the main project unchanged.

Only the administrator uses this. There is no public frontend: `/` rewrites to
`/admin`.

## What was copied, and what was left behind

| Kept (identical) | Left out |
|---|---|
| `institutes`, `departments`, `teachers`, `media`, `users` | `pages`, `news`, `specialities`, `programmes`, `disciplines`, `publications`, `documents` |
| All fields on those collections, minus the four joins below | The `header` global |
| The block library used by `about`/`research` fields | `pageHero` and `documentList` blocks (they target `pages` / `documents`) |
| Localization (uk/en), Ukrainian admin UI, slug generation, S3/R2 uploads | The translate endpoint and translate button |
| The remote-push guard in `payload.config.ts` | The custom dashboard widgets (they count `pages` and `news`) |

Fields removed because their target collection is not here — the rest of each
record is untouched:

- `institutes.regulations`, `institutes.ratingLists` → `documents`
- `institutes.specialities` join → `specialities`
- `departments.disciplines`, `.publications`, `.programmes`, `.specialities` joins
- `pillLinks`/`linkField` reference targets limited to `institutes`

Anything not listed is byte-for-byte the main project's file.

## Local development

```bash
npm install
npm run db:up        # Postgres in Docker — port 5433, so it can run beside
                     # the main project's Postgres on 5432
npm run dev          # http://localhost:3000 → /admin
```

The first run pushes the schema into the local database automatically. The
first person to open `/admin` creates the account.

```bash
npm run lint
npx tsc --noEmit
npx payload run scripts/smoketest.ts   # creates a user, an institute, a
                                       # department and a teacher over the
                                       # local API and the REST API, checks the
                                       # joins, then deletes everything it made
npm run db:reset     # drop and recreate the local database
```

## Deploying to Vercel

1. **Neon**: create a project, copy both connection strings (pooled has
   `-pooler` in the hostname), keep `?sslmode=require` on both. Leave the
   database empty — the first production build runs the migration in
   `migrations/`.
2. **Cloudflare R2**: required in production. Vercel's filesystem is read-only
   and ephemeral, so without R2 every uploaded photo is lost on the next
   deploy. Bucket CORS needs `AllowedHeaders: ["content-type"]` and your
   domain in `AllowedOrigins` — see `docs/06-deployment.md` in the main
   project, which describes the same setup.
3. **Vercel**: import the repository, then set for Production **and** Preview:

   | Variable | |
   |---|---|
   | `DATABASE_URI` | Neon pooled |
   | `DATABASE_URI_UNPOOLED` | Neon direct |
   | `PAYLOAD_SECRET` | any long random string, different from the main project's |
   | `R2_BUCKET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL` | same bucket the main project uses, or its own |

4. Deploy. `vercel.json` runs `payload migrate` before `next build`, production
   only — the build log should show `Migrating: <timestamp>_initial`.

After a schema change, **only the developer who deploys** runs:

```bash
npx payload migrate:create <name>
```

and commits the `.ts`, the `.json` and the regenerated `index.ts` in
`migrations/`.

## Handing the data to the main project

```bash
npm run export -- --url https://<collector-domain> --out ./export
```

Reads every page of `institutes`, `departments`, `teachers` and `media`, once
per locale, and writes `<collection>.<locale>.json` plus `manifest.json`.

`manifest.json` carries an **id → slug map per collection**. Ids belong to this
database and mean nothing in another one, so an importer resolves every
relationship through the slug it maps to:

| Field | Resolves via |
|---|---|
| `departments.institute` | institute slug |
| `teachers.appointments[].unit` | `relationTo` + slug of the institute or department |
| `institutes.departments`, `staff`, … | joins — derived, never imported |
| `institutes.image`, `teachers.photo` | media filename: re-upload, or reuse the same R2 object |

Reads from the REST API are public (`read: () => true`, same as the main
project), so no credentials are needed for the export. Imported documents keep
their field names exactly as exported; the main project's additional fields
(regulations, specialities, …) simply stay empty for the new records.
