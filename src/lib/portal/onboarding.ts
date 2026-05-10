import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { fetchPortalApex } from "./salesforce";
import type { PortalOnboardingStatus } from "./types";

/**
 * Discriminated union for onboarding load. Distinct from `PortalApexResult`
 * so callers don't need to worry about the API's generic shape — they get
 * either `{ ok: true, data: status | null }` or a clean error.
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
 * Phase 1 dev shortcut: pin to a `PORTAL_DEV_ACCOUNT_ID` env var. Replaced
 * by a Postgres lookup against the `portal.users` link table once Track A
 * lands.
 */
async function resolveAccountIdForCurrentUser(): Promise<
  | { ok: true; accountId: string }
  | { ok: false; status: number; error: string; message: string }
> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, status: 401, error: "UNAUTHORIZED", message: "Not signed in" };
  }

  const devAccountId = process.env.PORTAL_DEV_ACCOUNT_ID;
  if (devAccountId && devAccountId.length >= 15) {
    return { ok: true, accountId: devAccountId };
  }

  return {
    ok: false,
    status: 503,
    error: "MAPPING_NOT_WIRED",
    message:
      "Clerk→Salesforce account mapping not yet implemented. Set PORTAL_DEV_ACCOUNT_ID in .env.local for dev testing.",
  };
}

/**
 * Fetch the portal-safe onboarding status for the current authenticated user.
 *
 * Used by both the dashboard server component and the `/api/portal/onboarding`
 * route handler so the auth + lookup + Apex call lives in one place.
 *
 * Wrapped in React `cache()` so layout + page both calling it within the same
 * request only hit Salesforce once — saves us a duplicate API call for
 * sidebar notification counts that the layout drives.
 *
 * Returns `{ ok: true, data: null }` when the resolved Account has no active
 * workflow (e.g. fully signed off) — distinct from an error.
 */
export const getOnboardingForCurrentUser = cache(async function (): Promise<OnboardingResult> {
  const resolved = await resolveAccountIdForCurrentUser();
  if (resolved.ok === false) {
    return {
      ok: false,
      status: resolved.status,
      error: resolved.error,
      message: resolved.message,
    };
  }

  const result = await fetchPortalApex<PortalOnboardingStatus>("/onboarding", {
    accountId: resolved.accountId,
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
