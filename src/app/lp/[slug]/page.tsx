import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";
import { getLandingPage, getLandingPageSlugs } from "@/sanity/queries";

/**
 * CMS-driven landing pages at /lp/[slug].
 *
 * Hardcoded pages (sole-trader, limited-company, etc.) take precedence over
 * this dynamic route because static Next.js routes always win. This route
 * handles any NEW slug created in Sanity — no code deploy needed.
 */

export async function generateStaticParams() {
  const slugs = await getLandingPageSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle || page.headline,
    description: page.metaDescription || page.subheadline,
    robots: page.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export default async function CMSLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLandingPage(slug);

  if (!page) notFound();

  return (
    <LandingPageLayout
      headline={page.headline}
      subheadline={page.subheadline ?? ""}
      price={page.price ?? "42.50"}
      targetAudience={page.targetAudience ?? ""}
      urgencyText={page.urgencyText}
      features={page.features ?? []}
      whyUs={page.whyUs ?? []}
      painPoints={page.painPoints ?? []}
      howItWorks={page.howItWorks ?? []}
      testimonials={page.testimonials ?? []}
      faq={page.faq ?? []}
    />
  );
}
