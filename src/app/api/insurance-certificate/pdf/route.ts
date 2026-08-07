import type { NextRequest } from 'next/server';
import { renderUrlToPdf } from '@/lib/onboarding-guide-pdf';
import { isInsuranceCert } from '@/content/insurance-certificate';

/**
 * /api/insurance-certificate/pdf — renders the insurance Verification Certificate
 * to PDF via headless Chrome.
 *
 *  • POST — real client data. JSON body = InsuranceCertData. Requires the
 *           `x-insurance-cert-secret` header (shared secret with Salesforce).
 *           Called by InsuranceCertificatePdfService.
 *  • GET  — sample mode for design review (no auth).
 *
 * Mirrors /api/mtd-summary/pdf — same headless-Chrome helper, A4 output.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function encodeData(data: unknown): string {
  return encodeURIComponent(Buffer.from(JSON.stringify(data)).toString('base64'));
}

async function pdfResponse(origin: string, query: string): Promise<Response> {
  const pdf = await renderUrlToPdf(`${origin}/insurance-certificate/doc?${query}`);
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="insurance-certificate.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}

function failed(err: unknown): Response {
  console.error('insurance-certificate PDF render failed:', err);
  const msg = err instanceof Error ? err.message : 'unknown error';
  return new Response(`PDF generation failed: ${msg}`, { status: 500 });
}

export async function POST(request: NextRequest) {
  const secret = process.env.INSURANCE_CERT_SECRET;
  if (!secret || request.headers.get('x-insurance-cert-secret') !== secret) {
    return new Response('Unauthorized', { status: 401 });
  }
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }
  if (!isInsuranceCert(data)) {
    return new Response('Invalid certificate payload', { status: 400 });
  }
  try {
    return await pdfResponse(new URL(request.url).origin, `d=${encodeData(data)}`);
  } catch (err) {
    return failed(err);
  }
}

export async function GET(request: NextRequest) {
  try {
    return await pdfResponse(new URL(request.url).origin, '');
  } catch (err) {
    return failed(err);
  }
}
