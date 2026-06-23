import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/mtd-approval/query?t=TOKEN
 * Records that the client flagged a query on their MTD quarterly summary.
 * Body: { notes?: string }. Proxies to Apex MTDApprovalRestService.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    let notes = '';
    try {
      const body = await request.json();
      if (body && typeof body.notes === 'string') notes = body.notes;
    } catch {
      // empty/invalid body → query with no detail
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/MTDApproval/query?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.ok ? 200 : sfRes.status });
  } catch (err) {
    console.error('/api/mtd-approval/query error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
