import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * GET /api/sign/pdf?t=TOKEN&k=SESSION_KEY[&signed=1]
 * Streams the document PDF (or the sealed signed PDF with signed=1).
 * Salesforce refuses without a valid session key from the identity check, so
 * a bare forwarded link can never reach the document contents.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    const key = request.nextUrl.searchParams.get('k');
    const signed = request.nextUrl.searchParams.get('signed');
    if (!token || !key) {
      return NextResponse.json({ error: 'Token and session key required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const qs = `t=${encodeURIComponent(token)}&k=${encodeURIComponent(key)}${signed === '1' ? '&signed=1' : ''}`;
    const sfRes = await fetch(sfApex(`/SignatureRequest/pdf?${qs}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
      cache: 'no-store',
    });

    if (!sfRes.ok) {
      let message = 'Could not load the document.';
      try {
        const err = await sfRes.json();
        if (err?.error) message = err.error;
      } catch {
        /* non-JSON error body */
      }
      return NextResponse.json({ error: message }, { status: sfRes.status });
    }

    const bytes = await sfRes.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': sfRes.headers.get('Content-Disposition') || 'inline; filename="document.pdf"',
        'Cache-Control': 'no-store, private',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (err) {
    console.error('/api/sign/pdf error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
