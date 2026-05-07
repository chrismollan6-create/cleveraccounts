import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/** POST /api/signup/submit?t=TOKEN — final form submission */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const body = await request.text();
    const sfToken = await getSalesforceToken();

    const sfRes = await fetch(sfApex(`/SignupForm/submit?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sfToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    const rawBody = await sfRes.text();
    let data: { error?: string; success?: boolean; message?: string } = {};
    try { data = JSON.parse(rawBody); } catch { /* non-JSON response — log it */ }

    if (!sfRes.ok) {
      // Log full upstream context server-side for debugging
      console.error('[/api/signup/submit] Salesforce non-OK', {
        status: sfRes.status,
        body: rawBody.slice(0, 500),
      });
      // Surface the actual upstream message (or a snippet of the body) to the client
      // rather than a generic "Failed to submit form" — Apex AuraHandledException
      // sometimes mangles getMessage() to "Script-thrown exception", in which case
      // we want to show the user something more actionable.
      const upstream = data.error && data.error !== 'Script-thrown exception'
        ? data.error
        : rawBody.slice(0, 200) || `Salesforce returned ${sfRes.status}`;
      return NextResponse.json({ error: upstream }, { status: sfRes.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('/api/signup/submit error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
