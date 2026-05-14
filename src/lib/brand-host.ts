import { type BrandId } from './constants';

/**
 * Pure host-string → BrandId mapping. Extracted from `lib/brand.ts` so it can
 * be imported by Edge middleware (which can't pull in `next/headers`).
 *
 * Falls back to 'clever' for unknown hosts (localhost, *.netlify.app preview
 * URLs, marketing/SEO crawlers hitting the apex without a www prefix).
 */
export function brandIdFromHost(host: string): BrandId {
  const h = host.toLowerCase().split(':')[0];
  if (h.includes('workwellaccountancy.com') || h.includes('workwell')) {
    return 'workwell';
  }
  return 'clever';
}
