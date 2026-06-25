import { NextResponse } from "next/server";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import {
  getOnboardingForCurrentUser,
  isOnboardingError,
} from "@/lib/portal/onboarding";
import { getPortalSalesforceToken } from "@/lib/salesforce";

export const dynamic = "force-dynamic";

/**
 * Accountant photo proxy.
 *
 * Salesforce profile photos live behind an authenticated `*.force.com`
 * (FullPhotoUrl) endpoint — rendering the raw URL in an <img> 403s. This
 * route fetches it server-side with the portal integration token and streams
 * the bytes back so the browser can display it.
 *
 * Security:
 *  · The URL is NEVER taken from the request — it's resolved from the
 *    logged-in user's own onboarding status, so a user can only ever load
 *    their own accountant's photo (no IDOR, no SSRF via a `?url=` param).
 *  · Even so, the resolved URL is host-allowlisted to Salesforce domains as
 *    defence in depth.
 *  · Cache-Control is `private` — it's per-user content.
 */

const ALLOWED_HOST = /(?:^|\.)(?:force\.com|salesforce\.com)$/i;

export async function GET() {
  const user = await getCurrentPortalUser();
  if (!user || user.status !== "active") {
    return new NextResponse(null, { status: 401 });
  }

  const result = await getOnboardingForCurrentUser();
  if (isOnboardingError(result) || !result.data) {
    return new NextResponse(null, { status: 404 });
  }

  const photoUrl = result.data.accountant?.photoUrl;
  if (!photoUrl) return new NextResponse(null, { status: 404 });

  let parsed: URL;
  try {
    parsed = new URL(photoUrl);
  } catch {
    return new NextResponse(null, { status: 404 });
  }
  if (parsed.protocol !== "https:" || !ALLOWED_HOST.test(parsed.hostname)) {
    return new NextResponse(null, { status: 404 });
  }

  let token: string;
  try {
    token = await getPortalSalesforceToken();
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!upstream.ok) return new NextResponse(null, { status: 404 });

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
