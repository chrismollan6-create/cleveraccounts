/**
 * MTD summary — design preview.
 *
 *   /mtd-summary/preview?brand=clever
 *   /mtd-summary/preview?brand=workwell
 */

import MtdSummary from '@/components/mtd-summary/MtdSummary';
import { buildSampleData, type MtdBrandId } from '@/content/mtd-summary';

export const dynamic = 'force-dynamic';

const BRANDS: MtdBrandId[] = ['clever', 'workwell'];

export default async function MtdSummaryPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const sp = await searchParams;
  const brand: MtdBrandId = BRANDS.includes(sp.brand as MtdBrandId)
    ? (sp.brand as MtdBrandId)
    : 'clever';
  return <MtdSummary data={buildSampleData(brand)} />;
}
