import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * GET /api/engagement-letter?t=TOKEN
 * Loads the engagement letter for the public signing page. Thin proxy onto
 * the Apex /EngagementLetter endpoint — see EngagementLetterRestService.cls.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/EngagementLetter?t=${encodeURIComponent(token)}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
      cache: 'no-store',
    });

    const data = await sfRes.json();

    if (!sfRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to load engagement letter' },
        { status: sfRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/engagement-letter GET error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
