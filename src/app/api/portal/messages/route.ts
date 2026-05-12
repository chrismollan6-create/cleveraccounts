import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import {
  listMessagesForCurrentUser,
  sendMessageForCurrentUser,
} from "@/lib/portal/messages";
import {
  checkAuthAdjacentLimit,
  checkPortalApiLimit,
  rateLimitResponse,
} from "@/lib/portal/ratelimit";
import { assertSameOrigin } from "@/lib/portal/csrf";
import { sanitisedError } from "@/lib/portal/log";

/**
 * GET /api/portal/messages?pageSize=50
 *
 * Lists portal-visible messages for the signed-in user. Polled by the
 * dashboard every 10s when the tab is visible (SWR refreshInterval).
 */
export async function GET(req: Request) {
  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkPortalApiLimit(userId ?? `ip:${ip}`);
  if (!rl.ok) return rateLimitResponse(rl);

  const url = new URL(req.url);
  const pageSizeParam = url.searchParams.get("pageSize");
  // Clamp at the route boundary so a malicious `?pageSize=999999999` never
  // reaches the SF layer. listMessagesForCurrentUser clamps again — this is
  // belt-and-braces. NaN from a non-numeric input collapses to 50.
  const parsed = pageSizeParam ? parseInt(pageSizeParam, 10) : 50;
  const pageSize = Number.isFinite(parsed)
    ? Math.min(Math.max(1, parsed), 200)
    : 50;

  // Wrap so unexpected exceptions (Drizzle/Postgres/Clerk errors) get
  // logged with their real message instead of being silently turned into
  // an opaque 500 by the Next.js framework. SWR polls every 10s — a
  // recurring error here was burning network panel red until we knew
  // what to fix.
  let result: Awaited<ReturnType<typeof listMessagesForCurrentUser>>;
  try {
    result = await listMessagesForCurrentUser(pageSize);
  } catch (err) {
    console.error("[/api/portal/messages] uncaught:", sanitisedError(err));
    return NextResponse.json(
      { error: "INTERNAL", message: "Messages fetch failed — see server logs" },
      { status: 500 }
    );
  }

  if (result.ok === false) {
    return NextResponse.json(
      { error: result.reason, message: reasonToMessage(result.reason) },
      { status: reasonToStatus(result.reason) }
    );
  }
  return NextResponse.json(result.data);
}

/**
 * POST /api/portal/messages
 * Body: { body: string, subject?: string }
 *
 * Sends a new portal message. Stricter rate limit than read (5/min) to
 * deter spam.
 */
export async function POST(req: Request) {
  // CSRF defence: reject cross-site POSTs before we do any work. Clerk's
  // cookie is SameSite=Lax — this closes the gap.
  const csrf = assertSameOrigin(req);
  if (csrf) return csrf;

  const { userId } = await auth();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkAuthAdjacentLimit(userId ?? `ip:${ip}`);
  if (!rl.ok) return rateLimitResponse(rl);

  let payload: { body?: unknown; subject?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "Request body must be JSON" },
      { status: 400 }
    );
  }

  if (typeof payload.body !== "string" || payload.body.trim().length === 0) {
    return NextResponse.json(
      { error: "MISSING_BODY", message: "Message body is required" },
      { status: 400 }
    );
  }
  if (payload.body.length > 10_000) {
    return NextResponse.json(
      { error: "BODY_TOO_LONG", message: "Message exceeds 10,000 characters" },
      { status: 400 }
    );
  }

  const subject =
    typeof payload.subject === "string" && payload.subject.trim().length > 0
      ? payload.subject.trim().slice(0, 255)
      : undefined;

  const result = await sendMessageForCurrentUser(payload.body, subject);

  if (result.ok === false) {
    return NextResponse.json(
      { error: result.reason, message: reasonToMessage(result.reason) },
      { status: reasonToStatus(result.reason) }
    );
  }

  return NextResponse.json(result.data);
}

function reasonToStatus(reason: string): number {
  switch (reason) {
    case "not_signed_in":
      return 401;
    case "disabled":
      return 403;
    case "pending":
    case "no_link_row":
      return 202;
    case "missing_account":
      return 500;
    default:
      return 500;
  }
}

function reasonToMessage(reason: string): string {
  switch (reason) {
    case "not_signed_in":
      return "Not signed in";
    case "disabled":
      return "Your portal access isn't active. Contact your accountant.";
    case "pending":
    case "no_link_row":
      return "Your portal is still being set up. Refresh in a moment.";
    case "missing_account":
      return "Account link missing — please contact support";
    default:
      return "Unexpected error";
  }
}
