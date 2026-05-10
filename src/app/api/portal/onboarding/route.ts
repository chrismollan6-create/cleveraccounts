import { NextResponse } from "next/server";
import { getOnboardingForCurrentUser, isOnboardingError } from "@/lib/portal/onboarding";

/**
 * GET /api/portal/onboarding
 *
 * Returns the portal-safe onboarding status for the current user.
 *
 * Response shape:
 *   200 OK              { workflowId, currentStage, stages: [...], accountant: {...}, ... }
 *   200 OK + null body  no active workflow for this account
 *   401 UNAUTHORIZED    not signed in
 *   503 MAPPING_NOT_WIRED  PORTAL_DEV_ACCOUNT_ID not set in dev
 *   5xx                 SF/network error
 */
export async function GET() {
  const result = await getOnboardingForCurrentUser();

  if (isOnboardingError(result)) {
    return NextResponse.json(
      { error: result.error, message: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data);
}
