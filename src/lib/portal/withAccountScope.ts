import { getCurrentPortalUser, type PortalUser } from "./auth";
import { getPortalDb } from "./db/client";
import type { PortalBrand } from "./db/schema";

/**
 * Account scope — what every portal data operation gets handed.
 *
 * The whole point of this module: server-side code that touches user data
 * (SF queries, Postgres queries, document downloads, messaging) MUST go
 * through `withPortalScope()`. The wrapper resolves the SF Account from
 * the authenticated Clerk session and hands callers ONLY that Account's id
 * — making it structurally impossible to read another user's data.
 *
 * This is the central IDOR-prevention chokepoint. If you find yourself
 * adding a "passing accountId from request body" code path, stop — pipe
 * it through here instead.
 */
export interface PortalAccountScope {
  /** Source-of-truth SF Account id for the signed-in user. */
  accountSfId: string;
  /** SF Contact id (the specific person, distinct from the firm). */
  contactSfId: string;
  /** Brand the user belongs to — for theming + Calendly routing. */
  brand: PortalBrand;
  /** Clerk user id, in case audit logs need it. */
  clerkUserId: string;
  /** Verified email, lowercased. */
  email: string;
  /** Portal DB client — already cached, included so callers don't have to import. */
  db: ReturnType<typeof getPortalDb>;
}

/**
 * Thrown when `withPortalScope()` is called on a session that doesn't have
 * an active SF Account mapping. Callers should catch this to render the
 * AccessGate UI instead of propagating to a 500.
 */
export class PortalScopeDeniedError extends Error {
  constructor(public readonly reason: PortalScopeDeniedReason, public readonly user: PortalUser | null) {
    super(`Portal scope denied: ${reason}`);
    this.name = "PortalScopeDeniedError";
  }
}

export type PortalScopeDeniedReason =
  | "not_signed_in"     // No Clerk session
  | "no_link_row"       // Signed in but webhook hasn't created portal.users row yet
  | "pending"           // Linked but workflow not yet active (long-standing client)
  | "disabled"          // Soft-blocked — email doesn't match any SF Contact
  | "missing_account";  // Active status but accountSfId is somehow null

/**
 * The wrapper. Resolves the current user's scope and hands it to the caller.
 *
 * Usage:
 *
 *   const result = await withPortalScope(async (scope) => {
 *     return fetchPortalApex(
 *       { clerkUserId: scope.clerkUserId, accountId: scope.accountSfId,
 *         contactId: scope.contactSfId, brand: scope.brand },
 *       '/onboarding'
 *     );
 *   });
 *
 * Throws `PortalScopeDeniedError` for any non-active state. Callers SHOULD
 * either catch and render AccessGate, OR use `tryWithPortalScope()` which
 * returns a discriminated union instead of throwing.
 */
export async function withPortalScope<T>(
  caller: (scope: PortalAccountScope) => Promise<T>
): Promise<T> {
  const user = await getCurrentPortalUser();

  if (!user) {
    throw new PortalScopeDeniedError("not_signed_in", null);
  }
  if (user.status === "disabled") {
    throw new PortalScopeDeniedError("disabled", user);
  }
  if (user.status === "pending") {
    throw new PortalScopeDeniedError("pending", user);
  }
  if (user.status !== "active") {
    throw new PortalScopeDeniedError("no_link_row", user);
  }
  if (!user.accountSfId || !user.contactSfId || !user.brand) {
    throw new PortalScopeDeniedError("missing_account", user);
  }

  return caller({
    accountSfId: user.accountSfId,
    contactSfId: user.contactSfId,
    brand: user.brand,
    clerkUserId: user.clerkUserId,
    email: user.email ?? "",
    db: getPortalDb(),
  });
}

/**
 * Result-typed variant — never throws. Use when you want to render UI based
 * on the denial reason (the typical dashboard / API-route case).
 */
export type PortalScopeResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: PortalScopeDeniedReason; user: PortalUser | null };

export async function tryWithPortalScope<T>(
  caller: (scope: PortalAccountScope) => Promise<T>
): Promise<PortalScopeResult<T>> {
  try {
    const data = await withPortalScope(caller);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof PortalScopeDeniedError) {
      return { ok: false, reason: err.reason, user: err.user };
    }
    throw err; // unexpected — propagate
  }
}
