import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { getEngagementLetterForCurrentUser } from "@/lib/portal/engagement-letter";
import { checkPortalApiLimit, rateLimitResponse } from "@/lib/portal/ratelimit";

/**
 * GET /api/portal/engagement-letter
 *
 * Returns the active engagement letter for the signed-in user's Account.
 * 200 with null body when none on file (Apex returns 404; helper translates).
 *
 * In-portal signing is the next deploy — for now the portal UI shows the
 * EL status + a deep link to the existing public token URL when action
 * is needed.
 */
export async function GET() {
  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkPortalApiLimit(userId ?? `ip:${ip}`);
  if (!rl.ok) return rateLimitResponse(rl);

  const result = await getEngagementLetterForCurrentUser();

  if (result.ok === false) {
    return NextResponse.json(
      { error: result.reason, message: scopeReasonMessage(result.reason) },
      { status: scopeReasonStatus(result.reason) }
    );
  }
  return NextResponse.json(result.data);
}

function scopeReasonStatus(reason: string): number {
  switch (reason) {
    case "not_signed_in":
      return 401;
    case "disabled":
      return 403;
    case "pending":
    case "no_link_row":
      return 202;
    default:
      return 500;
  }
}

function scopeReasonMessage(reason: string): string {
  switch (reason) {
    case "not_signed_in":
      return "Not signed in";
    case "disabled":
      return "Your portal access isn't active";
    case "pending":
    case "no_link_row":
      return "Setting up your portal — refresh in a moment";
    default:
      return "Unexpected error";
  }
}
