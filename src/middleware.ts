import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { brandIdFromHost } from '@/lib/brand-host';
import { isPortalHost, portalBrandFromHost } from '@/lib/portal/host';
import { BRANDS, type BrandId } from '@/lib/constants';
import { IMPERSONATION_COOKIE } from '@/lib/portal/impersonation-cookie';

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
  // Staff "view as" entry/exit. No Clerk session (staff have none) — the
  // SF-minted token is the credential, verified inside the route handler.
  /^\/portal\/view-as(\/.*)?$/,
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
  // Public client forms (UTR capture, VAT decisions, complaints, etc.) under
  // src/app/(site)/forms/*. They embed third-party tfaforms.net iframes and
  // have no Clerk session — recipients open them from emails — so they must
  // serve directly on portal hosts without the auth gate. No /api/forms/*
  // counterpart: every form posts to tfaforms.net, not our backend.
  /^\/forms(\/.*)?$/,
  // Learning Centre — public marketing surface that Workwell visitors reach
  // via my.workwellaccountancy.com/learn. Without this they get auth-gated
  // to /sign-in. The /api/learn-feedback POST (Was this helpful? widget)
  // also has no Clerk session, so the API route needs to pass through too.
  /^\/learn(\/.*)?$/,
  /^\/api\/learn-feedback(\/.*)?$/,
  // Salesforce-triggered PDF rendering endpoints. They authenticate via a
  // shared-secret header (validated inside the route), so the Clerk auth gate
  // must let them pass. No portal collisions — portal APIs live under
  // /api/portal/*.
  /^\/api\/mtd-summary(\/.*)?$/,
  // The doc/preview pages that headless Chrome screenshots must also be
  // reachable without auth. Data travels in the base64 `d` query param the
  // API route encoded, so there's no PII leak from this being public.
  /^\/mtd-summary(\/.*)?$/,
  // Onboarding-guide (welcome pack). The render pages are linked from the
  // accountant intro email — Workwell clients open them on the portal host
  // my.workwellaccountancy.com/onboarding-guide/... with no Clerk session, so
  // without this they get 307-redirected to sign-in (and bounced to the
  // default portal host). Data rides in the base64 `d` query param. The
  // /api/onboarding-guide render endpoint (Salesforce callout, shared-secret)
  // must pass through too.
  /^\/onboarding-guide(\/.*)?$/,
  /^\/api\/onboarding-guide(\/.*)?$/,
  // MTD quarterly-summary approval. Workwell has no app.* host, so the approve
  // page (emailed to clients, who have no Clerk session) is served on the
  // portal host my.workwellaccountancy.com/mtd-approval/<token>. Both the page
  // and its API routes (query / approve / pdf) must pass through, or the
  // unauthenticated client gets 307-redirected to /sign-in. Access is gated by
  // the opaque per-quarter token validated inside each route.
  /^\/mtd-approval(\/.*)?$/,
  /^\/api\/mtd-approval(\/.*)?$/,
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

/**
 * Whether a staff view-as impersonation cookie is present. If so, we let the
 * request past the Clerk auth gate even without a Clerk session — staff have
 * none. This is only a PRESENCE check: the Edge runtime can't run node:crypto,
 * so the cookie's HMAC signature is verified for real downstream in
 * withPortalScope (Node runtime). A forged cookie therefore reaches the page
 * but is rejected there, so nothing leaks.
 */
function hasImpersonationCookie(req: NextRequest): boolean {
  return Boolean(req.cookies.get(IMPERSONATION_COOKIE)?.value);
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
// React's dev server + Turbopack require eval() for HMR and error-overlay
// callstack reconstruction. Allow 'unsafe-eval' ONLY outside production builds
// — production React never uses eval(), so the hardened prod CSP is unchanged
// (audit finding #1 stays closed for real deploys).
const DEV_SCRIPT_EVAL =
  process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

// Clerk Frontend API hosts. Dev/preview deploys use *.clerk.accounts.dev;
// production uses each brand's custom auth domain (clerk.<brand>). ClerkJS and
// its API/XHR calls load from these, so script-src + connect-src + frame-src +
// form-action must all allow them or the sign-in widget is CSP-blocked on the
// real my.<brand> hosts (it silently fails to render).
const CLERK_HOSTS =
  "https://*.clerk.accounts.dev https://clerk.cleveraccounts.com https://clerk.workwellaccountancy.com";

const PORTAL_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${DEV_SCRIPT_EVAL} ${CLERK_HOSTS} https://challenges.cloudflare.com`,
  // Clerk spawns a blob-based web worker for token refresh.
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.salesforce.com https://*.cleveraccounts.com https://*.workwellaccountancy.com https://*.clerk.com https://img.clerk.com",
  "font-src 'self' https://fonts.gstatic.com",
  `connect-src 'self' ${CLERK_HOSTS} https://clerk.com https://clerk-telemetry.com https://*.supabase.co wss://*.supabase.co https://api.calendly.com`,
  `frame-src https://challenges.cloudflare.com ${CLERK_HOSTS} https://calendly.com`,
  "frame-ancestors 'none'",
  `form-action 'self' ${CLERK_HOSTS}`,
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

const hasClerk =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

/**
 * Core middleware logic, independent of Clerk. `getUserId` returns the
 * authenticated user id (via Clerk) or null/undefined.
 *
 * When Clerk keys are absent (e.g. a preview environment that hasn't had
 * Clerk configured), `getUserId` always resolves to null — so every
 * authenticated portal route is DENIED (redirected to sign-in) and only
 * public marketing / funnel routes are served. Production always has the
 * keys, so this fallback never runs there and behaviour is unchanged.
 */
async function handle(req: NextRequest, getUserId: () => Promise<string | null | undefined>) {
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
  } else if (isPortal && url.pathname.startsWith('/api/')) {
    // Portal-host API routes live at /api/* (NOT under /portal/*) and each
    // handler authorizes itself:
    //   - /api/portal/clerk-webhook   → Svix signature (server-to-server, no session)
    //   - /api/portal/sync, /invite   → HMAC signature (server-to-server, no session)
    //   - all other /api/portal/*     → Clerk auth() / withPortalScope (IDOR-scoped)
    // They must bypass BOTH the `/portal` rewrite (which would 404 them at the
    // non-existent /portal/api/* path) AND the middleware session gate (which
    // would 307 legitimate sessionless webhooks to /sign-in). Fall through to
    // the default response below, which serves the route directly.
  } else if (isPortal) {
    // On a portal hostname every other URL must resolve under /portal/*.
    // Determine the equivalent `/portal/...` path so we can auth-gate it
    // before issuing the internal rewrite.
    const portalPath = url.pathname.startsWith('/portal')
      ? url.pathname
      : '/portal' + url.pathname;

    // The internal (rewritten) path is what server components / layouts must
    // see — not the public-facing `/sign-in`. Overwrite the x-pathname stamp
    // so layout-level checks (skip PortalShell on /portal/sign-in, active-nav
    // highlighting) resolve against the real route.
    requestHeaders.set('x-pathname', portalPath);

    if (!isPublicPortalPath(portalPath) && !hasImpersonationCookie(req)) {
      const userId = await getUserId();
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
    if (!isPublicPortalPath(url.pathname) && !hasImpersonationCookie(req)) {
      const userId = await getUserId();
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
}

// Production (and any env with Clerk keys) → real Clerk auth gate, unchanged.
// No keys (e.g. an unconfigured preview) → no Clerk import invoked at runtime;
// getUserId is always null so authenticated portal routes are denied while
// marketing/funnel routes still serve. Stops MIDDLEWARE_INVOCATION_FAILED.
export default hasClerk
  ? clerkMiddleware(async (auth, req) => handle(req, async () => (await auth()).userId))
  : (req: NextRequest) => handle(req, async () => null);

export const config = {
  // Skip static assets and Next internals — they don't need brand/auth awareness.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|brand/|images/|robots.txt|sitemap.xml).*)',
  ],
};
