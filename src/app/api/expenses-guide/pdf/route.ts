import type { NextRequest } from 'next/server';
import { renderUrlToPdf } from '@/lib/onboarding-guide-pdf';

/**
 * /api/expenses-guide/pdf — renders the expenses guide to a PDF via
 * headless Chrome.
 *
 *  • POST — real client data. JSON body = ExpensesGuideData. Requires the
 *           `x-expenses-secret` header (shared secret with Salesforce).
 *  • GET  — sample mode for design testing:
 *           ?brand=clever|workwell &variant=ltd|sole &clientType=PSC &sector=cis|medical|creative|general
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function encodeData(data: unknown): string {
  return encodeURIComponent(Buffer.from(JSON.stringify(data)).toString('base64'));
}

async function pdfResponse(origin: string, query: string): Promise<Response> {
  const pdf = await renderUrlToPdf(`${origin}/expenses-guide/doc?${query}`);
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="expenses-guide.pdf"',
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
