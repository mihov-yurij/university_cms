// Fails the Vercel build before `payload migrate` if a required environment
// variable is missing, naming every absent key at once. Without this the first
// symptom is Payload's `missing secret key`, which says nothing about which of
// the project's variables the build never received.
//
// Presence only — values are never printed, and Vercel would redact a secret
// long enough to show up in the log anyway.

const required = [
  "PAYLOAD_SECRET",
  "DATABASE_URI",
  "DATABASE_URI_UNPOOLED",
];

const optional = ["R2_BUCKET", "R2_PUBLIC_URL"];

const missing = required.filter((name) => !process.env[name]);

console.log(`build env — VERCEL_ENV=${process.env.VERCEL_ENV ?? "(unset)"}`);
for (const name of required) {
  console.log(`  ${missing.includes(name) ? "MISSING" : "ok     "} ${name}`);
}
for (const name of optional) {
  console.log(`  ${process.env[name] ? "ok     " : "unset  "} ${name} (optional)`);
}

if (missing.length) {
  console.error(
    `\nSet ${missing.join(", ")} in the Vercel dashboard under ` +
      `Settings → Environment Variables, tick Production, then redeploy.`,
  );
  process.exit(1);
}
