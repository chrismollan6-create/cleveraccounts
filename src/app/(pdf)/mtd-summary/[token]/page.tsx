import { notFound } from 'next/navigation';
import MtdSummary from '@/components/mtd-summary/MtdSummary';
import {
  buildSampleData,
  type MtdBrandId,
  type MtdSummaryData,
} from '@/content/mtd-summary';

/**
 * MTD-summary render route — page that headless Chrome turns into a PDF
 * (see /api/mtd-summary/pdf).
 *
 * Two modes:
 *  • Real    — `?d=` carries a base64-encoded MtdSummaryData payload,
 *              supplied by the PDF route after the secret check.
 *  • Sample  — `?brand=` renders sample data for design review.
 *
 * The `[token]` path segment is cosmetic — data travels in the query.
 */
export const dynamic = 'force-dynamic';

const BRAND_IDS: MtdBrandId[] = ['clever', 'workwell'];

function isMtdSummary(v: unknown): v is MtdSummaryData {
  if (!v || typeof v !== 'object') return false;
  const d = v as Record<string, unknown>;
  return (
    d.kind === 'mtd' &&
    BRAND_IDS.includes(d.brandId as MtdBrandId) &&
    typeof d.brandName === 'string' &&
    typeof d.client === 'object' &&
    typeof d.period === 'object' &&
    typeof d.totals === 'object' &&
    Array.isArray(d.monthly)
  );
}

export default async function MtdSummaryDocument({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ brand?: string; d?: string }>;
}) {
  await params;
  const sp = await searchParams;

  if (sp.d) {
    let data: MtdSummaryData | null = null;
    try {
      const json = Buffer.from(decodeURIComponent(sp.d), 'base64').toString('utf8');
      const parsed: unknown = JSON.parse(json);
      if (isMtdSummary(parsed)) data = parsed;
    } catch {
      data = null;
    }
    if (!data) notFound();
    return <MtdSummary data={data} />;
  }

  const brand: MtdBrandId = BRAND_IDS.includes(sp.brand as MtdBrandId)
    ? (sp.brand as MtdBrandId)
    : 'clever';
  return <MtdSummary data={buildSampleData(brand)} />;
}
