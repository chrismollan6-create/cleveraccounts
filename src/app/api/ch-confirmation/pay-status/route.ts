import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * GET /api/ch-confirmation/pay-status?t=TOKEN&session=SESSION
 * Verifies a returned Stripe Checkout session and marks the filing fee paid.
 * Proxies to Apex CHConfirmation REST service.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    const session = request.nextUrl.searchParams.get('session') || '';
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(
      sfApex(`/CHConfirmation/pay-status?t=${encodeURIComponent(token)}&session=${encodeURIComponent(session)}`),
      { headers: { Authorization: `Bearer ${sfToken}` }, cache: 'no-store' },
    );
    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/ch-confirmation/pay-status error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
