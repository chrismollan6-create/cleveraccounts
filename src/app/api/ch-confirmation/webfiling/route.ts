import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/ch-confirmation/webfiling
 * Records the company's Companies House authentication (webfiling) code the client provides.
 * Body: { token: string, code: string }
 * Proxies to the Apex CHConfirmation REST service, which validates + stores it on the account.
 */
export async function POST(request: NextRequest) {
  try {
    let token = '';
    let code = '';
    try {
      const body = await request.json();
      if (body && typeof body.token === 'string') token = body.token;
      if (body && typeof body.code === 'string') code = body.code;
    } catch {
      // invalid body
    }
    if (!token || !code) {
      return NextResponse.json({ error: 'token and code are required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex('/CHConfirmation/webfiling'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, code }),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/ch-confirmation/webfiling error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
