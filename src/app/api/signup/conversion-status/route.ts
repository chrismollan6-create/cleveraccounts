import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * GET /api/signup/conversion-status?t=TOKEN
 *
 * Returns the post-conversion data needed to render the rich "you're all set"
 * page: assigned accountant (name/photo/contact), payment summary (subtotal,
 * VAT, total, next charge date), and onboarding milestones.
 *
 * Used by the SignUpDetailsClient completion screen to replace the basic
 * "we'll be in touch" placeholder with concrete, personalised content.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/SignupForm/status?t=${encodeURIComponent(token)}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
    });

    const data = await sfRes.json();

    if (!sfRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to load conversion status' },
        { status: sfRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/signup/conversion-status error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
