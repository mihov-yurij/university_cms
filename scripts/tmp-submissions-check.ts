// Temporary check — deleted after the run.
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

const created = await payload.create({
  collection: "submissions",
  data: {
    department: "Тестова кафедра",
    fullName: "ТЕСТОВИЙ ВИКЛАДАЧ ТЕСТОВИЙ",
    email: "test@example.com",
    orcid: "0000-0002-6106-2825",
    bio: "Перший абзац.\n\nДругий абзац.",
    publications: [{ entry: "Публікація 1" }],
    projects: [],
  },
  overrideAccess: false,
  user: null,
});

console.log("created id:", created.id);
console.log("fileUrl:", created.fileUrl);
console.log("emailSent (SMTP unset, expect false):", created.emailSent);

if (created.fileUrl !== `/api/submissions/${created.id}/file`) {
  throw new Error("fileUrl hook did not run");
}

let denied = false;
try {
  await payload.find({
    collection: "submissions",
    overrideAccess: false,
    user: null,
    limit: 1,
  });
} catch (error) {
  denied = true;
  console.log("anonymous read denied:", (error as Error).message);
}
if (!denied) throw new Error("anonymous read was allowed");

const endpoints =
  payload.config.collections.find((collection) => collection.slug === "submissions")?.endpoints ??
  [];
const fileEndpoint = endpoints.find((endpoint) => endpoint.path === "/:id/file");
if (!fileEndpoint) throw new Error("file endpoint missing");

const anon = await fileEndpoint.handler({
  payload,
  routeParams: { id: String(created.id) },
  user: null,
} as never);
console.log("endpoint without login ->", anon.status);
if (anon.status !== 401) throw new Error("endpoint did not require a login");

const authed = await fileEndpoint.handler({
  payload,
  routeParams: { id: String(created.id) },
  user: { id: 1 },
} as never);
const bytes = new Uint8Array(await authed.arrayBuffer());
console.log(
  "endpoint with login ->",
  authed.status,
  authed.headers.get("content-type"),
  `${bytes.length} bytes`,
);
if (authed.status !== 200 || bytes.length < 1000) throw new Error("file not generated");

await payload.delete({
  collection: "submissions",
  id: created.id,
  overrideAccess: true,
});
console.log("cleaned up");
process.exit(0);
