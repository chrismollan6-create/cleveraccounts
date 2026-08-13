import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/direct-debit/bankcheck?t=TOKEN
 * Body: { sortCode, accountNumber }
 *
 * Modulus-checks the details while the payer is still on the page. Telling
 * someone their account number is wrong after they have closed the tab is
 * useless, and showing them their own bank's name is how they know they typed
 * it correctly.
 *
 * Token-gated in Apex so this cannot be used as a public oracle for
 * enumerating valid account numbers.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/DDRequest/bankcheck?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await sfRes.json();
    if (!sfRes.ok) {
      return NextResponse.json({ error: data.error || 'Check unavailable' }, { status: sfRes.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/direct-debit/bankcheck error:', err instanceof Error ? err.message : 'unknown');
    // A failed check must not block sign-up — the server re-checks on submit.
    return NextResponse.json({ skipped: true });
  }
}
