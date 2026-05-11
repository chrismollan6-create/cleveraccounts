// Quick sanity check — connect to Supabase, list portal.* tables.
// Run with: node scripts/check-portal-schema.mjs
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = postgres(process.env.SUPABASE_DB_URL, { prepare: false, max: 1 });

try {
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'portal'
    ORDER BY table_name
  `;
  console.log("portal.* tables:", tables.map((r) => r.table_name));

  const indexes = await sql`
    SELECT tablename, indexname
    FROM pg_indexes
    WHERE schemaname = 'portal'
    ORDER BY tablename, indexname
  `;
  console.log("portal.* indexes:");
  for (const row of indexes) console.log(`  ${row.tablename}.${row.indexname}`);
} finally {
  await sql.end();
}
