import type { NextRequest } from 'next/server';
import { renderUrlToPdf } from '@/lib/onboarding-guide-pdf';

/**
 * /api/mtd-summary/pdf — renders the MTD client-summary one-pager to PDF
 * via headless Chrome.
 *
 *  • POST — real client data. JSON body = MtdSummaryData. Requires the
 *           `x-mtd-pdf-secret` header (shared secret with Salesforce).
 *           Used by MtdSummaryPdfService.fetchSummaryPdf().
 *  • GET  — sample mode for design review: ?brand=clever|workwell (no auth).
 *
 * Reuses the existing headless-Chrome helper from the onboarding-guide route
 * — same chromium config, same A4 output, just a different document URL.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function encodeData(data: unknown): string {
  return encodeURIComponent(Buffer.from(JSON.stringify(data)).toString('base64'));
}

async function pdfResponse(origin: string, query: string): Promise<Response> {
  const pdf = await renderUrlToPdf(`${origin}/mtd-summary/doc?${query}`);
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="mtd-summary.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}

function failed(err: unknown): Response {
  console.error('mtd-summary PDF render failed:', err);
  const msg = err instanceof Error ? err.message : 'unknown error';
  return new Response(`PDF generation failed: ${msg}`, { status: 500 });
}

export async function POST(request: NextRequest) {
  const secret = process.env.MTD_PDF_SECRET;
  if (!secret || request.headers.get('x-mtd-pdf-secret') !== secret) {
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
  try {
    return await pdfResponse(url.origin, `brand=${encodeURIComponent(brand)}`);
  } catch (err) {
    return failed(err);
  }
}
