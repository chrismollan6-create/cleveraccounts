import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/filing-confirmation/respond
 * Records the client's confirmation (or decline) of a Companies House change we're about to file.
 * Body: { token: string, name: string, decision: 'confirm' | 'decline',
 *         officerCascade?: Array<{ key, service, residential } | { key, psc: true, service }> }
 * The cascade carries both directors (Contact Ids) and people on the PSC register (PSC Ids);
 * Apex re-validates every key against the company's own live register before anything is filed.
 * Proxies to the Apex FilingConfirmation REST service.
 */
export async function POST(request: NextRequest) {
  try {
    let token = '';
    let name = '';
    let decision = 'confirm';
    let officerCascade: unknown = undefined;
    let tradingAddressChange = false;
    try {
      const body = await request.json();
      if (body && typeof body.token === 'string') token = body.token;
      if (body && typeof body.name === 'string') name = body.name;
      if (body && typeof body.decision === 'string') decision = body.decision;
      if (body && Array.isArray(body.officerCascade)) officerCascade = body.officerCascade;
      if (body && typeof body.tradingAddressChange === 'boolean') tradingAddressChange = body.tradingAddressChange;
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
      body: JSON.stringify({ token, name, decision, officerCascade, tradingAddressChange }),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/filing-confirmation/respond error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
