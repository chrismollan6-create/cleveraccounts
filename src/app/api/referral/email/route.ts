import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, friendName, friendEmail } = body;

    if (!referralCode || !friendEmail) {
      return NextResponse.json(
        { error: 'referralCode and friendEmail are required' },
        { status: 400 }
      );
    }

    const token = await getSalesforceToken();

    const sfRes = await fetch(sfApex('/Referral/email'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referralCode, friendName, friendEmail }),
    });

    const data = await sfRes.json();

    return NextResponse.json(data, { status: sfRes.status });
  } catch (err) {
    console.error('/api/referral/email error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
