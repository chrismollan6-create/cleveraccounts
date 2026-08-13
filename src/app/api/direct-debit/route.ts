import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * GET /api/direct-debit?t=TOKEN
 * Loads a Direct Debit request for the public sign-up page. Thin proxy onto
 * the Apex /DDRequest endpoint — see DDRequestRestService.cls.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/DDRequest?t=${encodeURIComponent(token)}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
      cache: 'no-store',
    });

    const data = await sfRes.json();

    if (!sfRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to load this Direct Debit request' },
        { status: sfRes.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/direct-debit GET error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
