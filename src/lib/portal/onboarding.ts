import { cache } from "react";
import { getCurrentPortalUser } from "./auth";
import { fetchPortalApex } from "./salesforce";
import type { PortalOnboardingStatus } from "./types";

/**
 * Discriminated union for onboarding load. Distinct from `PortalApexResult`
 * so callers don't need to worry about the API's generic shape.
 *
 * `data === null` inside ok=true means "no active workflow for this account"
 * (long-standing client past sign-off) — distinct from an error.
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
 * Resolves the SF Account from `portal.users` (the Clerk↔SF link table)
 * rather than the old `PORTAL_DEV_ACCOUNT_ID` env var. After Foundation 1
 * lands this is the proper IDOR-safe path.
 *
 * Cached per-request via React `cache()` so layout + dashboard sharing this
 * function only call SF once.
 */
export const getOnboardingForCurrentUser = cache(async function (): Promise<OnboardingResult> {
  const user = await getCurrentPortalUser();
  if (!user) {
    return { ok: false, status: 401, error: "UNAUTHORIZED", message: "Not signed in" };
  }

  // Status-based gating — dashboard handles UI for these states elsewhere.
  if (user.status === "disabled") {
    return {
      ok: false,
      status: 403,
      error: "ACCESS_DENIED",
      message:
        "We don't have your email on file. Please contact your accountant to get set up.",
    };
  }

  if (user.status === "pending") {
    return {
      ok: false,
      status: 202,
      error: "PENDING",
      message: "Setting up your portal — refresh in a moment.",
    };
  }

  if (!user.accountSfId) {
    return {
      ok: false,
      status: 500,
      error: "NO_ACCOUNT",
      message: "User has active status but no Salesforce Account link.",
    };
  }

  const result = await fetchPortalApex<PortalOnboardingStatus>("/onboarding", {
    accountId: user.accountSfId,
  });

  if (result.ok === true) {
    return { ok: true, data: result.data };
  }

  // 404 from Apex = "no active workflow" — surface as ok with null data.
  if (result.status === 404 && result.error === "NOT_FOUND") {
    return { ok: true, data: null };
  }

  return {
    ok: false,
    status: result.status,
    error: result.error,
    message: result.message,
  };
});
