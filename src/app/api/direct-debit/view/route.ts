import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

/**
 * POST /api/direct-debit/view?t=TOKEN
 * Records that the payer opened the link. That timestamp is what tells staff
 * the difference between "they haven't looked at it, chase them" and "they're
 * part-way through, leave them be".
 *
 * Best-effort: a failure here must never block the page from rendering.
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
    await fetch(sfApex(`/DDRequest/view?t=${encodeURIComponent(token)}`), {
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('/api/direct-debit/view error:', err);
    // Still 200 — tracking a view is not worth failing the page over.
    return NextResponse.json({ ok: false });
  }
}

function extractClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
