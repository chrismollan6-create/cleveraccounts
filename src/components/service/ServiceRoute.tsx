import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { getServicePage } from "@/sanity/queries";
import { servicePages, type ServicePageData } from "@/lib/service-page-data";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import WorkwellServicePage, { type ServiceContent } from "@/app/(site)/WorkwellServicePage";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

/**
 * Brand-aware service/audience page rendering.
 *
 * - Clever → the existing hardcoded ServicePageTemplate (unchanged).
 * - Workwell → WorkwellServicePage, with COPY from the brand-scoped
 *   `servicePage` Sanity doc (slug + brand=workwell), falling back to the
 *   legacy hardcoded content (de-Clevered) so the page looks right before
 *   it's authored in Studio.
 *
 * Simple pages use the default `ServiceRoute` (handles both brands). Pages
 * with extra Clever-only behaviour (promo badge, embedded calculator, custom
 * title — e.g. contractor, limited company) keep their own Clever code and
 * add a Workwell branch via `WorkwellServiceRoute` + `workwellServiceMetadata`.
 */

/** Shape of a `servicePage` Sanity doc (all optional — editors fill what they want). */
type CmsServicePage = {
  title?: string;
  headline?: string;
  description?: string;
  price?: string;
  features?: string[];
  benefits?: { title?: string; description?: string }[];
  faqs?: { question?: string; answer?: string }[];
  stats?: { value: string; label: string }[];
  serviceCategories?: { title: string; items: string[] }[];
  guide?: { heading?: string; intro?: string; points?: string[] }[];
  testimonial?: { name?: string; role?: string; quote?: string };
  sections?: {
    featuresEyebrow?: string;
    featuresHeading?: string;
    benefitsEyebrow?: string;
    benefitsHeading?: string;
    categoriesEyebrow?: string;
    categoriesHeading?: string;
    guideEyebrow?: string;
    guideHeading?: string;
    faqEyebrow?: string;
    faqHeading?: string;
    ctaHeading?: string;
    ctaBody?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
};

type Breadcrumb = { name: string; url: string }[];

/** Relatable audience photo per service page (B2C warmth). Falls back to the
 *  "accountant on the phone" shot for pages without a specific audience image. */
const SLUG_IMAGE: Record<string, string> = {
  "sole-trader": "/images/sole-trader.jpg",
  "cis-accounting": "/images/sole-trader-tradesperson.jpg",
  "freelancer-accountancy": "/images/freelancer-home.jpg",
  "landlord-accounting": "/images/landlord-property.jpg",
  "ecommerce-accounting": "/images/ecommerce-seller.jpg",
  "limited-company": "/images/limited-company-director.jpg",
  "small-business-accountant": "/images/startup-team.jpg",
  "accounting-for-startups": "/images/startup-team.jpg",
  "contractor-accountancy": "/images/contractor-it.jpg",
  "it-contractor-accountant": "/images/contractor-it.jpg",
  ir35: "/images/contractor-it.jpg",
};
const DEFAULT_IMAGE = "/images/hero-accountant.jpg";

function deClever(s: string, brandName: string): string {
  return s
    .replace(/Clever Accounts/g, brandName)
    .replace(/Clever FLEX umbrella solution/gi, "umbrella solution")
    .replace(/\bClever FLEX\b/gi, "umbrella");
}

function mergeContent(cms: CmsServicePage | null, fb: ServicePageData | undefined, brandName: string): ServiceContent {
  // De-Clever EVERYTHING (CMS or fallback). `fb` is optional — newer Workwell
  // service docs are CMS-only with no legacy fallback, so every fb access is
  // guarded.
  const dc = (s?: string) => (s ? deClever(s, brandName) : "");
  const faqsSrc = cms?.faqs?.length
    ? cms.faqs.map((f) => ({ q: f.question ?? "", a: f.answer ?? "" }))
    : fb?.faqs ?? [];
  const benefitsSrc = cms?.benefits?.length
    ? cms.benefits.map((b) => ({ title: b.title ?? "", description: b.description ?? "" }))
    : fb?.benefits ?? [];
  const testimonialSrc = cms?.testimonial?.quote ? cms.testimonial : fb?.testimonial;
  return {
    title: dc(cms?.title || fb?.title || ""),
    headline: dc(cms?.headline || fb?.headline || ""),
    description: dc(cms?.description || fb?.description || ""),
    price: cms?.price || fb?.price || "",
    features: (cms?.features?.length ? cms.features : fb?.features ?? []).map((f) => dc(f)),
    benefits: benefitsSrc.map((b) => ({ title: dc(b.title), description: dc(b.description) })),
    faqs: faqsSrc.map((f) => ({ q: dc(f.q), a: dc(f.a) })),
    stats: (cms?.stats?.length ? cms.stats : fb?.stats)?.map((s) => ({ value: s.value, label: dc(s.label) })),
    serviceCategories: (cms?.serviceCategories?.length ? cms.serviceCategories : fb?.serviceCategories)?.map((c) => ({
      title: dc(c.title),
      items: c.items.map((it) => dc(it)),
    })),
    guide: cms?.guide?.length
      ? cms.guide.map((g) => ({ heading: dc(g.heading), intro: dc(g.intro), points: (g.points ?? []).map((p) => dc(p)) }))
      : undefined,
    testimonial: testimonialSrc?.quote
      ? { name: dc(testimonialSrc.name), role: dc(testimonialSrc.role), quote: dc(testimonialSrc.quote) }
      : undefined,
    sections: cms?.sections
      ? {
          featuresEyebrow: dc(cms.sections.featuresEyebrow),
          featuresHeading: dc(cms.sections.featuresHeading),
          benefitsEyebrow: dc(cms.sections.benefitsEyebrow),
          benefitsHeading: dc(cms.sections.benefitsHeading),
          categoriesEyebrow: dc(cms.sections.categoriesEyebrow),
          categoriesHeading: dc(cms.sections.categoriesHeading),
          guideEyebrow: dc(cms.sections.guideEyebrow),
          guideHeading: dc(cms.sections.guideHeading),
          faqEyebrow: dc(cms.sections.faqEyebrow),
          faqHeading: dc(cms.sections.faqHeading),
          ctaHeading: dc(cms.sections.ctaHeading),
          ctaBody: dc(cms.sections.ctaBody),
        }
      : undefined,
  };
}

/** Workwell-only metadata for a service page (CMS title/desc over fallback). */
export async function workwellServiceMetadata(slug: string): Promise<Metadata> {
  const fb = servicePages[slug];
  const brand = await getBrand();
  const cms = (await getServicePage(slug, "workwell").catch(() => null)) as CmsServicePage | null;
  // Titles can bake in a brand suffix ("| Clever Accounts"); strip it (the
  // (site) layout's title template appends the active brand) and de-Clever
  // whatever source the title/description came from (CMS or fallback).
  const rawTitle = cms?.metaTitle || cms?.title || fb?.title || "";
  const stripped = rawTitle.replace(/\s*\|\s*(Clever Accounts|Workwell Accountancy)\s*$/i, "").trim();
  return {
    title: deClever(stripped, brand.name),
    description: deClever(cms?.metaDescription || fb?.metaDescription || "", brand.name),
  };
}

/** Workwell-only renderer (used by pages that keep custom Clever code). */
export async function WorkwellServiceRoute({ slug, breadcrumb }: { slug: string; breadcrumb: Breadcrumb }) {
  const fb = servicePages[slug];
  const brand = await getBrand();
  const cms = (await getServicePage(slug, "workwell").catch(() => null)) as CmsServicePage | null;
  const content = mergeContent(cms, fb, brand.name);
  // Deterministic per-slug layout variant (0-2) so pages don't all look identical.
  const variant = [...slug].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 3;
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumb} />
      <WorkwellServicePage content={content} heroImage={SLUG_IMAGE[slug] ?? DEFAULT_IMAGE} variant={variant} />
    </>
  );
}

/** Brand-aware metadata for the simple pages. */
export async function serviceMetadata(slug: string): Promise<Metadata> {
  const fb = servicePages[slug];
  const brand = await getBrand();
  if (brand.id === "workwell") return workwellServiceMetadata(slug);
  return { title: fb?.title, description: fb?.metaDescription };
}

/** Brand-aware renderer for the simple pages (no Clever-only extras). */
export default async function ServiceRoute({ slug, breadcrumb }: { slug: string; breadcrumb: Breadcrumb }) {
  const brand = await getBrand();
  if (brand.id === "workwell") return WorkwellServiceRoute({ slug, breadcrumb });
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumb} />
      <ServicePageTemplate data={servicePages[slug]} />
    </>
  );
}
