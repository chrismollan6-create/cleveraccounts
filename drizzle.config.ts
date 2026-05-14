import type { Config } from "drizzle-kit";
import { config as dotenvConfig } from "dotenv";

// Load .env.local first (dev), then .env as fallback
dotenvConfig({ path: ".env.local" });
dotenvConfig();

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  throw new Error(
    "SUPABASE_DB_URL is required for drizzle-kit. Set it in .env.local or env vars."
  );
}

export default {
  schema: "./src/lib/portal/db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
  // Portal-specific schema — keep DDL out of Supabase's default `public` schema
  schemaFilter: ["portal"],
  // Run migrations against the portal schema explicitly
  migrations: {
    schema: "portal",
    table: "_drizzle_migrations",
  },
  verbose: true,
  strict: true,
} satisfies Config;
