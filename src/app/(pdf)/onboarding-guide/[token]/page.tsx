import { notFound } from 'next/navigation';
import OnboardingGuide from '@/components/onboarding-guide/OnboardingGuide';
import {
  buildSampleData,
  type GuideBrandId,
  type GuideVariant,
  type OnboardingGuideData,
} from '@/content/onboarding-guide';

/**
 * Onboarding guide render route — the page headless Chrome turns into a PDF
 * (see /api/onboarding-guide/pdf). Deliberately bare: just the document.
 *
 * Two modes:
 *  • Real    — `?d=` carries a base64-encoded OnboardingGuideData payload,
 *              supplied by the PDF route (which received it from Salesforce).
 *  • Sample  — `?brand=` & `?variant=` render sample data for design review.
 *
 * The `[token]` path segment is cosmetic — data travels in the query, not the
 * path — so the PDF route can use a fixed path like /onboarding-guide/doc.
 */
export const dynamic = 'force-dynamic';

const BRAND_IDS: GuideBrandId[] = ['clever', 'workwell'];
const VARIANTS: GuideVariant[] = ['ltd-new', 'ltd-existing', 'sole'];

/** Light runtime check that a decoded payload is a usable guide data object. */
function isGuideData(v: unknown): v is OnboardingGuideData {
  if (!v || typeof v !== 'object') return false;
  const d = v as Record<string, unknown>;
  return (
    BRAND_IDS.includes(d.brandId as GuideBrandId) &&
    VARIANTS.includes(d.variant as GuideVariant) &&
    typeof d.clientFirstName === 'string' &&
    typeof d.companyName === 'string' &&
    typeof d.brandName === 'string' &&
    typeof d.accountant === 'object' &&
    typeof d.dates === 'object' &&
    typeof d.support === 'object'
  );
}

export default async function OnboardingGuideDocument({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ brand?: string; variant?: string; d?: string }>;
}) {
  await params; // path segment is cosmetic
  const sp = await searchParams;

  // ── Real mode — base64 OnboardingGuideData from the PDF route ──
  if (sp.d) {
    let data: OnboardingGuideData | null = null;
    try {
      const json = Buffer.from(decodeURIComponent(sp.d), 'base64').toString('utf8');
      const parsed: unknown = JSON.parse(json);
      if (isGuideData(parsed)) data = parsed;
    } catch {
      data = null;
    }
    if (!data) notFound();
    return <OnboardingGuide data={data} />;
  }

  // ── Sample mode — design preview / testing ──
  const brand: GuideBrandId = BRAND_IDS.includes(sp.brand as GuideBrandId)
    ? (sp.brand as GuideBrandId)
    : 'clever';
  const variant: GuideVariant = VARIANTS.includes(sp.variant as GuideVariant)
    ? (sp.variant as GuideVariant)
    : 'ltd-new';
  return <OnboardingGuide data={buildSampleData(brand, variant)} />;
}
