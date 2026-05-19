import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, businessType, message, branding } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
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
        phone: phone || '',
        businessType: businessType || '',
        message,
        branding: branding || '',
        utmSource: 'contact-form',
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
      console.error('Salesforce contact lead error:', sfData);
      return NextResponse.json(
        { error: sfData.error || 'Failed to submit your message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('/api/contact error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
