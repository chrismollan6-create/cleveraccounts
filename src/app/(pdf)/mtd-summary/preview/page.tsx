/**
 * MTD summary — design preview.
 *
 *   /mtd-summary/preview?brand=clever
 *   /mtd-summary/preview?brand=workwell
 *
 * Wraps the document in a grey page-frame so it visually reads as a PDF
 * sheet in the browser. The actual PDF render route ([token]/page.tsx)
 * doesn't use this wrapper — it returns the clean white page so headless
 * Chrome captures exactly what prints.
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
  return (
    <div
      style={{
        background: '#e5e7eb',
        minHeight: '100vh',
        padding: '24px 0',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.08), 0 25px 50px -12px rgba(0,0,0,0.20)',
          background: '#ffffff',
        }}
      >
        <MtdSummary data={buildSampleData(brand)} />
      </div>
    </div>
  );
}
