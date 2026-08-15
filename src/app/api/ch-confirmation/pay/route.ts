import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/ch-confirmation/pay
 * Starts a Stripe Checkout for the Companies House confirmation-statement filing fee.
 * Body: { token, email, successUrl, cancelUrl } -> { url, sessionId }
 * Proxies to Apex CHConfirmation REST service (Stripe lives in Salesforce).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body?.token === 'string' ? body.token : '';
    const email = typeof body?.email === 'string' ? body.email : '';
    const successUrl = typeof body?.successUrl === 'string' ? body.successUrl : '';
    const cancelUrl = typeof body?.cancelUrl === 'string' ? body.cancelUrl : '';
    // How many people the client asked us to ID-verify, billed with the filing fee. Must be
    // forwarded: without it Apex prices the fee alone, so the client is charged less than the
    // page quoted. Apex clamps it to the people who actually still need a check.
    const idvPeopleCount = Number.isFinite(body?.idvPeopleCount) ? Number(body.idvPeopleCount) : 0;
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex('/CHConfirmation/pay'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${sfToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, successUrl, cancelUrl, idvPeopleCount }),
      cache: 'no-store',
    });
    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/ch-confirmation/pay error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
