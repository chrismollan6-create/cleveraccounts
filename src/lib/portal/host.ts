/**
 * Portal hostname detection.
 *
 * Used by middleware to:
 *   1. Identify requests aimed at the client portal (portal.* hosts).
 *   2. Rewrite their pathname to the /portal/* route segment so Next.js
 *      serves src/app/portal/{...}/page.tsx, while users see clean URLs
 *      like portal.cleveraccounts.com/dashboard.
 *   3. Block cross-segment leakage (portal hosts hitting marketing routes
 *      and vice versa) — important for pentest isolation narrative.
 *
 * The set of recognised portal hosts is derived from BRANDS so adding a
 * new tenant is "add an entry to BRANDS" — no middleware changes.
 */

import { BRANDS, type BrandId } from '@/lib/constants';

/** All registered portal hostnames (e.g. ['portal.cleveraccounts.com', 'portal.workwellaccountancy.com']). */
export const PORTAL_HOSTS: readonly string[] = Object.values(BRANDS).map((b) => b.portalDomain);

/** Returns true if the given Host header matches a registered portal hostname. */
export function isPortalHost(host: string): boolean {
  const h = host.toLowerCase().split(':')[0];
  return PORTAL_HOSTS.includes(h);
}

/**
 * Map a portal hostname → BrandId. Returns null if the host is NOT a portal host.
 *
 * Distinct from the marketing `brandIdFromHost()` helper because it lets the
 * middleware reason about "is this a portal request at all?" without coupling
 * to the marketing-side fallback-to-clever behaviour.
 */
export function portalBrandFromHost(host: string): BrandId | null {
  const h = host.toLowerCase().split(':')[0];
  for (const brand of Object.values(BRANDS)) {
    if (brand.portalDomain === h) return brand.id;
  }
  return null;
}
