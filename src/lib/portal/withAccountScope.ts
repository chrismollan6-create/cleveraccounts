import { getCurrentPortalUser, type PortalUser } from "./auth";
import { getPortalDb } from "./db/client";
import type { PortalBrand } from "./db/schema";
import { decidePortalScope, type PortalScopeDeniedReason } from "./scopeDecision";
import { getImpersonationSession } from "./impersonation";

// Re-exported so existing importers (`./withAccountScope`) keep working after
// the pure decision logic moved to ./scopeDecision.
export type { PortalScopeDeniedReason } from "./scopeDecision";

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
  /** Clerk user id, in case audit logs need it. For staff view-as this is `staff:<sfUserId>`. */
  clerkUserId: string;
  /** Verified email, lowercased. Empty under a staff view-as session. */
  email: string;
  /** Portal DB client — already cached, included so callers don't have to import. */
  db: ReturnType<typeof getPortalDb>;
  /**
   * True when this scope came from a staff "view as" impersonation session.
   * Reads are allowed; ALL writes must be refused — call assertWritable(scope)
   * at the top of any mutation.
   */
  readOnly: boolean;
  /** SF User id of the staff member, when readOnly (view-as); null otherwise. */
  impersonatedBy: string | null;
}

/**
 * Guard for mutation paths — throws when the scope is a read-only staff
 * view-as session, so an impersonating staff member can never write AS the
 * client (send a message, upload, approve, switch company, …). Call this at
 * the very top of every write.
 */
export function assertWritable(scope: PortalAccountScope): void {
  if (scope.readOnly) {
    throw new PortalScopeDeniedError("read_only", null);
  }
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
  // Staff "view as" takes precedence: a valid impersonation session scopes the
  // request READ-ONLY to the impersonated account, bypassing Clerk-user
  // resolution entirely. getImpersonationSession verifies the cookie's HMAC —
  // a forged/expired cookie returns null and we fall through to normal auth.
  const imp = await getImpersonationSession();
  if (imp) {
    return caller({
      accountSfId: imp.accountSfId,
      contactSfId: imp.contactSfId ?? "",
      brand: imp.brand,
      clerkUserId: `staff:${imp.staffUserId}`,
      email: "",
      db: getPortalDb(),
      readOnly: true,
      impersonatedBy: imp.staffUserId,
    });
  }

  const user = await getCurrentPortalUser();

  const decision = decidePortalScope(user);
  if (!decision.ok) {
    throw new PortalScopeDeniedError(decision.reason, user);
  }

  return caller({
    ...decision.scope,
    db: getPortalDb(),
    readOnly: false,
    impersonatedBy: null,
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
