import { createClient } from "@sanity/client";
import type { BrandId } from "@/lib/constants";

export const sanityClient = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

/**
 * Brand-scoping (mirrors src/sanity/queries.ts). A post matches the current
 * brand when it's tagged for that brand, tagged "shared", or carries no
 * `brand` field at all (every pre-existing post). Omit `brandId` to keep the
 * original un-scoped behaviour.
 */
const BRAND_FILTER = `(brand == $brandId || brand == "shared" || !defined(brand))`;
/** Prefer a brand-specific post over a shared one when both match a slug. */
const BRAND_ORDER = `order(select(brand == $brandId => 0, 1))`;

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  readTime?: string;
  brand?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: { asset: { url: string }; alt?: string };
  body?: unknown[];
  pageSchemas?: unknown[];
}

export async function getBlogPosts(brandId?: BrandId): Promise<SanityBlogPost[]> {
  const brandFilter = brandId ? ` && ${BRAND_FILTER}` : "";
  return sanityClient.fetch(
    `*[_type == "blogPost"${brandFilter}] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, category, readTime, brand,
      metaTitle, metaDescription,
      featuredImage { asset->{ url }, alt }
    }`,
    brandId ? { brandId } : {}
  );
}

export async function getBlogPost(slug: string, brandId?: BrandId): Promise<SanityBlogPost | null> {
  const projection = `{
      _id, title, slug, excerpt, publishedAt, category, readTime, brand,
      metaTitle, metaDescription,
      featuredImage { asset->{ url }, alt },
      body,
      pageSchemas
    }`;
  const results = brandId
    ? await sanityClient.fetch(
        `*[_type == "blogPost" && slug.current == $slug && ${BRAND_FILTER}] | ${BRAND_ORDER} [0] ${projection}`,
        { slug, brandId }
      )
    : await sanityClient.fetch(
        `*[_type == "blogPost" && slug.current == $slug][0] ${projection}`,
        { slug }
      );
  return results ?? null;
}

export async function getBlogSlugs(): Promise<string[]> {
  const results = await sanityClient.fetch(
    `*[_type == "blogPost" && defined(slug.current)].slug.current`
  );
  return results ?? [];
}
