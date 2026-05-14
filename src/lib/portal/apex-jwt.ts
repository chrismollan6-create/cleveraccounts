import { createHmac } from "node:crypto";

/**
 * HMAC-SHA256 JWT signing for the `X-Portal-Auth` header on every portal
 * Apex request. The Salesforce side (`PortalRequestAuth.cls`) verifies
 * with the same secret, then uses the JWT-derived `accountId` for all
 * SOQL — request body / query params are ignored.
 *
 * This is Stage 2 of the portal security hardening (2026-05-11), closing
 * audit finding #4: Apex previously trusted whatever `accountId` Next.js
 * put in the URL, meaning one bug in `withPortalScope()` = full IDOR.
 * Now the trust boundary is the HMAC secret, not Next.js code paths.
 *
 * Token shape (60-second validity):
 *   header  { alg: "HS256", typ: "JWT", kid: "<key-id>" }
 *   payload { sub, aid, cid, b, iat, exp }
 *     sub — Clerk user id
 *     aid — Salesforce Account 18-char id
 *     cid — Salesforce Contact 18-char id (omitted if not yet resolved)
 *     b   — brand ("clever" | "workwell")
 *     iat — issued-at unix seconds
 *     exp — expiry unix seconds (iat + 60)
 *
 * Secret rotation: see Portal_Auth_Setting__mdt in SF. The `kid` header
 * names the active key; rotating means create a new metadata record with
 * a new secret, switch this env var to match, then deactivate the old
 * record after 60 seconds (in-flight tokens drain).
 */

const TOKEN_TTL_SECONDS = 60;
const DEFAULT_KID = "HMAC_v1";

export interface PortalAuthScope {
  /** Clerk user id — JWT `sub` claim. */
  clerkUserId: string;
  /** Salesforce Account 18-char id — JWT `aid` claim. */
  accountId: string;
  /** Salesforce Contact 18-char id — JWT `cid` claim. Optional. */
  contactId?: string | null;
  /** Brand identifier — JWT `b` claim. */
  brand: "clever" | "workwell";
}

/**
 * Sign a portal Apex JWT for the given scope. Throws if the HMAC secret
 * isn't configured — we don't want to silently fall back to unsigned
 * requests in production.
 */
export function signPortalApexJwt(scope: PortalAuthScope): string {
  const secret = process.env.PORTAL_APEX_JWT_SECRET;
  if (!secret) {
    throw new Error(
      "PORTAL_APEX_JWT_SECRET not configured. Stage 2 portal security " +
        "requires this — see docs/portal-stage-2-apex-jwt-verification.md."
    );
  }
  if (secret === "REPLACE_ME_VIA_SETUP_UI_BEFORE_PRODUCTION_USE") {
    throw new Error(
      "PORTAL_APEX_JWT_SECRET is still the placeholder. Generate a real " +
        "secret (`openssl rand -base64 48`) and set both Netlify env vars " +
        "and the Portal_Auth_Setting__mdt 'HMAC v1' record."
    );
  }

  const kid = process.env.PORTAL_APEX_JWT_KID ?? DEFAULT_KID;
  const nowSec = Math.floor(Date.now() / 1000);

  const header = { alg: "HS256", typ: "JWT", kid };
  const payload: Record<string, unknown> = {
    sub: scope.clerkUserId,
    aid: scope.accountId,
    b: scope.brand,
    iat: nowSec,
    exp: nowSec + TOKEN_TTL_SECONDS,
  };
  if (scope.contactId) {
    payload.cid = scope.contactId;
  }

  const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const sig = createHmac("sha256", secret).update(signingInput).digest();
  const sigB64 = base64UrlEncode(sig);

  return `${signingInput}.${sigB64}`;
}

/**
 * Base64url encoding per RFC 4648 §5 — what JWTs use. Node's `Buffer`
 * has a `base64url` encoding directly but we do it explicitly so the
 * algorithm is identical to the Apex side (which has to do it by hand).
 */
function base64UrlEncode(raw: Buffer): string {
  return raw
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
