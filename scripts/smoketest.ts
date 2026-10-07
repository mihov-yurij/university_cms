import { getPayload } from "payload";
import config from "@payload-config";

// Throwaway end-to-end check: create a user, create an institute, a department
// and a teacher over both the local API and the REST API, read the joins back,
// then delete everything it made. Run with:
//
//   npx payload run scripts/smoketest.ts

// Payload returns a join either as a plain array or as a paginated object,
// depending on how it was asked for, and its rows may be raw ids (depth 0) or
// populated documents. All three shapes are acceptable here.
function joinIds(value: unknown): string[] {
  const rows = Array.isArray(value)
    ? value
    : value && typeof value === "object" && Array.isArray((value as { docs?: unknown }).docs)
      ? ((value as { docs: unknown[] }).docs)
      : [];
  return rows.map((row) =>
    typeof row === "object" && row !== null ? String((row as { id?: unknown }).id) : String(row),
  );
}

const BASE = process.env.SMOKE_URL ?? "http://localhost:3000";
const EMAIL = `smoketest-${Date.now()}@example.com`;
const PASSWORD = "smoketest-password-1";

const payload = await getPayload({ config });

const created: { collection: string; id: string | number }[] = [];

async function track<T extends { id: string | number }>(
  collection: string,
  doc: T,
): Promise<T> {
  created.push({ collection, id: doc.id });
  return doc;
}

try {
  await track(
    "users",
    await payload.create({
      collection: "users",
      data: { name: "Smoke Test", email: EMAIL, password: PASSWORD },
      overrideAccess: true,
    }),
  );

  // --- local API: institute → department → teacher, then the joins back ---
  const institute = await track(
    "institutes",
    await payload.create({
      collection: "institutes",
      data: { name: "Тестовий інститут", slug: "smoketest-institute", order: 999 },
    }),
  );
  const department = await track(
    "departments",
    await payload.create({
      collection: "departments",
      data: { name: "Тестова кафедра", slug: "smoketest-department", institute: institute.id, order: 999 },
    }),
  );
  const teacher = await track(
    "teachers",
    await payload.create({
      collection: "teachers",
      data: {
        fullName: "Тестовий Тест Тестович",
        slug: "smoketest-teacher",
        degree: "кандидат наук",
        appointments: [
          {
            unit: { relationTo: "departments", value: department.id },
            position: "доцент",
            isPrimary: true,
          },
        ],
      },
    }),
  );

  const instituteWithDepts = await payload.findByID({
    collection: "institutes",
    id: institute.id,
    depth: 0,
    joins: { departments: { limit: 50 } },
  });
  const deptIds = joinIds((instituteWithDepts as { departments?: unknown }).departments);
  if (!deptIds.includes(String(department.id))) {
    throw new Error(`departments join on the institute did not return ${department.id}`);
  }

  const deptWithStaff = await payload.findByID({
    collection: "departments",
    id: department.id,
    depth: 0,
    joins: { staff: { limit: 50 } },
  });
  const staffIds = joinIds((deptWithStaff as { staff?: unknown }).staff);
  if (!staffIds.includes(String(teacher.id))) {
    throw new Error(`staff join on the department did not return ${teacher.id}`);
  }

  // --- REST API: same shapes over HTTP, with a real session ---
  const login = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!login.ok) throw new Error(`REST login failed (${login.status}): ${await login.text()}`);
  const { token } = (await login.json()) as { token: string };
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };

  const restInstitute = await fetch(`${BASE}/api/institutes`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ name: "REST Інститут", order: 998 }),
  });
  if (!restInstitute.ok) throw new Error(`REST create failed (${restInstitute.status}): ${await restInstitute.text()}`);
  // Payload's REST create returns the document itself; the `doc` fallback
  // covers a version-wrapped response.
  const restBody = (await restInstitute.json()) as Record<string, unknown>;
  const restDoc = (restBody.doc ?? restBody) as { id?: string | number };
  if (restDoc.id == null) throw new Error(`REST create returned no id: ${JSON.stringify(restBody)}`);
  created.push({ collection: "institutes", id: restDoc.id });

  const list = await fetch(`${BASE}/api/institutes?limit=1&depth=0`, { headers: auth });
  if (!list.ok) throw new Error(`REST list failed (${list.status})`);

  console.log("smoketest OK — local API, joins and REST all worked");
} finally {
  // Reverse dependency order; `overrideAccess` so the deletions do not need a
  // session of their own.
  for (const { collection, id } of created.reverse()) {
    try {
      await payload.delete({ collection: collection as "institutes", id, overrideAccess: true });
    } catch (error) {
      console.warn(`cleanup: could not delete ${collection}/${id}:`, String(error));
    }
  }
  await payload.db.destroy?.();
}
