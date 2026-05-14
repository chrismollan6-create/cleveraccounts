// Apply a single specific migration SQL file.
// Run: node scripts/apply-portal-migration-only.mjs db/migrations/0001_simple_madame_web.sql
import postgres from "postgres";
import { config } from "dotenv";
import { readFileSync } from "node:fs";

config({ path: ".env.local" });

const path = process.argv[2];
if (!path) {
  console.error("Usage: node scripts/apply-portal-migration-only.mjs <path-to-sql>");
  process.exit(1);
}

const sql = postgres(process.env.SUPABASE_DB_URL, {
  prepare: false,
  max: 1,
  connect_timeout: 10,
  // Bump statement timeout client-side so index creates on small tables don't
  // get killed by the Supabase pooler default
  connection: { statement_timeout: "60000" },
});

try {
  const content = readFileSync(path, "utf8");
  const statements = content
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`▶ Applying ${path} (${statements.length} statements)`);
  for (const stmt of statements) {
    const preview = stmt.split("\n")[0].substring(0, 80);
    process.stdout.write(`  · ${preview}... `);
    try {
      await sql.unsafe(stmt);
      process.stdout.write("✓\n");
    } catch (e) {
      if (/already exists/i.test(e.message)) {
        process.stdout.write("(already exists, skipping)\n");
      } else {
        process.stdout.write("✘\n");
        throw e;
      }
    }
  }

  console.log("\n✓ Migration applied.");

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
