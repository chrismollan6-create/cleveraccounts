import { NextRequest, NextResponse } from "next/server";
import { verifyViewAsToken } from "@/lib/portal/viewAsToken";
import { startImpersonation } from "@/lib/portal/impersonation";
import { logPortalEvent } from "@/lib/portal/audit";

/**
 * GET /portal/view-as?token=<sf-minted-token>
 *
 * Entry point for staff "view as" — opened from the Salesforce Account record.
 * Verifies the Salesforce-minted launch token, then establishes a read-only
 * impersonation session and drops the staff member on the client's dashboard.
 *
 * This route is allowed through the auth middleware without a Clerk session
 * (staff have none) — the token IS the credential, verified here.
 */
export const runtime = "nodejs"; // node:crypto for HMAC verification

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const claims = verifyViewAsToken(token);

  if (!claims) {
    await logPortalEvent({
      action: "view_as_denied",
      metadata: { reason: "invalid_or_expired_token" },
      override: { clerkUserId: "staff:unknown" },
    });
    return NextResponse.redirect(new URL("/portal/sign-in?view_as=invalid", req.url));
  }

  const started = await startImpersonation(claims);
  if (!started) {
    return NextResponse.redirect(new URL("/portal/sign-in?view_as=error", req.url));
  }

  await logPortalEvent({
    action: "view_as_start",
    target: claims.accountId,
    metadata: { staffUserId: claims.staffUserId, staffName: claims.staffName },
    override: { clerkUserId: `staff:${claims.staffUserId}`, accountSfId: claims.accountId },
  });

  return NextResponse.redirect(new URL("/portal/dashboard", req.url));
}
