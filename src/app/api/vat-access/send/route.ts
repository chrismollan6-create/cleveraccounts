import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/vat-access/send?t=TOKEN
 * Body: { option } — one of the masked addresses the lock screen offered.
 * Salesforce emails a 6-digit code to that address on file. Never an address the visitor typed.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    let option: unknown = null;
    try {
      option = ((await request.json()) as { option?: unknown })?.option ?? null;
    } catch {
      // no body
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/VATAccess/send?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${sfToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ option: typeof option === 'string' ? option : null }),
      cache: 'no-store',
    });
    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.status });
  } catch (err) {
    console.error('/api/vat-access/send error:', err);
    return NextResponse.json({ error: 'Something went wrong sending your code. Please try again.' }, { status: 500 });
  }
}
