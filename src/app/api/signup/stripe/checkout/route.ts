import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/** POST /api/signup/stripe/checkout?t=TOKEN — create Stripe checkout session */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const body = await request.text();
    const sfToken = await getSalesforceToken();

    const sfRes = await fetch(
      sfApex(`/SignupForm/stripe/checkout?t=${encodeURIComponent(token)}`),
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sfToken}`,
          'Content-Type': 'application/json',
        },
        body,
      }
    );

    const data = await sfRes.json();

    if (!sfRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create checkout session' },
        { status: sfRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/signup/stripe/checkout error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
