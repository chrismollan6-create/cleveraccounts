import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { brandIdFromHost, getBrandById } from '@/lib/brand';
import type { BrandId } from '@/lib/constants';

// The base64-encoded contract file inflates the JSON body ~33%. Vercel
// serverless functions cap the request body at ~4.5MB, so we keep the raw
// upload under 4MB (enforced client-side too) to stay safely under that.
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot — bots fill hidden fields; humans never see them.
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'First and last name are required' },
        { status: 400 }
      );
    }

    // Resolve brand server-side (x-brand header set by middleware, host fallback).
    const brandIdHeader = request.headers.get('x-brand') as BrandId | null;
    const brandId: BrandId =
      brandIdHeader === 'workwell' || brandIdHeader === 'clever'
        ? brandIdHeader
        : brandIdFromHost(request.headers.get('host') ?? '');
    const brand = getBrandById(brandId);

    const token = await getSalesforceToken();

    // Forward the payload to the Apex REST endpoint. The form already shapes the
    // field names to match IR35OpinionController.IR35Request, so we pass through
    // and only stamp the resolved branding.
    const { website: _hp, ...payload } = body;
    void _hp;

    const sfRes = await fetch(sfApex('/IR35Opinion'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        branding: brand.salesforceLeadValue,
      }),
    });

    const sfData = await sfRes.json();

    if (!sfRes.ok || !sfData.success) {
      console.error('Salesforce IR35Opinion error:', sfData);
      return NextResponse.json(
        { error: sfData.error || 'Failed to submit your questionnaire' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, recordId: sfData.recordId });
  } catch (err) {
    console.error('/api/ir35-opinion error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
