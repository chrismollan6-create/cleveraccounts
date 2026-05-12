import postgres from "postgres";
import { config } from "dotenv";
config({ path: ".env.local" });
const sql = postgres(process.env.SUPABASE_DB_URL, { prepare: false, max: 1, connect_timeout: 10 });
try {
  const w = await sql`
    SELECT sf_id, account_sf_id, current_stage, signed_off_at, raw
    FROM portal.workflows
    WHERE account_sf_id = '001Q100000XuwueIAB'
    LIMIT 1
  `;
  if (w.length === 0) {
    console.log("No workflow cached for that account");
  } else {
    console.log("sf_id:", w[0].sf_id);
    console.log("account_sf_id:", w[0].account_sf_id);
    console.log("current_stage:", w[0].current_stage);
    console.log("signed_off_at:", w[0].signed_off_at);
    console.log("\nraw keys:", w[0].raw ? Object.keys(w[0].raw) : "(null)");
    console.log("\nraw sample:");
    console.log(JSON.stringify(w[0].raw, null, 2).slice(0, 2000));
  }
} finally { await sql.end(); }
