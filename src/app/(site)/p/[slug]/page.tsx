import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getBrand } from "@/lib/brand";
import { getFlexiblePage } from "@/sanity/queries";
import BlockRenderer, { type PageBlock } from "@/components/blocks/BlockRenderer";
import AbTrack from "@/components/blocks/AbTrack";
import { abCookieName, pickVariant } from "@/lib/ab";

type FlexiblePage = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  sections?: PageBlock[];
  experimentEnabled?: boolean;
  sectionsB?: PageBlock[];
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand();
  const page = (await getFlexiblePage(slug, brand.id).catch(() => null)) as FlexiblePage | null;
  if (!page) return {};
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    ...(page.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function FlexiblePageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrand();
  const page = (await getFlexiblePage(slug, brand.id).catch(() => null)) as FlexiblePage | null;
  if (!page) notFound();

  // Non-experiment path — unchanged.
  if (!page.experimentEnabled || !page.sectionsB?.length) {
    return <BlockRenderer sections={page.sections} />;
  }

  // A/B path. Pin the visitor to a variant via a cookie so repeat visits are
  // consistent. NOTE: a Server Component cannot write cookies during render
  // (cookies().set throws outside Route Handlers / Server Actions), so we read
  // the cookie read-only here. If it's absent we pick a variant for this render
  // but cannot persist it — the visitor may be re-randomised on their next
  // visit until a cookie exists. To make the pin sticky on first visit, set the
  // cookie from a middleware or a tiny client effect; read-only is acceptable
  // for v1 and any uncertainty still defaults safely to a valid variant.
  const cookieStore = await cookies();
  const existing = cookieStore.get(abCookieName(slug))?.value;
  const variant = pickVariant(slug, existing);
  const sections = variant === "B" ? page.sectionsB : page.sections;

  return (
    <>
      <AbTrack experiment={slug} variant={variant} />
      <BlockRenderer sections={sections} />
    </>
  );
}
