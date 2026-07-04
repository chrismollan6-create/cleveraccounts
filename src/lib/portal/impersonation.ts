import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { ViewAsClaims } from "./viewAsToken";
import { IMPERSONATION_COOKIE } from "./impersonation-cookie";

export { IMPERSONATION_COOKIE };

/**
 * Staff impersonation session — the portal-issued credential a staff member
 * carries while "viewing as" a client. Established by the /portal/view-as route
 * after it verifies the Salesforce-minted launch token ([[viewAsToken]]), and
 * read by withPortalScope to scope the request READ-ONLY to the impersonated
 * account (bypassing the Clerk-user resolution).
 *
 * Stored as an httpOnly, signed (HMAC-SHA256) cookie so it can't be forged.
 * The cookie signature is verified here (Node runtime); the middleware only
 * checks presence to let the request through to where this real verification
 * happens — a forged cookie reaches the page but withPortalScope rejects it,
 * so nothing leaks.
 */

const SESSION_TTL_SECONDS = 30 * 60; // 30 minutes
const PURPOSE = "view_as_session";

export interface ImpersonationSession {
  accountSfId: string;
  contactSfId: string | null;
  brand: "clever" | "workwell";
  staffUserId: string;
  staffName: string | null;
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

function mintSessionToken(claims: ViewAsClaims, nowSec: number): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = {
    purpose: PURPOSE,
    aid: claims.accountId,
    cid: claims.contactId ?? undefined,
    b: claims.brand,
    sub: claims.staffUserId,
    sn: claims.staffName ?? undefined,
    iat: nowSec,
    exp: nowSec + SESSION_TTL_SECONDS,
  };
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const sig = createHmac("sha256", secret).update(payloadB64).digest();
  return `${payloadB64}.${base64UrlEncode(sig)}`;
}

/** Verify a session cookie value. Returns null on any tamper/expiry/misconfig. */
export function verifySessionToken(
  token: string | null | undefined,
  nowSec: number = Math.floor(Date.now() / 1000)
): ImpersonationSession | null {
  const secret = getSecret();
  if (!secret || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  const expected = createHmac("sha256", secret).update(payloadB64).digest();
  let provided: Buffer;
  try {
    provided = base64UrlDecode(sigB64);
  } catch {
    return null;
  }
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));
  } catch {
    return null;
  }
  if (payload.purpose !== PURPOSE) return null;
  const exp = typeof payload.exp === "number" ? payload.exp : 0;
  if (exp < nowSec) return null;
  const accountSfId = typeof payload.aid === "string" ? payload.aid : "";
  if (!accountSfId) return null;

  return {
    accountSfId,
    contactSfId: typeof payload.cid === "string" ? payload.cid : null,
    brand: payload.b === "workwell" ? "workwell" : "clever",
    staffUserId: typeof payload.sub === "string" ? payload.sub : "",
    staffName: typeof payload.sn === "string" ? payload.sn : null,
    exp,
  };
}

/** Begin a view-as session — sets the signed cookie from verified launch claims. */
export async function startImpersonation(claims: ViewAsClaims): Promise<boolean> {
  const token = mintSessionToken(claims, Math.floor(Date.now() / 1000));
  if (!token) return false;
  const jar = await cookies();
  jar.set(IMPERSONATION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/portal",
    maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

/** The current impersonation session, or null when not impersonating. */
export async function getImpersonationSession(): Promise<ImpersonationSession | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(IMPERSONATION_COOKIE)?.value);
}

/** End a view-as session — clears the cookie. */
export async function endImpersonation(): Promise<void> {
  const jar = await cookies();
  jar.delete(IMPERSONATION_COOKIE);
}
