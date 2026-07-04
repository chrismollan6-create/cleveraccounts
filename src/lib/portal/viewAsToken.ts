import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * "View as" launch token — the staff-impersonation entry credential.
 *
 * Reverses the direction of the normal portal JWT ([[apex-jwt]] signs on the
 * portal side, Salesforce verifies): here SALESFORCE mints and the PORTAL
 * verifies. Staff click "View portal as this client" on the Account record;
 * Apex mints this short-lived HMAC token (same shared secret as the X-Portal-
 * Auth JWT — PORTAL_APEX_JWT_SECRET on the portal / Portal_Auth_Setting__mdt on
 * SF), and the portal's /portal/view-as route verifies it, then establishes a
 * read-only impersonation session ([[impersonation]]).
 *
 * The token only has to survive the click, so its TTL is short. Once verified,
 * the portal issues its own (longer, still bounded) impersonation cookie.
 *
 * Token shape:
 *   header  { alg: "HS256", typ: "JWT", kid }
 *   payload { purpose: "view_as", aid, cid?, b, sub (staff SF User id),
 *             sn (staff name), iat, exp }
 */

const PURPOSE = "view_as";
/** Generous clock-skew allowance between SF and the portal (seconds). */
const CLOCK_SKEW_SECONDS = 30;

export interface ViewAsClaims {
  /** Salesforce Account id being viewed. */
  accountId: string;
  /** Salesforce Contact id to scope as (optional). */
  contactId: string | null;
  brand: "clever" | "workwell";
  /** Salesforce User id of the staff member doing the viewing. */
  staffUserId: string;
  /** Staff display name (for the banner + audit). */
  staffName: string | null;
  /** Expiry, unix seconds. */
  exp: number;
}

function base64UrlEncode(raw: Buffer): string {
  return raw.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function getSecret(): string | null {
  const secret = process.env.PORTAL_APEX_JWT_SECRET;
  if (!secret || secret === "REPLACE_ME_VIA_SETUP_UI_BEFORE_PRODUCTION_USE") return null;
  return secret;
}

/**
 * Verify a view-as launch token. Returns the claims only if the signature,
 * expiry and purpose all check out — otherwise null (never throws on bad
 * input; a malformed/forged token is simply rejected).
 *
 * `nowSec` is injectable for tests; defaults to the current time.
 */
export function verifyViewAsToken(
  token: string | null | undefined,
  nowSec: number = Math.floor(Date.now() / 1000)
): ViewAsClaims | null {
  const secret = getSecret();
  if (!secret || !token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;

  // Recompute the signature and compare in constant time.
  const expected = createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest();
  let provided: Buffer;
  try {
    provided = base64UrlDecode(sigB64);
  } catch {
    return null;
  }
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return null;
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));
  } catch {
    return null;
  }

  if (payload.purpose !== PURPOSE) return null;
  const exp = typeof payload.exp === "number" ? payload.exp : 0;
  if (exp + CLOCK_SKEW_SECONDS < nowSec) return null; // expired
  const aid = typeof payload.aid === "string" ? payload.aid : "";
  const brand = payload.b === "workwell" ? "workwell" : "clever";
  if (!aid) return null;

  return {
    accountId: aid,
    contactId: typeof payload.cid === "string" ? payload.cid : null,
    brand,
    staffUserId: typeof payload.sub === "string" ? payload.sub : "",
    staffName: typeof payload.sn === "string" ? payload.sn : null,
    exp,
  };
}

/**
 * Mint a view-as token. The PORTAL never calls this in production (Salesforce
 * mints), but it's exported so the verifier can be unit-tested against a
 * known-good token and so the exact wire format is documented in one place.
 */
export function mintViewAsToken(
  claims: Omit<ViewAsClaims, "exp">,
  ttlSeconds = 120,
  nowSec: number = Math.floor(Date.now() / 1000)
): string {
  const secret = getSecret();
  if (!secret) throw new Error("PORTAL_APEX_JWT_SECRET not configured");
  const kid = process.env.PORTAL_APEX_JWT_KID ?? "HMAC_v1";
  const header = { alg: "HS256", typ: "JWT", kid };
  const payload = {
    purpose: PURPOSE,
    aid: claims.accountId,
    cid: claims.contactId ?? undefined,
    b: claims.brand,
    sub: claims.staffUserId,
    sn: claims.staffName ?? undefined,
    iat: nowSec,
    exp: nowSec + ttlSeconds,
  };
  const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const sig = createHmac("sha256", secret).update(`${headerB64}.${payloadB64}`).digest();
  return `${headerB64}.${payloadB64}.${base64UrlEncode(sig)}`;
}
