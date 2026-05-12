import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, businessType, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    const token = await getSalesforceToken();

    // Apex appends `contactMessage` at the top of Lead.Description, with the
    // UTM attribution block below. utmSource = 'contact-form' lets Salesforce
    // reporting distinguish contact-form Leads from sign-up / callback Leads.
    const sfRes = await fetch(sfApex('/SignupLead'), {
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
        contactMessage: message,
        utmSource: 'contact-form',
        utmMedium: 'website',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        gclid: '',
        fbclid: '',
        msclkid: '',
        referralCode: '',
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
