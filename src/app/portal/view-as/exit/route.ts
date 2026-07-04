import { NextRequest, NextResponse } from "next/server";
import { getImpersonationSession, endImpersonation } from "@/lib/portal/impersonation";
import { logPortalEvent } from "@/lib/portal/audit";

/**
 * GET /portal/view-as/exit
 *
 * Ends a staff "view as" session (clears the impersonation cookie) and audits
 * it. Reached from the "Exit view-as" control in the impersonation banner.
 */
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getImpersonationSession();
  await endImpersonation();

  if (session) {
    await logPortalEvent({
      action: "view_as_end",
      target: session.accountSfId,
      metadata: { staffUserId: session.staffUserId },
      override: { clerkUserId: `staff:${session.staffUserId}`, accountSfId: session.accountSfId },
    });
  }

  return NextResponse.redirect(new URL("/portal/sign-in?view_as=ended", req.url));
}
