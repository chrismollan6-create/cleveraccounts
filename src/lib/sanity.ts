import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  readTime?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: { asset: { url: string }; alt?: string };
  body?: unknown[];
}

export async function getBlogPosts(): Promise<SanityBlogPost[]> {
  return sanityClient.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, category, readTime,
      metaTitle, metaDescription,
      featuredImage { asset->{ url }, alt }
    }`
  );
}

export async function getBlogPost(slug: string): Promise<SanityBlogPost | null> {
  const results = await sanityClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      _id, title, slug, excerpt, publishedAt, category, readTime,
      metaTitle, metaDescription,
      featuredImage { asset->{ url }, alt },
      body
    }`,
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
