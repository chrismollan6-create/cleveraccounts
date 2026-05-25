/**
 * Onboarding guide — design preview.
 *
 * Renders the guide with sample data so the design can be reviewed in a
 * browser before any Salesforce / PDF wiring exists (Phase 1).
 *
 *   /onboarding-guide/preview?brand=clever&variant=ltd-new
 *   /onboarding-guide/preview?brand=workwell&variant=sole
 *
 * brand:   clever | workwell            (default clever)
 * variant: ltd-new | ltd-existing | sole (default ltd-new)
 */

import OnboardingGuide from '@/components/onboarding-guide/OnboardingGuide';
import { buildSampleData, type GuideBrandId, type GuideVariant } from '@/content/onboarding-guide';

export const dynamic = 'force-dynamic';

const BRANDS: GuideBrandId[] = ['clever', 'workwell'];
const VARIANTS: GuideVariant[] = ['ltd-new', 'ltd-existing', 'sole'];

const VARIANT_LABEL: Record<GuideVariant, string> = {
  'ltd-new': 'Limited Company — new formation',
  'ltd-existing': 'Limited Company — existing',
  sole: 'Sole Trader',
};

export default async function OnboardingGuidePreview({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; variant?: string }>;
}) {
  const sp = await searchParams;
  const brand: GuideBrandId = BRANDS.includes(sp.brand as GuideBrandId)
    ? (sp.brand as GuideBrandId)
    : 'clever';
  const variant: GuideVariant = VARIANTS.includes(sp.variant as GuideVariant)
    ? (sp.variant as GuideVariant)
    : 'ltd-new';

  const data = buildSampleData(brand, variant);

  return (
    <div style={{ background: '#e5e7eb', minHeight: '100vh', padding: '24px 0' }}>
      {/* Preview-only switcher — not part of the PDF output. */}
      <div
        style={{
          maxWidth: '210mm',
          margin: '0 auto 20px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 13,
          color: '#334155',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <strong style={{ marginRight: 4 }}>Preview:</strong>
        {BRANDS.map((b) =>
          VARIANTS.map((v) => {
            const active = b === brand && v === variant;
            return (
              <a
                key={`${b}-${v}`}
                href={`?brand=${b}&variant=${v}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  background: active ? '#1e293b' : '#fff',
                  color: active ? '#fff' : '#475569',
                  border: '1px solid #cbd5e1',
                }}
              >
                {b} · {VARIANT_LABEL[v]}
              </a>
            );
          }),
        )}
      </div>

      {/* The document — A4 width, drop shadow to read as a page. */}
      <div style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)', width: '210mm', margin: '0 auto' }}>
        <OnboardingGuide data={data} />
      </div>
    </div>
  );
}
