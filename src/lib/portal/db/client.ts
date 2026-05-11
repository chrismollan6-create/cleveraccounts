import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Portal database client — Drizzle ORM over postgres.js, connected to Supabase
 * Postgres via the Transaction pooler (port 6543). Server-only — never import
 * from a client component (the connection string contains the database
 * password and would leak into the browser bundle).
 *
 * Cached across invocations on the same worker so we don't open a new
 * connection per request (Netlify / Vercel serverless reuse function
 * instances).
 */

const globalForDb = globalThis as unknown as {
  __portalDbClient?: postgres.Sql;
};

function getConnection(): postgres.Sql {
  if (globalForDb.__portalDbClient) return globalForDb.__portalDbClient;

  const url = process.env.SUPABASE_DB_URL;
  if (!url) {
    throw new Error(
      "SUPABASE_DB_URL is missing. Set it in .env.local (dev) or Netlify env vars (prod)."
    );
  }

  const client = postgres(url, {
    // Transaction pooler doesn't support PREPARE statements across pooled
    // connections — postgres.js needs this hint to avoid using them.
    prepare: false,
    // Reasonable pool size for serverless. Tune later based on observed perf.
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  globalForDb.__portalDbClient = client;
  return client;
}

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getPortalDb() {
  if (cachedDb) return cachedDb;
  cachedDb = drizzle(getConnection(), { schema });
  return cachedDb;
}

export { schema };
