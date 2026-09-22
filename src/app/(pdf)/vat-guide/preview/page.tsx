/**
 * VAT guide — design preview.
 *
 *   /vat-guide/preview?brand=clever&variant=ltd&scheme=flat-rate&sector=cis&new=1
 *
 * brand:   clever | workwell              (default clever)
 * variant: ltd | sole                     (default ltd)
 * scheme:  standard | flat-rate           (default standard)
 * sector:  cis | medical | creative | …   (default general)
 * new:     1 | 0                          (default 1 — just-registered edition)
 *
 * The axes are switched independently rather than as one long list of every
 * combination: 2 × 2 × 2 × 10 × 2 is 160 permutations, which is a menu nobody
 * can read.
 */

import VatGuide from '@/components/vat-guide/VatGuide';
import {
  buildSampleData,
  type VatGuideBrandId,
  type VatScheme,
  type VatSector,
  type VatVariant,
} from '@/content/vat-guide';

export const dynamic = 'force-dynamic';

const BRANDS: VatGuideBrandId[] = ['clever', 'workwell'];
const VARIANTS: VatVariant[] = ['ltd', 'sole'];
const SCHEMES: VatScheme[] = ['standard', 'flat-rate'];
const SECTORS: VatSector[] = [
  'general',
  'cis',
  'medical',
  'creative',
  'transport',
  'hospitality',
  'retail',
  'consulting',
  'property',
  'beauty',
];

const BRAND_LABEL: Record<VatGuideBrandId, string> = {
  clever: 'Clever',
  workwell: 'Workwell',
};
const VARIANT_LABEL: Record<VatVariant, string> = {
  ltd: 'Limited Company',
  sole: 'Sole Trader',
};
const SCHEME_LABEL: Record<VatScheme, string> = {
  standard: 'Standard rated',
  'flat-rate': 'Flat Rate Scheme',
};
const SECTOR_LABEL: Record<VatSector, string> = {
  general: 'General',
  cis: 'CIS / Construction',
  medical: 'Medical / Healthcare',
  creative: 'Creative / Tech',
  transport: 'Transport & Logistics',
  hospitality: 'Hospitality & Food',
  retail: 'Retail & E-commerce',
  consulting: 'Consulting',
  property: 'Property & Landlords',
  beauty: 'Hair, Beauty & Personal Care',
};

function Row({
  label,
  options,
}: {
  label: string;
  options: { label: string; href: string; active: boolean }[];
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      <strong style={{ minWidth: 62, fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>
        {label}
      </strong>
      {options.map((o) => (
        <a
          key={o.href}
          href={o.href}
          style={{
            padding: '3px 9px',
            borderRadius: 6,
            textDecoration: 'none',
            background: o.active ? '#1e293b' : '#fff',
            color: o.active ? '#fff' : '#475569',
            border: '1px solid #cbd5e1',
            whiteSpace: 'nowrap',
          }}
        >
          {o.label}
        </a>
      ))}
    </div>
  );
}

export default async function VatGuidePreview({
  searchParams,
}: {
  searchParams: Promise<{
    brand?: string;
    variant?: string;
    scheme?: string;
    sector?: string;
    new?: string;
  }>;
}) {
  const sp = await searchParams;

  const brand: VatGuideBrandId = BRANDS.includes(sp.brand as VatGuideBrandId)
    ? (sp.brand as VatGuideBrandId)
    : 'clever';
  const variant: VatVariant = VARIANTS.includes(sp.variant as VatVariant)
    ? (sp.variant as VatVariant)
    : 'ltd';
  const scheme: VatScheme = SCHEMES.includes(sp.scheme as VatScheme)
    ? (sp.scheme as VatScheme)
    : 'standard';
  const sector: VatSector = SECTORS.includes(sp.sector as VatSector)
    ? (sp.sector as VatSector)
    : 'general';
  const newlyRegistered = sp.new !== '0';

  const data = buildSampleData(brand, variant, scheme, sector, newlyRegistered);

  /** Build a link that keeps every axis except the one being changed. */
  const href = (patch: Record<string, string>) => {
    const q = new URLSearchParams({
      brand,
      variant,
      scheme,
      sector,
      new: newlyRegistered ? '1' : '0',
      ...patch,
    });
    return `?${q.toString()}`;
  };

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
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <Row
          label="Brand"
          options={BRANDS.map((b) => ({
            label: BRAND_LABEL[b],
            href: href({ brand: b }),
            active: b === brand,
          }))}
        />
        <Row
          label="Trades as"
          options={VARIANTS.map((v) => ({
            label: VARIANT_LABEL[v],
            href: href({ variant: v }),
            active: v === variant,
          }))}
        />
        <Row
          label="Scheme"
          options={SCHEMES.map((s) => ({
            label: SCHEME_LABEL[s],
            href: href({ scheme: s }),
            active: s === scheme,
          }))}
        />
        <Row
          label="Edition"
          options={[
            { label: 'Just registered', href: href({ new: '1' }), active: newlyRegistered },
            { label: 'Existing VAT client', href: href({ new: '0' }), active: !newlyRegistered },
          ]}
        />
        <Row
          label="Sector"
          options={SECTORS.map((s) => ({
            label: SECTOR_LABEL[s],
            href: href({ sector: s }),
            active: s === sector,
          }))}
        />
      </div>

      <div style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)', width: '210mm', margin: '0 auto' }}>
        <VatGuide data={data} />
      </div>
    </div>
  );
}
