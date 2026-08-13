import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/direct-debit/submit?t=TOKEN
 * Body: { accountHolder, sortCode, accountNumber, confirmAuthority }
 *
 * IMPORTANT: IP and User-Agent are read from headers server-side and forwarded
 * to Apex, never taken from the body. They are the evidence that this payer
 * authorised the mandate, so they must not be forgeable by the submitter.
 *
 * The bank details themselves are passed straight through and never logged —
 * they exist in this process for the duration of one request and are stored
 * nowhere but DDCMS.
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
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const ip = extractClientIp(request);
    const ua = request.headers.get('user-agent') || 'unknown';

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/DDRequest/submit?t=${encodeURIComponent(token)}`), {
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
      // Apex writes these messages for the payer to read, so pass them through.
      return NextResponse.json(
        { error: data.error || 'We could not set up your Direct Debit.' },
        { status: sfRes.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    // Deliberately does not log the body.
    console.error('/api/direct-debit/submit error:', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

function extractClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
