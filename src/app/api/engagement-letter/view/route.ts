import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/engagement-letter/view?t=TOKEN
 * Logs a view event — Apex sets First_Viewed_DateTime on the FIRST call only.
 *
 * IP and User-Agent are forwarded server-side so they can't be spoofed by the
 * client. Apex reads these from the X-Forwarded-For + X-Original-User-Agent
 * headers (the regular User-Agent gets overwritten by Salesforce's HTTP layer).
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const ip = extractClientIp(request);
    const ua = request.headers.get('user-agent') || 'unknown';

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/EngagementLetter/view?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip,
        'X-Original-User-Agent': ua,
      },
      body: '{}',
      cache: 'no-store',
    });

    const data = await sfRes.json();
    if (!sfRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to log view' },
        { status: sfRes.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/engagement-letter/view error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

/**
 * Extract the originating client IP. Production sits behind Netlify which sets
 * x-forwarded-for; we want the FIRST entry (= the real client) since the chain
 * may be `client, proxy1, proxy2`.
 */
function extractClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
