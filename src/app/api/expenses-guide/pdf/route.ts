import type { NextRequest } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { renderUrlToPdf } from '@/lib/onboarding-guide-pdf';

/**
 * /api/expenses-guide/pdf — renders the expenses guide to a PDF via
 * headless Chrome.
 *
 *  • POST — real client data. JSON body = ExpensesGuideData. Requires the
 *           `x-expenses-secret` header (shared secret with Salesforce).
 *  • GET  — two modes:
 *      – Client link: ?d=<base64 ExpensesGuideData>&sig=<HMAC-SHA256 hex of d>
 *        The signature (keyed on EXPENSES_PDF_SECRET) lets Salesforce mint
 *        public, tamper-proof links for the expenses-guide email without
 *        exposing the secret or opening PDF generation to arbitrary callers.
 *        Rendered inline so it opens in the browser.
 *      – Sample mode (design testing): ?brand=&variant=&clientType=&sector=
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function encodeData(data: unknown): string {
  return encodeURIComponent(Buffer.from(JSON.stringify(data)).toString('base64'));
}

/** Constant-time compare of the provided signature against HMAC-SHA256(d). */
function validSignature(d: string, sig: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(d).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function pdfResponse(
  origin: string,
  query: string,
  disposition: 'inline' | 'attachment' = 'attachment',
): Promise<Response> {
  const pdf = await renderUrlToPdf(`${origin}/expenses-guide/doc?${query}`);
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="expenses-guide.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

function failed(err: unknown): Response {
  console.error('expenses-guide PDF render failed:', err);
  const msg = err instanceof Error ? err.message : 'unknown error';
  return new Response(`PDF generation failed: ${msg}`, { status: 500 });
}

export async function POST(request: NextRequest) {
  const secret = process.env.EXPENSES_PDF_SECRET;
  if (!secret || request.headers.get('x-expenses-secret') !== secret) {
    return new Response('Unauthorized', { status: 401 });
  }
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }
  try {
    return await pdfResponse(new URL(request.url).origin, `d=${encodeData(data)}`);
  } catch (err) {
    return failed(err);
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  // Client-link mode: signed real payload → render the client's own guide.
  const d = url.searchParams.get('d');
  if (d) {
    const secret = process.env.EXPENSES_PDF_SECRET;
    const sig = url.searchParams.get('sig') ?? '';
    if (!secret || !validSignature(d, sig, secret)) {
      return new Response('Unauthorized', { status: 401 });
    }
    try {
      return await pdfResponse(url.origin, `d=${encodeURIComponent(d)}`, 'inline');
    } catch (err) {
      return failed(err);
    }
  }

  // Sample mode — design testing only.
  const brand = url.searchParams.get('brand') ?? 'clever';
  const variant = url.searchParams.get('variant') ?? 'ltd';
  const clientType = url.searchParams.get('clientType') ?? 'PSC';
  const sector = url.searchParams.get('sector') ?? 'general';
  try {
    return await pdfResponse(
      url.origin,
      `brand=${encodeURIComponent(brand)}&variant=${encodeURIComponent(variant)}&clientType=${encodeURIComponent(clientType)}&sector=${encodeURIComponent(sector)}`,
    );
  } catch (err) {
    return failed(err);
  }
}
