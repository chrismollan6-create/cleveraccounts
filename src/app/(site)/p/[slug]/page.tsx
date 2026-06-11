import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brand";
import { getFlexiblePage } from "@/sanity/queries";
import BlockRenderer, { type PageBlock } from "@/components/blocks/BlockRenderer";

type FlexiblePage = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  sections?: PageBlock[];
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
  return <BlockRenderer sections={page.sections} />;
}
