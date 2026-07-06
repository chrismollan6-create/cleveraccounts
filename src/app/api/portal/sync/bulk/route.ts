import { NextResponse } from "next/server";
import { verifySyncRequest } from "@/lib/portal/sync-verify";
import {
  processBulkNotifications,
  BULK_MAX,
  type BulkNotification,
} from "@/lib/portal/broadcast-sync";
import { sanitisedError } from "@/lib/portal/log";

/**
 * POST /api/portal/sync/bulk
 *
 * Bulk notification write path for cohort broadcasts. Called by the SF
 * PortalBroadcastBatch with up to BULK_MAX notification rows per POST, so a
 * firm-wide blast is a handful of batched callouts instead of one-per-client.
 *
 * Auth: same HMAC-SHA256(timestamp + "." + body) scheme + 5-min replay window
 * as /api/portal/sync (server-to-server; no Clerk auth).
 *
 * Body: { operation?: 'UPSERT'|'DELETE', notifications: BulkNotification[] }
 */
export async function POST(req: Request) {
  const rawBody = await req.text();

  const authFail = verifySyncRequest(
    req.headers,
    rawBody,
    process.env.PORTAL_SYNC_HMAC_SECRET
  );
  if (authFail) {
    console.warn(`[sync/bulk] auth failed: ${authFail.code} — ${authFail.message}`);
    return NextResponse.json(
      { ok: false, error: authFail.code, message: authFail.message },
      { status: authFail.status }
    );
  }

  let payload: { operation?: unknown; notifications?: unknown };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_BODY", message: "Body is not valid JSON" },
      { status: 400 }
    );
  }

  const operation = payload.operation === "DELETE" ? "DELETE" : "UPSERT";
  const items = payload.notifications;
  if (!Array.isArray(items)) {
    return NextResponse.json(
      { ok: false, error: "BAD_PAYLOAD", message: "Expected { notifications: [...] }" },
      { status: 400 }
    );
  }
  if (items.length > BULK_MAX) {
    return NextResponse.json(
      { ok: false, error: "TOO_MANY", message: `Max ${BULK_MAX} notifications per request` },
      { status: 413 }
    );
  }

  // Shape-check: every row needs at least sf_id; upserts also need the scope
  // key + the required content fields.
  for (const it of items as BulkNotification[]) {
    if (!it || typeof it.sfId !== "string") {
      return NextResponse.json(
        { ok: false, error: "BAD_ROW", message: "Each notification needs a string sfId" },
        { status: 400 }
      );
    }
    if (
      operation === "UPSERT" &&
      (typeof it.accountSfId !== "string" ||
        typeof it.type !== "string" ||
        typeof it.title !== "string")
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "BAD_ROW",
          message: "Upsert rows need accountSfId, type and title",
        },
        { status: 400 }
      );
    }
  }

  try {
    const count = await processBulkNotifications(items as BulkNotification[], operation);
    return NextResponse.json({ ok: true, operation, count });
  } catch (err) {
    console.error("[sync/bulk] handler error:", sanitisedError(err));
    return NextResponse.json(
      { ok: false, error: "INTERNAL", message: "Bulk sync errored — see server logs" },
      { status: 500 }
    );
  }
}
