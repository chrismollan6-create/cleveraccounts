/**
 * /book/[token] — dynamic "book a call" redirect.
 *
 * The accountant intro email and the onboarding welcome pack link here instead
 * of baking in a specific accountant's Calendly URL. At click-time we resolve
 * the account's CURRENT owner and redirect to *their* Calendly, so a client who
 * has been transferred to a new accountant always books the right person —
 * even from an email that was sent before the transfer.
 *
 * token = the 15/18-char Account Id (not sensitive; the target is a public
 * Calendly booking page). Calendly slug = the owner's 15-char User Id, matching
 * the long-standing org convention. When the current owner isn't Calendly-
 * enabled (Account.Calendar_UserId__c = false) we fall back to the brand site.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { getSalesforceToken } from '@/lib/salesforce';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BRAND_FALLBACK: Record<string, string> = {
  Workwell: 'https://workwellaccountancy.com',
  'Clever Accounts': 'https://cleveraccounts.com',
};
const DEFAULT_FALLBACK = 'https://cleveraccounts.com';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const id = (token ?? '').trim();

  // Account Ids are 15/18-char alphanumeric — validate to keep the SOQL safe.
  if (!/^[a-zA-Z0-9]{15,18}$/.test(id)) {
    return NextResponse.redirect(DEFAULT_FALLBACK, 302);
  }

  try {
    const sfToken = await getSalesforceToken();
    const soql =
      `SELECT OwnerId, Calendar_UserId__c, Branding__c FROM Account WHERE Id = '${id}' LIMIT 1`;
    const res = await fetch(
      `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v60.0/query?q=${encodeURIComponent(soql)}`,
      { headers: { Authorization: `Bearer ${sfToken}` }, cache: 'no-store' },
    );
    if (!res.ok) return NextResponse.redirect(DEFAULT_FALLBACK, 302);

    const data = await res.json();
    const rec = data?.records?.[0] as
      | { OwnerId?: string; Calendar_UserId__c?: boolean; Branding__c?: string }
      | undefined;
    if (!rec) return NextResponse.redirect(DEFAULT_FALLBACK, 302);

    const fallback = BRAND_FALLBACK[rec.Branding__c ?? ''] ?? DEFAULT_FALLBACK;

    // Current owner is Calendly-enabled → book their calendar.
    if (rec.Calendar_UserId__c === true && rec.OwnerId) {
      const slug = String(rec.OwnerId).substring(0, 15);
      return NextResponse.redirect(`https://calendly.com/${slug}`, 302);
    }

    // New owner has no Calendly — don't send them to the wrong (old) calendar.
    return NextResponse.redirect(fallback, 302);
  } catch {
    return NextResponse.redirect(DEFAULT_FALLBACK, 302);
  }
}
