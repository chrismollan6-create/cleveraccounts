import { notFound } from 'next/navigation';
import VatGuide from '@/components/vat-guide/VatGuide';
import {
  buildSampleData,
  type VatGuideBrandId,
  type VatGuideData,
  type VatScheme,
  type VatSector,
  type VatVariant,
} from '@/content/vat-guide';

/**
 * VAT guide render route — the page headless Chrome turns into a PDF
 * (see /api/vat-guide/pdf). Deliberately bare: just the document.
 *
 * Two modes:
 *  • Real    — `?d=` carries a base64-encoded VatGuideData payload.
 *  • Sample  — `?brand=&variant=&scheme=&sector=&new=` render sample data.
 *
 * The `[token]` path segment is cosmetic — data travels in the query string.
 */
export const dynamic = 'force-dynamic';

const BRAND_IDS: VatGuideBrandId[] = ['clever', 'workwell'];
const VARIANTS: VatVariant[] = ['ltd', 'sole'];
const SCHEMES: VatScheme[] = ['standard', 'flat-rate'];
const SECTORS: VatSector[] = [
  'cis',
  'medical',
  'creative',
  'transport',
  'hospitality',
  'retail',
  'consulting',
  'property',
  'beauty',
  'general',
];

function isGuideData(v: unknown): v is VatGuideData {
  if (!v || typeof v !== 'object') return false;
  const d = v as Record<string, unknown>;
  return (
    BRAND_IDS.includes(d.brandId as VatGuideBrandId) &&
    VARIANTS.includes(d.variant as VatVariant) &&
    SCHEMES.includes(d.scheme as VatScheme) &&
    typeof d.clientFirstName === 'string' &&
    typeof d.companyName === 'string' &&
    typeof d.brandName === 'string' &&
    typeof d.accountant === 'object' &&
    typeof d.support === 'object'
  );
}

export default async function VatGuideDocument({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{
    brand?: string;
    variant?: string;
    scheme?: string;
    sector?: string;
    new?: string;
    d?: string;
  }>;
}) {
  await params;
  const sp = await searchParams;

  if (sp.d) {
    let data: VatGuideData | null = null;
    try {
      const json = Buffer.from(decodeURIComponent(sp.d), 'base64').toString('utf8');
      const parsed: unknown = JSON.parse(json);
      if (isGuideData(parsed)) data = parsed;
    } catch {
      data = null;
    }
    if (!data) notFound();
    return <VatGuide data={data} />;
  }

  const brand: VatGuideBrandId = BRAND_IDS.includes(sp.brand as VatGuideBrandId)
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
  // Newly-registered is the default; `?new=0` renders the existing-client edition.
  const newlyRegistered = sp.new !== '0';

  return <VatGuide data={buildSampleData(brand, variant, scheme, sector, newlyRegistered)} />;
}
