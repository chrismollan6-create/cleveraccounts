import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Postgres client for the portal.
 *
 * Server-only (uses the secret/service-role key). NEVER import from a client
 * component — that would leak the service role key into the browser bundle.
 *
 * This client bypasses RLS by virtue of using the service-role key. Defense
 * in depth: app-level scoping via `withAccountScope()` is the primary guard;
 * RLS policies on tables are belt-and-braces.
 *
 * For Phase 1 (read-only portal) we use this for:
 *   - portal.users (Clerk ↔ SF link)
 *   - portal.audit_log (forensic trail)
 *   - cached SF data once the sync webhook is wired
 */

let cached: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase server config missing — set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY in .env.local"
    );
  }

  cached = createClient(url, secretKey, {
    auth: {
      // Server context: no session persistence, no auto-refresh.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}
