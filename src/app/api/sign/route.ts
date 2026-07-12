import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * GET /api/sign?t=TOKEN
 * Proxy for the signature-request metadata (no document content — the PDF is
 * only served post-identity-check via /api/sign/pdf).
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }
    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/SignatureRequest?t=${encodeURIComponent(token)}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
      cache: 'no-store',
    });
    const data = await sfRes.json();
    return NextResponse.json(data, { status: sfRes.status });
  } catch (err) {
    console.error('/api/sign error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
