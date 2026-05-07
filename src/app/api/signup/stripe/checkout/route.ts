import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/** POST /api/signup/stripe/checkout?t=TOKEN — create Stripe checkout session */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Inject our own returnBaseUrl into the body so Stripe redirects back to
    // the website funnel (instead of the legacy Salesforce-hosted form, which
    // is the default for sales-invited signups).
    const incomingBody = await request.json().catch(() => ({}));
    const origin = request.nextUrl.origin; // e.g. https://cleveraccounts.com
    const enrichedBody = JSON.stringify({
      ...incomingBody,
      returnBaseUrl: `${origin}/sign-up/details`,
    });

    const sfToken = await getSalesforceToken();

    const sfRes = await fetch(
      sfApex(`/SignupForm/stripe/checkout?t=${encodeURIComponent(token)}`),
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sfToken}`,
          'Content-Type': 'application/json',
        },
        body: enrichedBody,
      }
    );

    const data = await sfRes.json();

    if (!sfRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create checkout session' },
        { status: sfRes.status }
      );
    }

    // Salesforce returns { sessionId, checkoutUrl } — the client expects `url`.
    // Normalise here so the API contract is Stripe-shaped.
    return NextResponse.json({
      url: data.checkoutUrl ?? data.url,
      sessionId: data.sessionId,
    });
  } catch (err) {
    console.error('/api/signup/stripe/checkout error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
