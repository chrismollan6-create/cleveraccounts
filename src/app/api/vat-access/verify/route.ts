import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';
import { vatCookieName } from '@/lib/vat-access';

/**
 * POST /api/vat-access/verify?t=TOKEN
 * Body: { code } — the 6-digit code from the email.
 * On success Salesforce returns a session signed for this link. It goes into an httpOnly cookie
 * for as long as Salesforce says it lasts (7 days) and is never handed to the page's JavaScript.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    let code: unknown = null;
    try {
      code = ((await request.json()) as { code?: unknown })?.code ?? null;
    } catch {
      // no body
    }

    const sfToken = await getSalesforceToken();
    const sfRes = await fetch(sfApex(`/VATAccess/verify?t=${encodeURIComponent(token)}`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${sfToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: typeof code === 'string' ? code : null }),
      cache: 'no-store',
    });
    const data = (await sfRes.json()) as {
      success?: boolean;
      session?: string;
      expiresAt?: number;
      error?: string;
    };

    if (!sfRes.ok || !data.success || !data.session) {
      return NextResponse.json({ success: false, error: data.error ?? 'That code isn’t right.' }, {
        status: sfRes.ok ? 200 : sfRes.status,
      });
    }

    const maxAge = Math.max(60, Math.floor((data.expiresAt ?? 0) - Date.now() / 1000));
    const res = NextResponse.json({ success: true });
    res.cookies.set(vatCookieName(token), data.session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
    return res;
  } catch (err) {
    console.error('/api/vat-access/verify error:', err);
    return NextResponse.json({ error: 'Something went wrong checking your code. Please try again.' }, { status: 500 });
  }
}
