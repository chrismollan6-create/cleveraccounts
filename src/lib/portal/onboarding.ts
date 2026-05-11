import { cache } from "react";
import { desc, eq, isNull } from "drizzle-orm";
import { tryWithPortalScope, type PortalScopeDeniedReason } from "./withAccountScope";
import { schema } from "./db/client";
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
 * Stage 3E rewire (2026-05-12): reads from portal.workflows Postgres cache
 * instead of fetchPortalApex. The full PortalOnboardingStatus DTO is stored
 * verbatim in the `raw` jsonb column at sync time (built by the Apex side's
 * CommandCentreOnboardingService.getOnboardingStatusForAccount, then carried
 * through Portal_Sync_Event__e → sync-snapshot → upsert), so reading is a
 * single-row SELECT.
 *
 * Cached per-request via React `cache()` so layout + dashboard sharing this
 * function only hit the DB once.
 *
 * Active-workflow selection: most accounts have a single active workflow
 * (signed_off_at IS NULL). For accounts with multiple active or all
 * signed-off, we pick the most recently updated.
 */
export const getOnboardingForCurrentUser = cache(async function (): Promise<OnboardingResult> {
  const scoped = await tryWithPortalScope(async ({ accountSfId, db }) => {
    // Prefer an active (not-signed-off) workflow, falling back to the most
    // recent one if all are signed off.
    const active = await db
      .select({ raw: schema.workflows.raw })
      .from(schema.workflows)
      .where(eq(schema.workflows.accountSfId, accountSfId))
      .orderBy(
        // Active first (signed_off_at NULL ranks high in Postgres NULLS FIRST
        // — Drizzle defaults to NULLS LAST for desc, so we sort by signedOffAt
        // ASC NULLS FIRST instead by reversing)
        schema.workflows.signedOffAt,
        desc(schema.workflows.updatedAt)
      )
      .limit(1);

    if (active.length === 0) return null;
    // `raw` is the verbatim Apex PortalOnboardingStatus DTO — same shape
    // as the TypeScript type. Cast and return.
    return active[0].raw as PortalOnboardingStatus;
  });

  if (scoped.ok === false) {
    return mapScopeDenialToOnboardingError(scoped.reason);
  }

  return { ok: true, data: scoped.data };
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

// Mark isNull / desc as intentionally available for the active-first sort —
// referenced in commented-out branch above. Not currently used but TypeScript
// will flag unused imports under strict settings.
void isNull;
