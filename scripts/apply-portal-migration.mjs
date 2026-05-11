// Apply the latest portal migration SQL directly — bypasses drizzle-kit migrate
// which has been finicky with the Supabase transaction pooler.
//
// Run: node scripts/apply-portal-migration.mjs
import postgres from "postgres";
import { config } from "dotenv";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env.local" });

const migrationsDir = "db/migrations";
const sqlFiles = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (sqlFiles.length === 0) {
  console.error("No migration SQL files found in", migrationsDir);
  process.exit(1);
}

const sql = postgres(process.env.SUPABASE_DB_URL, {
  prepare: false,
  max: 1,
  connect_timeout: 10,
});

try {
  for (const file of sqlFiles) {
    const path = join(migrationsDir, file);
    const content = readFileSync(path, "utf8");
    // Split on Drizzle's statement breakpoint marker, drop empty entries
    const statements = content
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`\n▶ Applying ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      const preview = stmt.split("\n")[0].substring(0, 80);
      process.stdout.write(`  · ${preview}... `);
      try {
        await sql.unsafe(stmt);
        process.stdout.write("✓\n");
      } catch (e) {
        // Idempotency: skip "already exists" errors (e.g. when partial-applied prior)
        if (/already exists/i.test(e.message)) {
          process.stdout.write("(already exists, skipping)\n");
        } else {
          throw e;
        }
      }
    }
  }

  console.log("\n✓ All migrations applied.");

  // Verify
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'portal'
    AND table_name NOT LIKE '_drizzle%'
    ORDER BY table_name
  `;
  console.log("\nportal.* tables:", tables.map((r) => r.table_name).join(", "));
} catch (err) {
  console.error("\n✘ Migration failed:", err.message);
  process.exit(1);
} finally {
  await sql.end();
}
