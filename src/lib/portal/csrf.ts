/**
 * CSRF defence for portal POST/PATCH/PUT/DELETE routes.
 *
 * Clerk's session cookie is `SameSite=Lax` by default — that blocks
 * cross-site form posts and most fetch CSRF, but Lax still permits the
 * cookie on top-level GET navigation, and SameSite enforcement has
 * known browser quirks. Belt-and-braces: every state-changing route
 * asserts the request's Origin header matches the host the request was
 * sent to before touching SF or the database.
 *
 * We *don't* rely on Origin for GET — reads are scoped by withPortalScope
 * and the Clerk session anyway, so adding Origin there would block legit
 * uses like a user pasting a deep link into a browser.
 *
 * Strategy: true same-origin check (NOT an allowlist).
 *
 *   1. Derive the "expected" origin from the request itself: scheme from
 *      x-forwarded-proto (Netlify always sets this), host from the Host
 *      header. This is the origin the browser actually called.
 *   2. Compare to the presented Origin header (or Referer fallback).
 *   3. If they match → allow. Otherwise 403.
 *
 * Why this is better than an allowlist:
 *   - No risk of admitting attacker-controlled subdomains (the previous
 *     `.endsWith('.netlify.app')` would have let `attacker.netlify.app`
 *     forge CSRF against branch deploys).
 *   - Works for any host the portal is reachable at (production, branch
 *     deploys, localhost, custom domains) with zero config — same-origin
 *     is same-origin no matter the URL.
 *   - The browser-set Origin header cannot be forged by attacker JS
 *     (the spec forbids it), so a presented Origin that matches the
 *     Host header proves the request really came from a page on our
 *     own origin.
 */

/**
 * Returns null if the request's Origin (or Referer fallback) is the same
 * as the host the request was sent to. Otherwise returns a 403 `Response`
 * that the caller should return immediately.
 */
export function assertSameOrigin(req: Request): Response | null {
  const expected = expectedOrigin(req);
  if (!expected) {
    // Couldn't determine our own host — this shouldn't happen on Netlify
    // or in `npm run dev`, but if it does, refuse rather than guess.
    return forbid("host_missing");
  }

  const origin = req.headers.get("origin");
  if (origin) {
    return origin === expected ? null : forbid("origin_mismatch");
  }

  // Origin header absent (rare on modern browsers for fetch/XHR; can
  // happen on legacy clients or some same-origin top-level navigations).
  // Fall back to Referer parsing.
  const referer = req.headers.get("referer");
  if (referer) {
    let refOrigin: string;
    try {
      refOrigin = new URL(referer).origin;
    } catch {
      return forbid("referer_malformed");
    }
    return refOrigin === expected ? null : forbid("referer_mismatch");
  }

  // Neither Origin nor Referer present — refuse. A genuine same-origin
  // browser POST always sends at least one of these.
  return forbid("origin_missing");
}

/**
 * Reconstruct the origin the request was actually sent to, by reading
 * the Host header and the forwarded-proto. Returns null if either is
 * missing or malformed (in which case the caller refuses the request).
 */
function expectedOrigin(req: Request): string | null {
  const host = req.headers.get("host");
  if (!host) return null;

  // Sanity-check host — must look like host[:port], not garbage.
  // Prevents Host-header injection like `evil.com\r\nX-: …` if a proxy
  // somehow passed it through. Belt-and-braces, since Netlify normalises.
  if (!/^[A-Za-z0-9.\-:]+$/.test(host)) return null;

  // Protocol: trust x-forwarded-proto first (set by Netlify/Cloudflare),
  // fall back to inferring from the Request URL itself.
  const xfp = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  let proto: string | null = null;
  if (xfp === "http" || xfp === "https") {
    proto = xfp;
  } else {
    try {
      proto = new URL(req.url).protocol.replace(":", "");
    } catch {
      proto = null;
    }
  }
  if (proto !== "http" && proto !== "https") return null;

  return `${proto}://${host}`;
}

function forbid(reason: string): Response {
  return new Response(
    JSON.stringify({
      error: "FORBIDDEN_ORIGIN",
      message: "Request origin is not permitted",
      reason,
    }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }
  );
}
