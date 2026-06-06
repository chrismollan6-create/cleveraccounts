/**
 * Expenses guide — design preview.
 *
 *   /expenses-guide/preview?brand=clever&variant=ltd&clientType=PSC&sector=cis
 *
 * brand:      clever | workwell               (default clever)
 * variant:    ltd | sole                      (default ltd)
 * clientType: PSC | SME | (empty)             (default PSC for ltd)
 * sector:     cis | medical | creative | general (default general)
 */

import ExpensesGuide from '@/components/expenses-guide/ExpensesGuide';
import {
  buildSampleData,
  type ExpensesGuideBrandId,
  type ExpensesVariant,
  type ExpensesSector,
} from '@/content/expenses-guide';

export const dynamic = 'force-dynamic';

const BRANDS: ExpensesGuideBrandId[] = ['clever', 'workwell'];
const VARIANTS: ExpensesVariant[] = ['ltd', 'sole'];
const SECTORS: ExpensesSector[] = [
  'general', 'cis', 'medical', 'creative', 'transport', 'hospitality', 'retail', 'consulting',
];

const VARIANT_LABEL: Record<ExpensesVariant, string> = {
  ltd: 'Limited Company',
  sole: 'Sole Trader',
};
const SECTOR_LABEL: Record<ExpensesSector, string> = {
  general: 'General',
  cis: 'CIS / Construction',
  medical: 'Medical / Healthcare',
  creative: 'Creative / Tech',
  transport: 'Transport & Logistics',
  hospitality: 'Hospitality & Food',
  retail: 'Retail & E-commerce',
  consulting: 'Consulting',
};

export default async function ExpensesGuidePreview({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; variant?: string; clientType?: string; sector?: string; prior?: string }>;
}) {
  const sp = await searchParams;

  const brand: ExpensesGuideBrandId = BRANDS.includes(sp.brand as ExpensesGuideBrandId)
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

  const data = buildSampleData(brand, variant, clientType, sector, priorAccountant);

  const switchers: { label: string; href: string; active: boolean }[] = [];
  for (const b of BRANDS) {
    for (const v of VARIANTS) {
      for (const s of SECTORS) {
        for (const prior of [false, true]) {
          const ct = v === 'ltd' ? 'PSC' : '';
          switchers.push({
            label: `${b} · ${VARIANT_LABEL[v]}${ct ? ' · PSC' : ''} · ${SECTOR_LABEL[s]}${prior ? ' · Switcher' : ''}`,
            href: `?brand=${b}&variant=${v}&clientType=${ct}&sector=${s}${prior ? '&prior=1' : ''}`,
            active: b === brand && v === variant && s === sector && prior === priorAccountant,
          });
        }
      }
    }
  }

  return (
    <div style={{ background: '#e5e7eb', minHeight: '100vh', padding: '24px 0' }}>
      <div
        style={{
          maxWidth: '210mm',
          margin: '0 auto 20px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 12,
          color: '#334155',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          alignItems: 'center',
        }}
      >
        <strong style={{ marginRight: 4 }}>Preview:</strong>
        {switchers.map((sw) => (
          <a
            key={sw.href}
            href={sw.href}
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              textDecoration: 'none',
              background: sw.active ? '#1e293b' : '#fff',
              color: sw.active ? '#fff' : '#475569',
              border: '1px solid #cbd5e1',
              whiteSpace: 'nowrap',
            }}
          >
            {sw.label}
          </a>
        ))}
      </div>

      <div style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)', width: '210mm', margin: '0 auto' }}>
        <ExpensesGuide data={data} />
      </div>
    </div>
  );
}
