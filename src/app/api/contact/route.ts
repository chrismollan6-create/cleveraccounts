import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { brandIdFromHost, getBrandById } from '@/lib/brand';
import type { BrandId } from '@/lib/constants';

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

    // Resolve brand server-side (x-brand header, host fallback) so enquiries are
    // branded correctly even if the client omits it.
    const brandIdHeader = request.headers.get('x-brand') as BrandId | null;
    const brandId: BrandId =
      brandIdHeader === 'workwell' || brandIdHeader === 'clever'
        ? brandIdHeader
        : brandIdFromHost(request.headers.get('host') ?? '');
    const brand = getBrandById(brandId);

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
        branding: branding || brand.salesforceLeadValue,
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
