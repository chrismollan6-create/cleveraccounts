import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/** GET /api/signup/stripe/status?t=TOKEN&sessionId=X — verify Stripe payment status */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    const sessionId = request.nextUrl.searchParams.get('sessionId');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();

    const sfRes = await fetch(
      sfApex(
        `/SignupForm/stripe/status?t=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sessionId)}`
      ),
      {
        headers: { Authorization: `Bearer ${sfToken}` },
      }
    );

    const data = await sfRes.json();

    if (!sfRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to retrieve payment status' },
        { status: sfRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/signup/stripe/status error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
