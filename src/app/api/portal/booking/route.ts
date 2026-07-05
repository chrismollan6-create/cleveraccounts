import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { bookSlotForCurrentUser } from "@/lib/portal/booking";
import { checkAuthAdjacentLimit, rateLimitResponse } from "@/lib/portal/ratelimit";
import { assertSameOrigin } from "@/lib/portal/csrf";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/booking   Body: { startTime: "2026-...Z" }
 * Books the chosen slot with the client's accountant. Blocked under view-as.
 */
export async function POST(req: Request) {
  const csrf = assertSameOrigin(req);
  if (csrf) return csrf;

  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkAuthAdjacentLimit(userId ?? `ip:${ip}`);
  if (!rl.ok) return rateLimitResponse(rl);

  let payload: { startTime?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY", message: "Request body must be JSON" }, { status: 400 });
  }
  if (typeof payload.startTime !== "string" || payload.startTime.trim().length === 0) {
    return NextResponse.json({ error: "MISSING_START", message: "startTime is required" }, { status: 400 });
  }

  try {
    const result = await bookSlotForCurrentUser(payload.startTime);
    if (result.ok === false) {
      // read_only = staff view-as (403); everything else is a scope denial.
      const status = result.reason === "read_only" ? 403 : 400;
      return NextResponse.json({ error: result.reason }, { status });
    }
    return NextResponse.json(result.data);
  } catch (err) {
    console.error("[/api/portal/booking] uncaught:", sanitisedError(err));
    return NextResponse.json({ error: "INTERNAL", message: "Booking failed" }, { status: 500 });
  }
}
