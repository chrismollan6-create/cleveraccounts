import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { approveForCurrentUser } from "@/lib/portal/approvals";
import {
  checkAuthAdjacentLimit,
  rateLimitResponse,
} from "@/lib/portal/ratelimit";
import { assertSameOrigin } from "@/lib/portal/csrf";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/approvals/approve
 * Body: { id: string }
 *
 * Approves a pending item for the signed-in user. IDOR-safe: the approval is
 * matched on (sfId AND the session's accountSfId) inside approveForCurrentUser
 * — the client-supplied id can never reach another account's record.
 */
export async function POST(req: Request) {
  const csrf = assertSameOrigin(req);
  if (csrf) return csrf;

  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkAuthAdjacentLimit(userId ?? `ip:${ip}`);
  if (!rl.ok) return rateLimitResponse(rl);

  let payload: { id?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "Request body must be JSON" },
      { status: 400 }
    );
  }

  if (typeof payload.id !== "string" || payload.id.trim().length === 0) {
    return NextResponse.json(
      { error: "MISSING_ID", message: "Approval id is required" },
      { status: 400 }
    );
  }

  let result: Awaited<ReturnType<typeof approveForCurrentUser>>;
  try {
    result = await approveForCurrentUser(payload.id.trim());
  } catch (err) {
    console.error("[/api/portal/approvals/approve] uncaught:", sanitisedError(err));
    return NextResponse.json(
      { error: "INTERNAL", message: "Approval failed — see server logs" },
      { status: 500 }
    );
  }

  if (result.ok === false) {
    return NextResponse.json(
      { error: result.reason, message: "Could not approve" },
      { status: result.reason === "not_signed_in" ? 401 : 403 }
    );
  }

  if (result.data === null) {
    // Not found, not theirs, or already actioned.
    return NextResponse.json(
      { error: "NOT_PENDING", message: "That item can't be approved" },
      { status: 409 }
    );
  }

  return NextResponse.json(result.data);
}
