import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/ch-confirmation/respond
 * Records the client's per-section confirmation-statement review.
 * Body: { token: string, payload: { sections: { <key>: { ok, note, value? } } } }
 * Proxies to Apex CHConfirmation REST service.
 */
export async function POST(request: NextRequest) {
  try {
    let token = '';
    let payload: unknown = {};
    try {
      const body = await request.json();
      if (body && typeof body.token === 'string') token = body.token;
      if (body && body.payload) payload = body.payload;
    } catch {
      // invalid body
    }
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex('/CHConfirmation/respond'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, payload }),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/ch-confirmation/respond error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
