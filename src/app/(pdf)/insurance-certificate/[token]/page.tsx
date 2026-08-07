import { notFound } from 'next/navigation';
import InsuranceCertificate from '@/components/insurance/InsuranceCertificate';
import { buildSampleCert, isInsuranceCert, type InsuranceCertData } from '@/content/insurance-certificate';

/**
 * Insurance Verification Certificate render route — the page headless Chrome
 * turns into a PDF (see /api/insurance-certificate/pdf).
 *
 *  • Real   — `?d=` carries a base64-encoded InsuranceCertData payload,
 *             supplied by the PDF route after the secret check.
 *  • Sample — no `?d=` renders sample data for design review.
 *
 * The `[token]` path segment is cosmetic — data travels in the query.
 */
export const dynamic = 'force-dynamic';

export default async function InsuranceCertificateDocument({
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ d?: string }>;
}) {
  const sp = await searchParams;

  if (sp.d) {
    let data: InsuranceCertData | null = null;
    try {
      const json = Buffer.from(decodeURIComponent(sp.d), 'base64').toString('utf8');
      const parsed: unknown = JSON.parse(json);
      if (isInsuranceCert(parsed)) data = parsed;
    } catch {
      data = null;
    }
    if (!data) notFound();
    return <InsuranceCertificate data={data} />;
  }

  return <InsuranceCertificate data={buildSampleCert()} />;
}
