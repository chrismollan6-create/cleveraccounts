import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { extractClientIp } from '../../shared';

/** POST /api/sign/otp/resend?t=TOKEN — regenerate + resend the one-time code. */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/SignatureRequest/otp-resend?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': extractClientIp(request),
        'X-Original-User-Agent': request.headers.get('user-agent') || 'unknown',
      },
      body: '{}',
      cache: 'no-store',
    });
    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.status });
  } catch (err) {
    console.error('/api/sign/otp/resend error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
