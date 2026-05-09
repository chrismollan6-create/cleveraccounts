import { NextRequest, NextResponse } from 'next/server';
import { brandIdFromHost } from '@/lib/brand';
import type { BrandId } from '@/lib/constants';

/**
 * Multi-tenant brand detection.
 *
 * The Next.js app is reachable at multiple hosts:
 *   - cleveraccounts.com           → Clever brand
 *   - app.workwellaccountancy.com  → Workwell brand (subdomain CNAME'd to Netlify)
 *   - localhost / *.netlify.app    → Clever (default for dev/preview)
 *
 * We resolve the brand from the `Host` header here and stash the result on a
 * response header (`x-brand`) that downstream server components / route
 * handlers can read via `getBrand()` (src/lib/brand.ts).
 *
 * Brand is NEVER passed via query string in production — the host header is
 * the only source of truth there, preventing leaks from stale cross-domain
 * links. See "Debug brand override" below for the dev/preview-only escape
 * hatch used when DNS isn't yet pointed at Netlify.
 */

const BRAND_OVERRIDE_COOKIE = '_brand_override';
const BRAND_OVERRIDE_PARAM = '_brand';

/**
 * Whether the brand override (cookie + ?_brand=) is honoured. Allowed in:
 *   - Local development  (NODE_ENV !== 'production')
 *   - Netlify deploy previews / branch deploys (CONTEXT !== 'production')
 *
 * Hard-blocked in true production deploys so a stale shared link with
 * ?_brand=workwell can't ever flip the live cleveraccounts.com to Workwell.
 */
function isOverrideAllowed(): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  // On Netlify, CONTEXT is set to one of: production | deploy-preview | branch-deploy | dev
  const ctx = process.env.CONTEXT;
  if (ctx && ctx !== 'production') return true;
  return false;
}

function isValidBrand(v: string | null | undefined): v is BrandId {
  return v === 'clever' || v === 'workwell';
}

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  let brandId: BrandId = brandIdFromHost(host);
  let cookieAction: 'set-clever' | 'set-workwell' | 'clear' | null = null;

  if (isOverrideAllowed()) {
    const param = req.nextUrl.searchParams.get(BRAND_OVERRIDE_PARAM);
    if (param === 'clear') {
      // Explicit clear → drop cookie, fall back to host-resolved brand
      cookieAction = 'clear';
    } else if (isValidBrand(param)) {
      // Query param wins, and we persist via cookie so subsequent navigations
      // (which won't have the param) keep the override active
      brandId = param;
      cookieAction = param === 'workwell' ? 'set-workwell' : 'set-clever';
    } else {
      // No param → honour existing cookie if present and valid
      const cookieValue = req.cookies.get(BRAND_OVERRIDE_COOKIE)?.value;
      if (isValidBrand(cookieValue)) {
        brandId = cookieValue;
      }
    }
  }

  // Forward the resolved brand to downstream RSC/route handlers via a
  // request header. (Cloning headers and re-supplying via `request.headers`
  // is the canonical Next.js pattern.)
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-brand', brandId);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  // Apply any cookie change. SameSite=Lax + no Secure flag so it works on
  // http://localhost during dev. Path=/ so every route honours it.
  if (cookieAction === 'clear') {
    res.cookies.set(BRAND_OVERRIDE_COOKIE, '', { path: '/', maxAge: 0 });
  } else if (cookieAction === 'set-clever' || cookieAction === 'set-workwell') {
    res.cookies.set(BRAND_OVERRIDE_COOKIE, cookieAction === 'set-workwell' ? 'workwell' : 'clever', {
      path: '/',
      sameSite: 'lax',
      // No maxAge → session cookie, cleared when the browser closes.
      // No httpOnly → harmless to be readable; lets devtools confirm it.
    });
  }

  return res;
}

export const config = {
  // Skip static assets and Next internals — they don't need brand awareness.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|brand/|images/|robots.txt|sitemap.xml).*)',
  ],
};
