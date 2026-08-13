import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/ch-confirmation/idv-service
 * The client has asked us to carry out the Companies House identity checks for them.
 * Body: { token, people?: [{ contactId, email?, phone? }] }
 *
 * Called after the combined payment succeeds, so nobody enters the verification workflow without
 * having paid. Proxies to Apex, which stamps the contacts and then the account — that account
 * update is what triggers the Credas flow.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body?.token === 'string' ? body.token : '';
    const people = Array.isArray(body?.people) ? body.people : [];
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex('/CHConfirmation/idv-service'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${sfToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, people }),
      cache: 'no-store',
    });
    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/ch-confirmation/idv-service error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
