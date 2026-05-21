import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { brandIdFromHost } from '@/lib/brand-host';
import { isPortalHost, portalBrandFromHost } from '@/lib/portal/host';
import { BRANDS, type BrandId } from '@/lib/constants';

/**
 * Multi-tenant brand detection + portal routing + Clerk auth gate.
 *
 * The Next.js app is reachable at multiple hosts:
 *   - cleveraccounts.com                  → Clever marketing
 *   - app.workwellaccountancy.com         → Workwell marketing
 *   - portal.cleveraccounts.com           → Clever client portal
 *   - portal.workwellaccountancy.com      → Workwell client portal
 *   - localhost / *.netlify.app           → Clever (default for dev/preview)
 *
 * Brand resolution: the `Host` header is the source of truth (stamped onto
 * `x-brand` so server components and route handlers can read it via
 * `getBrand()`). In dev / Netlify previews only, a `?_brand=` query param
 * + `_brand_override` cookie can flip the brand for QA.
 *
 * Portal routing: portal hostnames serve content from `src/app/portal/*` but
 * users see clean URLs (e.g. portal.cleveraccounts.com/dashboard, not
 * /portal/dashboard). We achieve this with an internal rewrite. Direct access
 * to /portal/* on the marketing hostnames is allowed in dev (so devs can hit
 * localhost:3000/portal/dashboard) but redirected to the portal subdomain in
 * production for isolation.
 *
 * Auth: protected portal routes require a Clerk session. Public portal routes
 * (sign-in, sign-up, root marketing landing) skip the gate. Marketing routes
 * are unaffected — Clerk only matters when the request is portal-bound.
 */

const BRAND_OVERRIDE_COOKIE = '_brand_override';
const BRAND_OVERRIDE_PARAM = '_brand';

/** Portal paths that don't require authentication (matched after /portal prefix is added). */
const PUBLIC_PORTAL_PATTERNS: RegExp[] = [
  /^\/portal\/sign-in(\/.*)?$/,
  /^\/portal\/activate(\/.*)?$/, // invite redemption — invitee isn't signed in yet
  /^\/portal\/?$/, // bare /portal — landing page can be public
];

/**
 * Public funnel/marketing paths that, even on a portal hostname, serve the
 * public route directly — NO `/portal` rewrite, NO auth gate, marketing CSP.
 *
 * This lets a single domain (e.g. my.workwellaccountancy.com) host BOTH the
 * authenticated client portal AND public forms like the engagement-letter
 * e-sign page — instead of needing a second `app.*` subdomain.
 *
 * Only add paths here that genuinely have a public funnel/marketing route
 * AND do NOT collide with a portal route. `/sign-up` is deliberately NOT
 * here — on a portal host it must stay the portal's invite-redemption page.
 */
const PORTAL_PUBLIC_PASSTHROUGH: RegExp[] = [
  /^\/engagement-letter(\/.*)?$/,
  // The engagement-letter page's own API routes (view / sign / pdf). These
  // MUST pass through too — the signer has no Clerk session, so without this
  // the sign/view POSTs get auth-gated and 307-redirected to /sign-in, and
  // the client's res.json() then fails on the sign-in HTML ("Network error").
  // Scoped to /api/engagement-letter so it can't match /api/portal/* routes.
  /^\/api\/engagement-letter(\/.*)?$/,
  // New-client registration funnel. The portal's own invite-redemption page
  // lives at /activate (not /sign-up) precisely so this passthrough doesn't
  // collide with it.
  /^\/sign-up(\/.*)?$/,
  // The sign-up funnel's API routes. Same reasoning as the engagement-letter
  // APIs above: the prospect has no Clerk session, so without these the
  // funnel's fetches get auth-gated and 307-redirected to /sign-in and the
  // client's res.json() fails on HTML. All portal API routes live under
  // /api/portal/* so none of these patterns can match a gated portal route.
  /^\/api\/signup(\/.*)?$/,
  /^\/api\/leads(\/.*)?$/,
  /^\/api\/address(\/.*)?$/,
  /^\/api\/analytics(\/.*)?$/,
];

function isPortalPublicPassthrough(pathname: string): boolean {
  return PORTAL_PUBLIC_PASSTHROUGH.some((p) => p.test(pathname));
}

/** Brand override (?_brand=) is allowed everywhere except strict prod. */
function isOverrideAllowed(host: string): boolean {
  return !isStrictProduction(host);
}

/**
 * True only on a real custom-domain production deploy. False for dev,
 * localhost, and host-provider deploy URLs (Netlify .netlify.app / .live,
 * Vercel .vercel.app — all of which are preview/branch URLs, never
 * the canonical production host).
 *
 * Hostname-based rather than env-var based because `process.env.CONTEXT`
 * isn't reliably exposed to Next.js Edge middleware on Netlify, so the
 * old check incorrectly returned true on branch deploys.
 */
function isStrictProduction(host: string): boolean {
  if (process.env.NODE_ENV !== 'production') return false;
  const h = host.toLowerCase().split(':')[0];
  if (h.endsWith('.netlify.app') || h.endsWith('.netlify.live')) return false;
  if (h.endsWith('.vercel.app')) return false;
  if (h === 'localhost' || h.startsWith('127.0.0.1')) return false;
  return true;
}

function isValidBrand(v: string | null | undefined): v is BrandId {
  return v === 'clever' || v === 'workwell';
}

function isPublicPortalPath(portalPath: string): boolean {
  return PUBLIC_PORTAL_PATTERNS.some((p) => p.test(portalPath));
}

// ─── Security headers ───────────────────────────────────────────────────────
// CSP scoped to portal routes — strict-mode allowlist for Clerk + Calendly +
// Supabase + Cloudflare Turnstile (when added). Marketing routes use a
// looser CSP because Webflow / GTM / Stripe / Sanity all need third-party
// origins our portal doesn't.

// 'unsafe-eval' deliberately removed (security audit, May 2026) — never
// required by Clerk or Next.js in production builds. Confirmed safe.
//
// 'unsafe-inline' is still here as a known compromise: removing it requires
// nonce-based CSP plumbed through middleware → x-nonce header → Next.js
// framework scripts → Clerk's <ClerkProvider>. Scheduled with Foundation 6
// (prod Clerk + MFA + custom auth domain) since both need careful Clerk
// testing. Tracked in C:\Users\chris\.claude\plans\portal-foundations-secure-by-default.md.
const PORTAL_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.salesforce.com https://*.cleveraccounts.com https://*.workwellaccountancy.com https://*.clerk.com https://img.clerk.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.clerk.accounts.dev https://clerk.com https://clerk-telemetry.com https://*.supabase.co wss://*.supabase.co https://api.calendly.com",
  "frame-src https://challenges.cloudflare.com https://*.clerk.accounts.dev https://calendly.com",
  "frame-ancestors 'none'",
  "form-action 'self' https://*.clerk.accounts.dev",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Apply security headers to any response. Strictness depends on whether the
 * response is portal-bound (hostname is a portal host OR pathname starts
 * with /portal). Portal responses get the locked-down CSP + frame-deny;
 * marketing responses get the universal headers only.
 */
function applySecurityHeaders(
  res: NextResponse,
  opts: { host: string; isPortalBound: boolean }
): NextResponse {
  // Universal — applies to every response
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "same-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // HSTS — only on real production hostnames (Netlify deploy URLs don't need
  // it; localhost can't honour it).
  if (isStrictProduction(opts.host)) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  if (opts.isPortalBound) {
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("Content-Security-Policy", PORTAL_CSP);
  } else {
    // Marketing — Webflow/Sanity embeds may use iframes, so allow same-origin
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    // No global CSP on marketing yet — too easy to break GTM/Stripe/Sanity.
    // Tighten in a follow-up after auditing those flows.
  }

  return res;
}

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get('host') ?? '';
  const url = req.nextUrl;
  const isPortal = isPortalHost(host);

  // ───────────────────────────────────────────────────────────────────────
  // 1. Brand resolution.
  // ───────────────────────────────────────────────────────────────────────

  let brandId: BrandId;
  let cookieAction: 'set-clever' | 'set-workwell' | 'clear' | null = null;

  if (isPortal) {
    // Portal hostname → brand fixed by hostname. No QA override on portal.
    brandId = portalBrandFromHost(host) ?? 'clever';
  } else {
    brandId = brandIdFromHost(host);
    if (isOverrideAllowed(host)) {
      const param = req.nextUrl.searchParams.get(BRAND_OVERRIDE_PARAM);
      if (param === 'clear') {
        cookieAction = 'clear';
      } else if (isValidBrand(param)) {
        brandId = param;
        cookieAction = param === 'workwell' ? 'set-workwell' : 'set-clever';
      } else {
        const cookieValue = req.cookies.get(BRAND_OVERRIDE_COOKIE)?.value;
        if (isValidBrand(cookieValue)) brandId = cookieValue;
      }
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-brand', brandId);
  requestHeaders.set('x-portal', isPortal ? '1' : '0');
  // Stamp the request pathname so server components / layouts can read it
  // via headers(). Next.js doesn't expose this reliably otherwise — needed
  // for layout-level conditional rendering (e.g. skip PortalShell for
  // /portal/preview/* design previews so they don't get a double sidebar).
  requestHeaders.set('x-pathname', url.pathname);

  // ───────────────────────────────────────────────────────────────────────
  // 2. Portal routing.
  // ───────────────────────────────────────────────────────────────────────

  // Tracks whether a portal-host request is a public funnel passthrough —
  // affects which CSP applies (marketing, not the strict portal CSP).
  let isPublicPassthrough = false;

  if (isPortal && isPortalPublicPassthrough(url.pathname)) {
    // Public funnel form on a portal host (e.g. /engagement-letter on
    // my.workwellaccountancy.com). Skip the /portal rewrite + auth gate
    // entirely — let it fall through to the default response so Next.js
    // serves the (funnel) route. Marketing CSP applies (see below).
    isPublicPassthrough = true;
  } else if (isPortal) {
    // On a portal hostname every other URL must resolve under /portal/*.
    // Determine the equivalent `/portal/...` path so we can auth-gate it
    // before issuing the internal rewrite.
    const portalPath = url.pathname.startsWith('/portal')
      ? url.pathname
      : '/portal' + url.pathname;

    if (!isPublicPortalPath(portalPath)) {
      const { userId } = await auth();
      if (!userId) {
        const signInUrl = url.clone();
        signInUrl.pathname = '/sign-in';
        signInUrl.searchParams.set('redirect_url', url.pathname + url.search);
        return applySecurityHeaders(NextResponse.redirect(signInUrl), {
          host,
          isPortalBound: true,
        });
      }
    }

    if (!url.pathname.startsWith('/portal')) {
      const rewriteUrl = url.clone();
      rewriteUrl.pathname = portalPath;
      return applySecurityHeaders(
        NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } }),
        { host, isPortalBound: true }
      );
    }
    // Already /portal/* on a portal host — let it through (rare, but defensive).
  } else if (url.pathname.startsWith('/portal')) {
    // /portal/* on a non-portal hostname.
    if (isStrictProduction(host)) {
      const target = BRANDS[brandId].portalDomain;
      const stripped = url.pathname.replace(/^\/portal/, '') || '/';
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`https://${target}${stripped}${url.search}`), 308),
        { host, isPortalBound: true }
      );
    }

    // Dev / preview: enforce auth gate but allow direct /portal/* access.
    if (!isPublicPortalPath(url.pathname)) {
      const { userId } = await auth();
      if (!userId) {
        const signInUrl = url.clone();
        signInUrl.pathname = '/portal/sign-in';
        signInUrl.searchParams.set('redirect_url', url.pathname + url.search);
        return applySecurityHeaders(NextResponse.redirect(signInUrl), {
          host,
          isPortalBound: true,
        });
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────
  // 3. Default response (marketing pages + dev/preview portal access).
  // ───────────────────────────────────────────────────────────────────────

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  if (cookieAction === 'clear') {
    res.cookies.set(BRAND_OVERRIDE_COOKIE, '', { path: '/', maxAge: 0 });
  } else if (cookieAction === 'set-clever' || cookieAction === 'set-workwell') {
    res.cookies.set(BRAND_OVERRIDE_COOKIE, cookieAction === 'set-workwell' ? 'workwell' : 'clever', {
      path: '/',
      sameSite: 'lax',
    });
  }

  // The "is this response portal-bound?" decision: hostname is portal, OR
  // path is /portal/* (catches dev/preview branch-deploy access at the same
  // URL as marketing routes). Public funnel passthroughs (e.g.
  // /engagement-letter on a portal host) are NOT portal-bound — they get the
  // looser marketing CSP so the form's third-party scripts work.
  const isPortalBound =
    !isPublicPassthrough && (isPortal || url.pathname.startsWith('/portal'));
  return applySecurityHeaders(res, { host, isPortalBound });
});

export const config = {
  // Skip static assets and Next internals — they don't need brand/auth awareness.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|brand/|images/|robots.txt|sitemap.xml).*)',
  ],
};
