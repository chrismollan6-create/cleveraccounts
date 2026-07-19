'use client';

import { usePathname } from 'next/navigation';

/**
 * Suppresses ALL analytics/tags on token-bearing transactional pages.
 *
 * The VAT approval and books-ready pages carry an opaque CAPABILITY token in the URL path
 * (/vat-approval/<token>). GTM and Vercel Analytics report the page path by default, which would
 * send that token — a bearer credential that authorises a legal HMRC filing — to Google and Vercel.
 * These pages are noindex and transactional; they need no marketing analytics at all, so we render
 * nothing here rather than trying to scrub the path downstream. Reads the path client-side only; the
 * token never leaves the browser via this component.
 */
const SENSITIVE_PREFIXES = ['/vat-approval/', '/vat-books-ready/'];

export default function AnalyticsGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  if (SENSITIVE_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <>{children}</>;
}
