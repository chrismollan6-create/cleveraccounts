import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

export async function GET(request: NextRequest) {
  try {
    const ref = request.nextUrl.searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    const token = await getSalesforceToken();

    const sfRes = await fetch(sfApex(`/Referral?ref=${encodeURIComponent(ref)}`), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await sfRes.json();

    return NextResponse.json(data, { status: sfRes.status });
  } catch (err) {
    console.error('/api/referral error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
