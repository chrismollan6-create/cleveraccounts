import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/ch-confirmation/idv
 * Records a director/PSC Companies House personal (identity verification) code.
 * Body: { token: string, type: 'officer' | 'psc', id: string, code: string }
 * Proxies to Apex CHConfirmation REST service, which validates the person belongs to the company.
 */
export async function POST(request: NextRequest) {
  try {
    let token = '';
    let type = '';
    let id = '';
    let code = '';
    try {
      const body = await request.json();
      if (body && typeof body.token === 'string') token = body.token;
      if (body && typeof body.type === 'string') type = body.type;
      if (body && typeof body.id === 'string') id = body.id;
      if (body && typeof body.code === 'string') code = body.code;
    } catch {
      // invalid body
    }
    if (!token || !type || !id || !code) {
      return NextResponse.json({ error: 'token, type, id and code are required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex('/CHConfirmation/idv'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, type, id, code }),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/ch-confirmation/idv error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
