import { NextResponse } from "next/server";
import { verifySyncRequest } from "@/lib/portal/sync-verify";
import { processSyncEvent } from "@/lib/portal/sync-handler";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/sync
 *
 * Webhook receiver for SF → Postgres cache sync events. Called by
 * Apex PortalSyncCallout (via PortalSyncEventTrigger) whenever a
 * portal-relevant SF record changes.
 *
 * Auth: HMAC-SHA256 on (timestamp + "." + body) using a secret shared
 * with the SF Portal_Auth_Setting__mdt 'HMAC v1' record. Timestamp must
 * be within a 5-minute replay window.
 *
 * NO Clerk auth — this is a server-to-server callout from Salesforce.
 * No portalApi rate limit either — SF's own platform-event publish rate
 * is the natural throttle, and dropping a legit sync = stale cache.
 */
export async function POST(req: Request) {
  // Read body as raw text BEFORE parsing — HMAC was computed on raw bytes
  const rawBody = await req.text();

  // 1. Verify HMAC + replay window
  const authFail = verifySyncRequest(
    req.headers,
    rawBody,
    process.env.PORTAL_SYNC_HMAC_SECRET
  );
  if (authFail) {
    console.warn(
      `[sync] auth failed: ${authFail.code} — ${authFail.message}`
    );
    return NextResponse.json(
      { ok: false, error: authFail.code, message: authFail.message },
      { status: authFail.status }
    );
  }

  // 2. Parse the body now that we've verified its integrity
  let payload: { objectType?: unknown; recordId?: unknown; operation?: unknown };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_BODY", message: "Body is not valid JSON" },
      { status: 400 }
    );
  }

  // 3. Shape-check the payload
  if (
    typeof payload.objectType !== "string" ||
    typeof payload.recordId !== "string" ||
    (payload.operation !== "UPSERT" && payload.operation !== "DELETE")
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "BAD_PAYLOAD",
        message: "Expected { objectType: string, recordId: string, operation: 'UPSERT'|'DELETE' }",
      },
      { status: 400 }
    );
  }

  // 4. Process
  try {
    const eventTimestamp = Number.parseInt(
      req.headers.get("x-portal-sync-timestamp") ?? "0",
      10
    );
    const result = await processSyncEvent({
      objectType: payload.objectType,
      recordId: payload.recordId,
      operation: payload.operation,
      eventTimestamp,
    });
    if (result.ok === false) {
      // Return 500 so SF's subscriber retries with backoff. Literal-comparison
      // narrowing (not !result.ok) because tsconfig has strict: false and
      // discriminated-union refinement on the negation doesn't fire.
      return NextResponse.json(
        { ok: false, error: result.code, message: result.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, action: result.action });
  } catch (err) {
    console.error("[sync] uncaught handler error:", sanitisedError(err));
    return NextResponse.json(
      { ok: false, error: "INTERNAL", message: "Sync handler errored — see server logs" },
      { status: 500 }
    );
  }
}
