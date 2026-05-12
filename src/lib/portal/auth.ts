import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getPortalDb, schema } from "./db/client";
import type { PortalBrand, PortalUserStatus } from "./db/schema";

/**
 * Portal user resolution — the chokepoint between Clerk (auth) and Salesforce
 * (data). Every server component / API route that reads portal data goes
 * through this; it returns the SF Account + Contact context the user is
 * authorised for.
 *
 * Cached per-request via React `cache()` so layout, dashboard, and any other
 * server component on the same request only hit Postgres once.
 *
 * Replaces the Phase-1 `PORTAL_DEV_ACCOUNT_ID` dev hack.
 */

export interface PortalUser {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  /** SF Account this user is mapped to. Null when status = 'disabled'. */
  accountSfId: string | null;
  contactSfId: string | null;
  brand: PortalBrand | null;
  status: PortalUserStatus;
}

/**
 * Returns the current authenticated portal user, mapped to their SF Account.
 *
 * Returns null when:
 *   - User is not signed in
 *   - User signed in but has no portal.users row yet (e.g. webhook hasn't
 *     fired — should be milliseconds, race-condition only)
 *
 * Returns a row with status='disabled' when the user signed in but their
 * email doesn't map to any SF Contact. Callers should render the AccessGate
 * UI instead of data.
 */
export const getCurrentPortalUser = cache(async function (): Promise<PortalUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // Parallel: kick off the Clerk profile fetch AND the portal.users
  // Postgres lookup at the same time. Previously these ran serially,
  // adding ~200-300ms of avoidable latency on every server render.
  // The DB query doesn't need the Clerk user object — it keys on userId,
  // which `auth()` already gave us.
  const db = getPortalDb();
  const [clerkUser, rows] = await Promise.all([
    currentUser(),
    db
      .select()
      .from(schema.users)
      .where(eq(schema.users.clerkUserId, userId))
      .limit(1),
  ]);

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;
  const firstName = clerkUser?.firstName ?? null;
  const lastName = clerkUser?.lastName ?? null;

  if (rows.length === 0) {
    // Webhook hasn't fired yet — return a "pending" placeholder so the
    // dashboard can render a "setting up your portal..." state instead of
    // 404'ing.
    return {
      clerkUserId: userId,
      email,
      firstName,
      lastName,
      accountSfId: null,
      contactSfId: null,
      brand: null,
      status: "pending",
    };
  }

  const row = rows[0];
  return {
    clerkUserId: row.clerkUserId,
    email: row.email,
    firstName,
    lastName,
    accountSfId: row.status === "disabled" ? null : row.accountSfId,
    contactSfId: row.status === "disabled" ? null : row.contactSfId,
    brand: row.brand,
    status: row.status,
  };
});

/** Convenience: throws when no signed-in portal user — for code paths that demand auth. */
export async function requirePortalUser(): Promise<PortalUser> {
  const user = await getCurrentPortalUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
