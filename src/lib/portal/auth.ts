import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Portal user resolution.
 *
 * `getCurrentPortalUser()` is the chokepoint that maps a Clerk session to
 * the user's Salesforce Account/Contact. Every portal API route + server
 * component that reads scoped data MUST go through this — it's where the
 * IDOR-prevention boundary lives.
 *
 * Phase 1 stub: returns the Clerk user only. Once the SF↔Clerk link table
 * (portal.users in Postgres) exists, this will additionally return
 * `{ accountSfId, contactSfId, brand }` so callers can scope SOQL/Postgres
 * queries by Account.
 */

export interface PortalUser {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  // Populated after the portal.users link table exists (Track A + sync):
  accountSfId: string | null;
  contactSfId: string | null;
  brand: "clever" | "workwell" | null;
}

/**
 * Returns the current authenticated portal user, or null if not signed in.
 * Throws if the Clerk session exists but no SF mapping is found AND we're
 * past Phase 1 (toggle via env once Track A lands).
 */
export async function getCurrentPortalUser(): Promise<PortalUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  return {
    clerkUserId: userId,
    email: user.emailAddresses?.[0]?.emailAddress ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    // TODO(Track A): populate from portal.users link table.
    accountSfId: null,
    contactSfId: null,
    brand: null,
  };
}

/** Convenience: throws if not signed in. Use in server-only code paths. */
export async function requirePortalUser(): Promise<PortalUser> {
  const user = await getCurrentPortalUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
}
