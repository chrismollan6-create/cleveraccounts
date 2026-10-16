import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

/**
 * The lock on the client VAT pages (/vat-approval/<token>, /vat-queries/<token>).
 *
 * Holding the link no longer opens the page. Salesforce (VATClientAccessService) emails a 6-digit
 * code to an address already on file, and the right code returns a session signed for this one
 * link. We keep it in an httpOnly cookie for 7 days and forward it on every call to Salesforce
 * as X-VAT-Session. Salesforce refuses the figures without it, so the lock is not just a screen.
 */

export const VAT_SESSION_HEADER = 'X-VAT-Session';

export interface VatGateOption {
  id: string;
  masked: string;
  name?: string | null;
}

/** The body Salesforce returns with a 401: what the lock screen offers. */
export interface VatGate {
  gate: true;
  options: VatGateOption[];
  error?: string | null;
}

export function isVatGate(data: unknown): data is VatGate {
  return !!data && typeof data === 'object' && (data as { gate?: unknown }).gate === true;
}

/** One cookie per link, so two returns open in one browser don't sign each other out. */
export function vatCookieName(token: string): string {
  return `vat_access_${token.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
}

export async function vatSessionFromCookies(token: string): Promise<string | null> {
  const jar = await cookies();
  return jar.get(vatCookieName(token))?.value ?? null;
}

export function vatSessionFromRequest(request: NextRequest, token: string): string | null {
  return request.cookies.get(vatCookieName(token))?.value ?? null;
}

export function vatSessionHeaders(session: string | null | undefined): Record<string, string> {
  return session ? { [VAT_SESSION_HEADER]: session } : {};
}
