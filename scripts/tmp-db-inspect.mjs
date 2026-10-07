import { DatabaseSync } from "node:sqlite";
import { homedir } from "node:os";
import { join } from "node:path";

const db = new DatabaseSync(join(homedir(), ".local/share/opencode/opencode.db"), {
  readOnly: true,
});
const sid = process.argv[2];
const limit = Number(process.argv[3] ?? 6);

const msgs = db
  .prepare("select * from message where session_id = ? order by time_created desc limit ?")
  .all(sid, limit * 4);

for (const m of msgs.reverse()) {
  const d = JSON.parse(m.data);
  console.log("=== ", m.id, d.role, new Date(m.time_created).toISOString());
  const parts = db.prepare("select * from part where message_id = ?").all(m.id);
  for (const p of parts) {
    const pd = JSON.parse(p.data);
    if (pd.type === "text") {
      console.log("  TEXT:", pd.text.slice(0, 3000));
    } else if (pd.type === "tool") {
      const st = pd.state ?? {};
      const input = JSON.stringify(st.input ?? {}).slice(0, 300);
      const out = typeof st.output === "string" ? st.output.slice(0, 800) : JSON.stringify(st.output ?? "").slice(0, 800);
      console.log("  TOOL:", pd.tool, "status:", st.status, "\n    in:", input, "\n    out:", out);
    } else {
      console.log("  [", pd.type, "]", JSON.stringify(pd).slice(0, 300));
    }
  }
}
