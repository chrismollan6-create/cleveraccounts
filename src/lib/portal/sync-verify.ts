import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies the HMAC signature on an inbound SF → portal sync webhook
 * request. The Apex sender (PortalSyncCallout) signs:
 *
 *   HMAC-SHA256(<unix-seconds>.<raw-body>, secret) → hex
 *
 * …and sends two headers:
 *
 *   X-Portal-Sync-Timestamp: <unix-seconds>
 *   X-Portal-Sync-Signature: <hex>
 *
 * Verification re-runs the HMAC with our shared secret and timing-safe-
 * compares the result. Also checks the timestamp is within a 5-minute
 * window — captured signatures would otherwise replay-attack the cache
 * forever.
 *
 * Returns null on success, or a `{ status, code, message }` failure
 * object the route handler should turn into an HTTP response.
 */

const REPLAY_WINDOW_SECONDS = 5 * 60;

export interface SyncAuthFailure {
  status: number;
  code: string;
  message: string;
}

export function verifySyncRequest(
  headers: Headers,
  rawBody: string,
  secret: string | undefined
): SyncAuthFailure | null {
  if (!secret) {
    return {
      status: 500,
      code: "CONFIG",
      message:
        "PORTAL_SYNC_HMAC_SECRET not configured on this deploy. Set it in Netlify env.",
    };
  }
  if (secret === "REPLACE_ME_VIA_SETUP_UI_BEFORE_PRODUCTION_USE") {
    return {
      status: 500,
      code: "CONFIG",
      message: "PORTAL_SYNC_HMAC_SECRET still the placeholder. Generate + set a real value.",
    };
  }

  const ts = headers.get("x-portal-sync-timestamp");
  const sig = headers.get("x-portal-sync-signature");
  if (!ts || !sig) {
    return {
      status: 401,
      code: "MISSING_SIGNATURE",
      message: "X-Portal-Sync-Timestamp / X-Portal-Sync-Signature required",
    };
  }

  const tsNum = Number.parseInt(ts, 10);
  if (!Number.isFinite(tsNum)) {
    return { status: 401, code: "BAD_TIMESTAMP", message: "Timestamp not parseable" };
  }
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - tsNum) > REPLAY_WINDOW_SECONDS) {
    return {
      status: 401,
      code: "STALE_TIMESTAMP",
      message: `Timestamp outside ${REPLAY_WINDOW_SECONDS}s replay window`,
    };
  }

  const expected = createHmac("sha256", secret)
    .update(`${ts}.${rawBody}`)
    .digest("hex");
  // Both inputs MUST be the same byte length for timingSafeEqual; if the
  // attacker sends a wrong-length signature, treat that as a mismatch.
  const sigBuf = Buffer.from(sig, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return {
      status: 401,
      code: "INVALID_SIGNATURE",
      message: "Signature mismatch",
    };
  }

  return null;
}
