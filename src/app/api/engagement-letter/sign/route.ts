import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/engagement-letter/sign?t=TOKEN
 * Submits a signature. Body shape matches EngagementLetterService.SignRequest:
 *   { fullName, signatureDataUrl?, typedName?, documentVersion, documentSha256,
 *     consentReadAndAccept, consentToEsign }
 *
 * IMPORTANT: IP and User-Agent are read from request headers server-side and
 * forwarded to Apex. Never trust the client's claimed IP/UA from the body.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const ip = extractClientIp(request);
    const ua = request.headers.get('user-agent') || 'unknown';

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/EngagementLetter/sign?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip,
        'X-Original-User-Agent': ua,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await sfRes.json();

    if (!sfRes.ok) {
      return NextResponse.json(data, { status: sfRes.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/engagement-letter/sign error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

function extractClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
