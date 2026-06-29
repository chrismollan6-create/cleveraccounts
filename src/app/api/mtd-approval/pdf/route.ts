import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * GET /api/mtd-approval/pdf?t=TOKEN
 * Streams the stored MTD summary PDF for embedding on the approve page.
 * Proxies Apex MTDApprovalRestService GET /MTDApproval/pdf, which returns
 * { available, base64, filename }. 404 if no summary is attached yet.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/MTDApproval/pdf?t=${encodeURIComponent(token)}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
      cache: 'no-store',
    });

    if (!sfRes.ok) {
      return NextResponse.json({ error: 'Could not load summary' }, { status: sfRes.status });
    }

    const data = await sfRes.json();
    if (!data?.available || !data?.base64) {
      return NextResponse.json({ error: 'Summary not available yet' }, { status: 404 });
    }

    const bytes = Buffer.from(data.base64, 'base64');
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${data.filename || 'MTD-Summary.pdf'}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('/api/mtd-approval/pdf error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
