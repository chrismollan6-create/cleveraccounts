import { BRANDS, type BrandConfig, type BrandId } from './constants';
import { brandIdFromHost } from './brand-host';

/**
 * Re-export for callers that import from `@/lib/brand`. The implementation
 * lives in `brand-host.ts` so it can be imported by Edge middleware and any
 * other context that can't load `next/headers`.
 */
export { brandIdFromHost };

/**
 * Resolve the current request's brand inside a server component, layout, or
 * route handler. Reads the `x-brand` header set by middleware.
 *
 * `next/headers` is loaded via dynamic import so the top of this module
 * stays free of server-only APIs — important because Turbopack will
 * otherwise refuse to bundle it for any context that touches a
 * non-server-only path. Side effect: callers must already be in an
 * environment where `next/headers` is callable (server component,
 * route handler, server action). Calling from a client component or
 * middleware will throw at runtime.
 *
 * In environments where middleware didn't run (rare — e.g. pure static
 * generation outside of a request), defaults to Clever.
 *
 * Async because Next.js 15 made `headers()` async.
 */
export async function getBrand(): Promise<BrandConfig> {
  const { headers } = await import('next/headers');
  const h = await headers();
  const id = (h.get('x-brand') as BrandId | null) ?? 'clever';
  return BRANDS[id] ?? BRANDS.clever;
}

/** Synchronous variant for callers that already have a BrandId in hand. */
export function getBrandById(id: BrandId): BrandConfig {
  return BRANDS[id] ?? BRANDS.clever;
}
