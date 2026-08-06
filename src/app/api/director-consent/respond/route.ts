import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/director-consent/respond
 * Records the outgoing director's consent + drawn signature for a TM01.
 * Body: { token: string, name: string, signature: string(base64 png data URL) }
 * Proxies to the Apex DirectorConsent REST service.
 */
export async function POST(request: NextRequest) {
  try {
    let token = '';
    let name = '';
    let signature = '';
    try {
      const body = await request.json();
      if (body && typeof body.token === 'string') token = body.token;
      if (body && typeof body.name === 'string') name = body.name;
      if (body && typeof body.signature === 'string') signature = body.signature;
    } catch {
      // invalid body
    }
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex('/DirectorConsent/respond'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, name, signature }),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/director-consent/respond error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
