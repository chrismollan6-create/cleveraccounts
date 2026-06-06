import { notFound } from 'next/navigation';
import ExpensesGuide from '@/components/expenses-guide/ExpensesGuide';
import {
  buildSampleData,
  type ExpensesGuideBrandId,
  type ExpensesVariant,
  type ExpensesSector,
  type ExpensesGuideData,
} from '@/content/expenses-guide';

/**
 * Expenses guide render route — the page headless Chrome turns into a PDF
 * (see /api/expenses-guide/pdf). Deliberately bare: just the document.
 *
 * Two modes:
 *  • Real    — `?d=` carries a base64-encoded ExpensesGuideData payload.
 *  • Sample  — `?brand=&variant=&clientType=&sector=` render sample data.
 *
 * The `[token]` path segment is cosmetic — data travels in the query string.
 */
export const dynamic = 'force-dynamic';

const BRAND_IDS: ExpensesGuideBrandId[] = ['clever', 'workwell'];
const VARIANTS: ExpensesVariant[] = ['ltd', 'sole'];
const SECTORS: ExpensesSector[] = [
  'cis', 'medical', 'creative', 'transport', 'hospitality', 'retail', 'consulting', 'general',
];

function isGuideData(v: unknown): v is ExpensesGuideData {
  if (!v || typeof v !== 'object') return false;
  const d = v as Record<string, unknown>;
  return (
    BRAND_IDS.includes(d.brandId as ExpensesGuideBrandId) &&
    VARIANTS.includes(d.variant as ExpensesVariant) &&
    typeof d.clientFirstName === 'string' &&
    typeof d.companyName === 'string' &&
    typeof d.brandName === 'string' &&
    typeof d.accountant === 'object' &&
    typeof d.support === 'object'
  );
}

export default async function ExpensesGuideDocument({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ brand?: string; variant?: string; clientType?: string; sector?: string; prior?: string; d?: string }>;
}) {
  await params;
  const sp = await searchParams;

  if (sp.d) {
    let data: ExpensesGuideData | null = null;
    try {
      const json = Buffer.from(decodeURIComponent(sp.d), 'base64').toString('utf8');
      const parsed: unknown = JSON.parse(json);
      if (isGuideData(parsed)) data = parsed;
    } catch {
      data = null;
    }
    if (!data) notFound();
    return <ExpensesGuide data={data} />;
  }

  const brand: ExpensesGuideBrandId = BRAND_IDS.includes(sp.brand as ExpensesGuideBrandId)
    ? (sp.brand as ExpensesGuideBrandId)
    : 'clever';
  const variant: ExpensesVariant = VARIANTS.includes(sp.variant as ExpensesVariant)
    ? (sp.variant as ExpensesVariant)
    : 'ltd';
  const sector: ExpensesSector = SECTORS.includes(sp.sector as ExpensesSector)
    ? (sp.sector as ExpensesSector)
    : 'general';
  const clientType = sp.clientType ?? (variant === 'ltd' ? 'PSC' : undefined);
  const priorAccountant = sp.prior === '1';

  return <ExpensesGuide data={buildSampleData(brand, variant, clientType, sector, priorAccountant)} />;
}
