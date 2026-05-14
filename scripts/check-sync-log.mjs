// Reads the last N rows of portal.sync_log so we can verify the
// SF → Postgres pipeline end-to-end. Used during Stage 3C verification.
// Run: node scripts/check-sync-log.mjs [limit]
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const limit = Number.parseInt(process.argv[2] ?? "10", 10);

const sql = postgres(process.env.SUPABASE_DB_URL, {
  prepare: false,
  max: 1,
  connect_timeout: 10,
});

try {
  const rows = await sql`
    SELECT
      at,
      object_type,
      sf_id,
      operation,
      status,
      latency_ms,
      coalesce(error_message, '') AS error_message
    FROM portal.sync_log
    ORDER BY at DESC
    LIMIT ${limit}
  `;

  if (rows.length === 0) {
    console.log("portal.sync_log is empty — no sync events processed yet.");
  } else {
    console.log(`Most recent ${rows.length} portal.sync_log row(s):\n`);
    for (const r of rows) {
      const status = r.status === "success" ? "✓" : "✘";
      const lat = r.latency_ms != null ? ` (${r.latency_ms}ms)` : "";
      const err = r.error_message ? `\n    → ${r.error_message}` : "";
      console.log(
        `  ${status} ${r.at.toISOString()}  ${r.object_type.padEnd(24)} ${r.operation.padEnd(8)} ${r.sf_id}${lat}${err}`
      );
    }
  }

  // Cache counts so we can confirm rows are actually landing in tables
  const counts = await sql`
    SELECT 'accounts' AS t, COUNT(*) AS n FROM portal.accounts
    UNION ALL SELECT 'contacts', COUNT(*) FROM portal.contacts
    UNION ALL SELECT 'cases', COUNT(*) FROM portal.cases
    UNION ALL SELECT 'email_messages', COUNT(*) FROM portal.email_messages
    UNION ALL SELECT 'workflows', COUNT(*) FROM portal.workflows
    UNION ALL SELECT 'engagement_letters', COUNT(*) FROM portal.engagement_letters
    UNION ALL SELECT 'accountants', COUNT(*) FROM portal.accountants
    ORDER BY t
  `;
  console.log("\nCache row counts:");
  for (const c of counts) {
    console.log(`  ${c.t.padEnd(20)} ${c.n}`);
  }
} finally {
  await sql.end();
}
