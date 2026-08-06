import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/filing-confirmation/respond
 * Records the client's confirmation (or decline) of a Companies House change we're about to file.
 * Body: { token: string, name: string, decision: 'confirm' | 'decline' }
 * Proxies to the Apex FilingConfirmation REST service.
 */
export async function POST(request: NextRequest) {
  try {
    let token = '';
    let name = '';
    let decision = 'confirm';
    try {
      const body = await request.json();
      if (body && typeof body.token === 'string') token = body.token;
      if (body && typeof body.name === 'string') name = body.name;
      if (body && typeof body.decision === 'string') decision = body.decision;
    } catch {
      // invalid body
    }
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex('/FilingConfirmation/respond'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, name, decision }),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/filing-confirmation/respond error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
