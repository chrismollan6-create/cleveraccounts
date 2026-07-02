import type { PortalUser } from "./auth";
import type { PortalBrand } from "./db/schema";

/**
 * The PURE authorization decision at the heart of the portal's IDOR defence.
 *
 * Deliberately kept in its own dependency-free module (no Clerk, no DB, no
 * `getPortalDb`) so it can be unit-tested exhaustively without any infra —
 * see scopeDecision.test.mjs. `withPortalScope()` is the thin runtime wrapper
 * that resolves the current user, calls this, and (on success) attaches the DB
 * handle before handing scope to the caller.
 *
 * Every deny path here is a security boundary: if this returns `ok: false`,
 * NO account data is ever reachable for the request.
 */

export type PortalScopeDeniedReason =
  | "not_signed_in" // No Clerk session
  | "no_link_row" // Signed in but webhook hasn't created portal.users row yet
  | "pending" // Linked but workflow not yet active (long-standing client)
  | "disabled" // Soft-blocked — email doesn't match any SF Contact
  | "missing_account"; // Active status but accountSfId is somehow null

/** Scope minus the DB handle — the part the pure decision can produce. */
export interface BasePortalScope {
  accountSfId: string;
  contactSfId: string;
  brand: PortalBrand;
  clerkUserId: string;
  email: string;
}

// `reason`/`scope` are declared on BOTH arms (optional) so callers can read
// them without discriminated-union narrowing — this repo runs tsconfig
// `strict: false`, under which `if (!decision.ok)` does NOT refine the union.
export type ScopeDecision =
  | { ok: true; scope: BasePortalScope; reason?: undefined }
  | { ok: false; reason: PortalScopeDeniedReason; scope?: undefined };

/**
 * Decide whether a resolved portal user is authorised, and for which account.
 *
 * Order matters — most-specific denial first — so callers can render the right
 * gate UI (disabled vs pending vs setting-up). Only a fully `active` user with
 * a non-empty account/contact/brand triple is granted scope.
 */
export function decidePortalScope(user: PortalUser | null): ScopeDecision {
  if (!user) {
    return { ok: false, reason: "not_signed_in" };
  }
  if (user.status === "disabled") {
    return { ok: false, reason: "disabled" };
  }
  if (user.status === "pending") {
    return { ok: false, reason: "pending" };
  }
  if (user.status !== "active") {
    return { ok: false, reason: "no_link_row" };
  }
  if (!user.accountSfId || !user.contactSfId || !user.brand) {
    return { ok: false, reason: "missing_account" };
  }
  return {
    ok: true,
    scope: {
      accountSfId: user.accountSfId,
      contactSfId: user.contactSfId,
      brand: user.brand,
      clerkUserId: user.clerkUserId,
      email: user.email ?? "",
    },
  };
}
