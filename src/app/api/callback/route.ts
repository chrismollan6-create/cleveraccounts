import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, businessType, bestTime, branding } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email and phone number are required' },
        { status: 400 }
      );
    }

    const token = await getSalesforceToken();

    const sfRes = await fetch(sfApex('/WebEnquiry'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        businessType: businessType || '',
        bestTime: bestTime || '',
        branding: branding || '',
        utmSource: 'callback-widget',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        gclid: '',
        fbclid: '',
        msclkid: '',
      }),
    });

    const sfData = await sfRes.json();

    if (!sfRes.ok || !sfData.success) {
      console.error('Salesforce callback lead error:', sfData);
      return NextResponse.json(
        { error: sfData.error || 'Failed to submit callback request' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('/api/callback error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
