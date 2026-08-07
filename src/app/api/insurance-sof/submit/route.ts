import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/insurance-sof/submit
 * Records a client's completed insurance Statement of Facts.
 * Body: { token: string, name: string, answers: {...} }
 * Proxies to the Apex InsuranceSOF REST service, which recomputes suitability
 * server-side and stamps the Account.
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown = null;
    try {
      body = await request.json();
    } catch {
      // invalid body
    }
    const b = (body ?? {}) as { token?: unknown; name?: unknown; answers?: unknown };
    const token = typeof b.token === 'string' ? b.token : '';
    const name = typeof b.name === 'string' ? b.name : '';
    const answers = b.answers ?? {};

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex('/InsuranceSOF'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, name, answers }),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/insurance-sof/submit error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
