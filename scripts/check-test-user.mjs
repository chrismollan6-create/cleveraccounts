import postgres from "postgres";
import { config } from "dotenv";
config({ path: ".env.local" });
const sql = postgres(process.env.SUPABASE_DB_URL, { prepare: false, max: 1, connect_timeout: 10 });
try {
  console.log("\n=== portal.users (clerk test users) ===");
  const u = await sql`
    SELECT clerk_user_id, account_sf_id, contact_sf_id, brand, status, email
    FROM portal.users
    WHERE email LIKE '%clerk_test%' OR email LIKE 'chris%'
  `;
  for (const r of u) console.log("  ", r);
  console.log("\n=== portal.workflows count ===");
  const w = await sql`SELECT COUNT(*)::int AS n FROM portal.workflows`;
  console.log("  workflows in cache:", w[0].n);
  console.log("\n=== portal.accounts count ===");
  const a = await sql`SELECT COUNT(*)::int AS n FROM portal.accounts`;
  console.log("  accounts in cache:", a[0].n);
} finally { await sql.end(); }
