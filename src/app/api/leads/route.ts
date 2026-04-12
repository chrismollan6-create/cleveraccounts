import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, email, phone, businessType,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, msclkid,
      referralCode,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    const token = await getSalesforceToken();

    const sfRes = await fetch(sfApex('/SignupLead'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName, lastName, email, phone, businessType,
        utmSource: utm_source || '',
        utmMedium: utm_medium || '',
        utmCampaign: utm_campaign || '',
        utmTerm: utm_term || '',
        utmContent: utm_content || '',
        gclid: gclid || '',
        fbclid: fbclid || '',
        msclkid: msclkid || '',
        referralCode: referralCode || '',
      }),
    });

    const sfData = await sfRes.json();

    if (!sfRes.ok || !sfData.success) {
      console.error('Salesforce SignupLead error:', sfData);
      return NextResponse.json(
        { error: sfData.error || 'Failed to create lead in Salesforce' },
        { status: 500 }
      );
    }

    // Extract the token from the SF-returned URL and build a local redirect.
    // This ensures the user stays on the current host (localhost in dev, production in prod)
    // rather than being sent to the hardcoded URL in the Apex class.
    const sfUrl = new URL(sfData.url);
    const signupToken = sfUrl.searchParams.get('t');

    // Append UTMs to redirect so Stage 2 can re-capture them if sessionStorage was cleared
    const utmParams = new URLSearchParams();
    if (utm_source) utmParams.set('utm_source', utm_source);
    if (utm_medium) utmParams.set('utm_medium', utm_medium);
    if (utm_campaign) utmParams.set('utm_campaign', utm_campaign);
    if (utm_term) utmParams.set('utm_term', utm_term);
    if (utm_content) utmParams.set('utm_content', utm_content);
    if (gclid) utmParams.set('gclid', gclid);
    const utmString = utmParams.toString();

    return NextResponse.json({
      redirectUrl: `/sign-up/details?t=${signupToken}${utmString ? '&' + utmString : ''}`,
    });
  } catch (err) {
    console.error('/api/leads error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
