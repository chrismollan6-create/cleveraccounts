import { headers } from 'next/headers';
import { BRANDS, type BrandConfig, type BrandId } from './constants';

/**
 * Map a Host header value to a BrandId.
 *
 * Used by both the middleware (to stamp `x-brand` on the request) and any
 * server-side code that needs to resolve brand from a raw host string
 * (e.g. API routes that didn't go through middleware for some reason).
 *
 * Falls back to 'clever' for unknown hosts (localhost, *.netlify.app preview
 * URLs, marketing/SEO crawlers hitting the apex without a www prefix).
 */
export function brandIdFromHost(host: string): BrandId {
  // Normalise — strip port, lowercase.
  const h = host.toLowerCase().split(':')[0];
  if (h.includes('workwellaccountancy.com') || h.includes('workwell')) {
    return 'workwell';
  }
  return 'clever';
}

/**
 * Resolve the current request's brand inside a server component, layout, or
 * route handler. Reads the `x-brand` header set by middleware.
 *
 * In environments where middleware didn't run (rare — e.g. pure static
 * generation outside of a request), defaults to Clever.
 *
 * Async because Next.js 15 made `headers()` async.
 */
export async function getBrand(): Promise<BrandConfig> {
  const h = await headers();
  const id = (h.get('x-brand') as BrandId | null) ?? 'clever';
  return BRANDS[id] ?? BRANDS.clever;
}

/** Synchronous variant for callers that already have a BrandId in hand. */
export function getBrandById(id: BrandId): BrandConfig {
  return BRANDS[id] ?? BRANDS.clever;
}
