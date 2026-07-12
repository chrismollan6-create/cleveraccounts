import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { extractClientIp } from '../shared';

/**
 * POST /api/sign/challenge?t=TOKEN
 * Body: { answer } — postcode or ISO date of birth.
 * On success Salesforce issues the session key that unlocks the PDF + sign
 * endpoints. IP/UA captured server-side for the audit log.
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

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/SignatureRequest/challenge?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': extractClientIp(request),
        'X-Original-User-Agent': request.headers.get('user-agent') || 'unknown',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.status });
  } catch (err) {
    console.error('/api/sign/challenge error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
