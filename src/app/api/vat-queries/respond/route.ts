import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/vat-queries/respond?t=TOKEN
 * Records the client's per-section responses to their VAT query pack and triggers a re-review.
 * Body: { checks: { "<code>": { status: "fixed" | "correct", note?: string } } }
 * Proxies to the Apex VATQueries REST service.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    let body: unknown = {};
    try {
      body = await request.json();
    } catch {
      // empty/invalid body → respond with nothing recorded
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/VATQueries/respond?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ?? {}),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/vat-queries/respond error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
