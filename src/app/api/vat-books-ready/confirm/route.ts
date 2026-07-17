import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/vat-books-ready/confirm?t=TOKEN
 * Records the client's confirmation that their books are complete for the VAT period.
 * Proxies to Apex VATBooksReady REST service (general integration identity).
 *
 * POST, never GET: mail scanners (Outlook Safe Links, Gmail's proxy, Mimecast) fetch every
 * URL in an email to check it. A GET that confirmed would be tripped by the scanner before
 * the client ever opened the message, and we would review a half-finished quarter believing
 * they had told us it was done.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/VATBooksReady/confirm?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/vat-books-ready/confirm error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
