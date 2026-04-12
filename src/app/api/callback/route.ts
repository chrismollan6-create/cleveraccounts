import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, businessType, bestTime } = body;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
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
        firstName,
        lastName,
        phone,
        email: '',
        businessType: businessType || '',
        utmSource: 'callback-widget',
        utmMedium: 'website',
        utmCampaign: '',
        utmTerm: '',
        utmContent: bestTime ? `Best time: ${bestTime}` : '',
        gclid: '',
        fbclid: '',
        msclkid: '',
        referralCode: '',
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
