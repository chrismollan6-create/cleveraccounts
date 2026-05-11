/**
 * CSRF defence for portal POST/PATCH/PUT/DELETE routes.
 *
 * Clerk's session cookie is `SameSite=Lax` by default — that blocks
 * cross-site form posts and most fetch CSRF, but Lax still permits the
 * cookie on top-level GET navigation, and SameSite enforcement has
 * known browser quirks. Belt-and-braces: every state-changing route
 * asserts the Origin (or Referer fallback) matches our own host before
 * touching SF or the database.
 *
 * We *don't* rely on Origin for GET — reads are scoped by withPortalScope
 * and the Clerk session anyway, so adding Origin there would block legit
 * uses like a user pasting a deep link into a browser.
 *
 * The allowlist mirrors the production portal subdomains plus localhost
 * (dev) and Netlify deploy URLs (branch deploys & previews). Anything
 * else → 403.
 */

const STATIC_ALLOWED_ORIGINS = [
  "https://my.cleveraccounts.com",
  "https://my.workwellaccountancy.com",
];

function isAllowedOrigin(origin: string): boolean {
  if (STATIC_ALLOWED_ORIGINS.includes(origin)) return true;
  // Permit Netlify deploy URLs and localhost during dev/preview.
  let host: string;
  try {
    host = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  if (host === "localhost" || host.startsWith("localhost:")) return true;
  if (host.startsWith("127.0.0.1")) return true;
  if (host.endsWith(".netlify.app")) return true;
  if (host.endsWith(".netlify.live")) return true;
  return false;
}

/**
 * Returns null if the request's Origin (or Referer fallback) is one we
 * trust; otherwise a `Response` with HTTP 403 that the caller should
 * return immediately.
 *
 * Header precedence:
 *   1. `Origin` header — sent by browsers on every CORS/preflight + on
 *      non-GET fetches from JS. Trustworthy because browsers won't let
 *      attacker JS forge it.
 *   2. `Referer` header fallback — used when Origin is absent (some old
 *      browsers, server-to-server). Less robust because servers can fake
 *      it, but acceptable as a backstop when Origin is missing.
 *   3. Neither present → reject as 403. Genuine browser POSTs from our
 *      portal always send at least one.
 */
export function assertSameOrigin(req: Request): Response | null {
  const origin = req.headers.get("origin");
  if (origin) {
    if (isAllowedOrigin(origin)) return null;
    return forbid("origin_mismatch");
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (isAllowedOrigin(refOrigin)) return null;
    } catch {
      // fall through to 403
    }
    return forbid("referer_mismatch");
  }

  return forbid("origin_missing");
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
