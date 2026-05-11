import { cache } from "react";
import { fetchPortalApex } from "./salesforce";
import { tryWithPortalScope, type PortalScopeDeniedReason } from "./withAccountScope";
import type { PortalOnboardingStatus } from "./types";

/**
 * Discriminated union for onboarding load. Carries either the data or a
 * scope-denial / API-error reason the dashboard can render appropriate UI for.
 */
export interface OnboardingOk {
  ok: true;
  data: PortalOnboardingStatus | null;
}
export interface OnboardingErr {
  ok: false;
  status: number;
  error: string;
  message: string;
}
export type OnboardingResult = OnboardingOk | OnboardingErr;

/** Type guard — necessary because tsconfig has strict: false (no strictNullChecks). */
export function isOnboardingError(r: OnboardingResult): r is OnboardingErr {
  return r.ok === false;
}

/**
 * Fetch the portal-safe onboarding status for the current authenticated user.
 *
 * Routed through `withPortalScope()` — the central IDOR-prevention chokepoint.
 * The caller never sees or supplies the Account id; it's resolved from the
 * `portal.users` link row and pinned to the request.
 *
 * Cached per-request via React `cache()` so layout + dashboard sharing this
 * function only call SF once.
 */
export const getOnboardingForCurrentUser = cache(async function (): Promise<OnboardingResult> {
  const scoped = await tryWithPortalScope(async ({ accountSfId, contactSfId, brand, clerkUserId }) => {
    return fetchPortalApex<PortalOnboardingStatus>(
      { clerkUserId, accountId: accountSfId, contactId: contactSfId, brand },
      "/onboarding"
    );
  });

  if (scoped.ok === false) {
    return mapScopeDenialToOnboardingError(scoped.reason);
  }

  const apexResult = scoped.data;
  if (apexResult.ok === true) {
    return { ok: true, data: apexResult.data };
  }

  // 404 from Apex = "no active workflow" — surface as ok with null data.
  if (apexResult.status === 404 && apexResult.error === "NOT_FOUND") {
    return { ok: true, data: null };
  }

  return {
    ok: false,
    status: apexResult.status,
    error: apexResult.error,
    message: apexResult.message,
  };
});

function mapScopeDenialToOnboardingError(reason: PortalScopeDeniedReason): OnboardingErr {
  switch (reason) {
    case "not_signed_in":
      return { ok: false, status: 401, error: "UNAUTHORIZED", message: "Not signed in" };
    case "disabled":
      return {
        ok: false,
        status: 403,
        error: "ACCESS_DENIED",
        message: "We don't have your email on file. Please contact your accountant.",
      };
    case "pending":
    case "no_link_row":
      return {
        ok: false,
        status: 202,
        error: "PENDING",
        message: "Setting up your portal — refresh in a moment.",
      };
    case "missing_account":
      return {
        ok: false,
        status: 500,
        error: "NO_ACCOUNT",
        message: "User has active status but no Salesforce Account link.",
      };
  }
}
