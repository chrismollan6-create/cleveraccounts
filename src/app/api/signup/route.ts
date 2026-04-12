import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/** GET /api/signup?t=TOKEN — load form data for Stage 2 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/SignupForm?t=${encodeURIComponent(token)}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
    });

    const data = await sfRes.json();

    if (!sfRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to load form data' },
        { status: sfRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/signup GET error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
