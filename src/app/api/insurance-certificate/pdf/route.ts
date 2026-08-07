import type { NextRequest } from 'next/server';
import { renderUrlToPdf } from '@/lib/onboarding-guide-pdf';
import { isInsuranceCert, buildCertFromClient } from '@/content/insurance-certificate';
import { getSalesforceToken, sfApex } from '@/lib/salesforce';

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
  const url = new URL(request.url);
  const sof = url.searchParams.get('sof');
  try {
    // Client download: fetch this client's cert data from Salesforce by SOF token.
    if (sof) {
      const sfToken = await getSalesforceToken();
      const res = await fetch(sfApex(`/InsuranceSOF?t=${encodeURIComponent(sof)}`), {
        headers: { Authorization: `Bearer ${sfToken}` },
        cache: 'no-store',
      });
      const data = (await res.json().catch(() => null)) as
        | { companyName?: string; startDate?: string; suitability?: string }
        | null;
      if (!res.ok || !data?.companyName || !data?.startDate) {
        return new Response('Certificate not available', { status: 404 });
      }
      const cert = buildCertFromClient(data.companyName, data.startDate);
      return await pdfResponse(url.origin, `d=${encodeData(cert)}`);
    }
    // Sample mode for design review.
    return await pdfResponse(url.origin, '');
  } catch (err) {
    return failed(err);
  }
}
