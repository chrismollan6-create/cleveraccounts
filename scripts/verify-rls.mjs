import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = postgres(process.env.SUPABASE_DB_URL, {
  prepare: false,
  max: 1,
  connect_timeout: 10,
});

try {
  const rows = await sql`
    SELECT n.nspname AS schema, c.relname AS table, c.relrowsecurity AS rls_enabled
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'portal'
    AND c.relkind = 'r'
    AND c.relname NOT LIKE '_drizzle%'
    ORDER BY c.relname
  `;
  for (const r of rows) {
    const flag = r.rls_enabled ? "✓ RLS on " : "✘ RLS off";
    console.log(`  ${flag}  portal.${r.table}`);
  }
} finally {
  await sql.end();
}
