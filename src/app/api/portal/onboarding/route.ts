import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { getOnboardingForCurrentUser, isOnboardingError } from "@/lib/portal/onboarding";
import { checkPortalApiLimit, rateLimitResponse } from "@/lib/portal/ratelimit";

/**
 * GET /api/portal/onboarding
 *
 * Returns the portal-safe onboarding status for the current user.
 *
 * Response shape:
 *   200 OK              { workflowId, currentStage, stages: [...], accountant: {...}, ... }
 *   200 OK + null body  no active workflow for this account
 *   401 UNAUTHORIZED    not signed in
 *   429 RATE_LIMITED    too many requests (sliding window 30/60s per user|ip)
 *   503 MAPPING_NOT_WIRED  PORTAL_DEV_ACCOUNT_ID not set in dev (legacy — Foundation 1 removes this)
 *   5xx                 SF/network error
 */
export async function GET() {
  // Rate limit gate — key by Clerk user id when available, fall back to IP.
  // (Upstash env-var-less mode is a no-op so the endpoint stays responsive
  // until rate limiting is configured.)
  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const identifier = userId ?? `ip:${ip}`;
  const rl = await checkPortalApiLimit(identifier);
  if (!rl.ok) return rateLimitResponse(rl);

  const result = await getOnboardingForCurrentUser();

  if (isOnboardingError(result)) {
    return NextResponse.json(
      { error: result.error, message: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data);
}
