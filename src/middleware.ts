import { NextRequest, NextResponse } from 'next/server';
import { brandIdFromHost } from '@/lib/brand';

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
 * Brand is NEVER passed via query string — it must be derived from the host
 * to prevent leaks (a stale link to `?brand=workwell` on the Clever domain
 * would otherwise show Workwell branding on a Clever URL).
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const brandId = brandIdFromHost(host);

  // Forward the brand to downstream RSC/route handlers via a request header.
  // We do this by cloning the request headers and applying them to NextResponse.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-brand', brandId);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Skip static assets and Next internals — they don't need brand awareness.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|brand/|images/|robots.txt|sitemap.xml).*)',
  ],
};
