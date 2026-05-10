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
  /^\/portal\/sign-up(\/.*)?$/,
  /^\/portal\/?$/, // bare /portal — landing page can be public
];

function isOverrideAllowed(): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const ctx = process.env.CONTEXT;
  if (ctx && ctx !== 'production') return true;
  return false;
}

function isStrictProduction(): boolean {
  if (process.env.NODE_ENV !== 'production') return false;
  const ctx = process.env.CONTEXT;
  if (ctx && ctx !== 'production') return false;
  return true;
}

function isValidBrand(v: string | null | undefined): v is BrandId {
  return v === 'clever' || v === 'workwell';
}

function isPublicPortalPath(portalPath: string): boolean {
  return PUBLIC_PORTAL_PATTERNS.some((p) => p.test(portalPath));
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
    if (isOverrideAllowed()) {
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

  // ───────────────────────────────────────────────────────────────────────
  // 2. Portal routing.
  // ───────────────────────────────────────────────────────────────────────

  if (isPortal) {
    // On a portal hostname every URL must resolve under /portal/*.
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
        return NextResponse.redirect(signInUrl);
      }
    }

    if (!url.pathname.startsWith('/portal')) {
      const rewriteUrl = url.clone();
      rewriteUrl.pathname = portalPath;
      return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
    }
    // Already /portal/* on a portal host — let it through (rare, but defensive).
  } else if (url.pathname.startsWith('/portal')) {
    // /portal/* on a non-portal hostname.
    if (isStrictProduction()) {
      const target = BRANDS[brandId].portalDomain;
      const stripped = url.pathname.replace(/^\/portal/, '') || '/';
      return NextResponse.redirect(new URL(`https://${target}${stripped}${url.search}`), 308);
    }

    // Dev / preview: enforce auth gate but allow direct /portal/* access.
    if (!isPublicPortalPath(url.pathname)) {
      const { userId } = await auth();
      if (!userId) {
        const signInUrl = url.clone();
        signInUrl.pathname = '/portal/sign-in';
        signInUrl.searchParams.set('redirect_url', url.pathname + url.search);
        return NextResponse.redirect(signInUrl);
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

  return res;
});

export const config = {
  // Skip static assets and Next internals — they don't need brand/auth awareness.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|brand/|images/|robots.txt|sitemap.xml).*)',
  ],
};
