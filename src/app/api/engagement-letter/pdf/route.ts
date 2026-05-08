import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * GET /api/engagement-letter/pdf?t=TOKEN
 *
 * Fetches the signed engagement-letter PDF from Salesforce and streams it
 * back to the user as a downloadable file. The PDF lives on the
 * Engagement_Letter__c record as a ContentVersion attachment; Salesforce's
 * native download URL requires login, so this route proxies it through
 * with the server-side Connected App credentials.
 *
 * Returns 202 if the PDF hasn't been generated yet — the post-sign
 * queueable runs asynchronously so there's a ~30s window after signing
 * where the record is Signed but no PDF exists yet.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/EngagementLetter/pdf?t=${encodeURIComponent(token)}`), {
      headers: { Authorization: `Bearer ${sfToken}` },
      cache: 'no-store',
    });

    if (!sfRes.ok) {
      const data = await sfRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.error || 'Failed to load PDF' },
        { status: sfRes.status }
      );
    }

    const data = (await sfRes.json()) as {
      status: number;
      error?: string;
      filename?: string;
      contentType?: string;
      base64?: string;
    };

    if (data.status === 202) {
      return NextResponse.json(
        { error: data.error ?? 'PDF still generating — try again in a moment' },
        { status: 202 },
      );
    }

    if (data.status !== 200 || !data.base64) {
      return NextResponse.json(
        { error: data.error ?? 'PDF unavailable' },
        { status: data.status ?? 500 },
      );
    }

    // Decode base64 → Buffer → stream as file download
    const buffer = Buffer.from(data.base64, 'base64');
    const filename = data.filename ?? 'Engagement-Letter.pdf';

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': data.contentType ?? 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (err) {
    console.error('/api/engagement-letter/pdf error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
