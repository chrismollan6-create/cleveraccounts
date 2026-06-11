import { client, previewClient } from "./client";
import type { BrandId } from "@/lib/constants";

/**
 * Returns the draft-aware preview client when Next draft mode is on (an editor
 * in the Studio's visual preview), otherwise the normal published client. The
 * dynamic import keeps this module usable outside a request scope (build time),
 * where draftMode() would throw — in which case we fall back to published.
 */
async function rc() {
  try {
    const { draftMode } = await import("next/headers");
    return (await draftMode()).isEnabled ? previewClient : client;
  } catch {
    return client;
  }
}

/**
 * Brand-scoping for conversion content (homepage, service pages, landing pages,
 * testimonials, case studies, promo banners).
 *
 * A document matches the current brand when it's explicitly tagged for that
 * brand, explicitly "shared", or carries no `brand` field at all (every
 * pre-existing document). Pass a `brandId` to scope; omit it to keep the
 * original un-scoped behaviour (used by callers not yet migrated).
 */
const BRAND_FILTER = `(brand == $brandId || brand == "shared" || !defined(brand))`;
/** When a brand-specific and a shared doc both match, prefer the brand-specific one. */
const BRAND_ORDER = `order(select(brand == $brandId => 0, 1))`;

// Blog posts
export async function getBlogPosts() {
  return client.fetch(`*[_type == "blogPost"] | order(publishedAt desc) {
    _id, title, slug, excerpt,
    featuredImage { alt, asset->{ url } },
    category, author, publishedAt
  }`);
}

export async function getBlogPost(slug: string) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      _id, title, slug, excerpt,
      featuredImage { alt, asset->{ url } },
      category, author, publishedAt,
      body, metaTitle, metaDescription
    }`,
    { slug }
  );
}

export async function getBlogSlugs() {
  return client.fetch(`*[_type == "blogPost"].slug.current`);
}

// Testimonials
export async function getTestimonials(featured?: boolean, brandId?: BrandId) {
  const featuredFilter = featured ? ` && featured == true` : "";
  const brandFilter = brandId ? ` && ${BRAND_FILTER}` : "";
  return client.fetch(
    `*[_type == "testimonial"${featuredFilter}${brandFilter}] | order(_createdAt desc) {
      _id, name, role, quote, rating, photo, featured, brand
    }`,
    brandId ? { brandId } : {}
  );
}

// Team members
export async function getTeamMembers() {
  return client.fetch(`*[_type == "teamMember"] | order(order asc) {
    _id, name, role, speciality, experience, bio, photo, specialities
  }`);
}

// Service pages
export async function getServicePage(slug: string, brandId?: BrandId) {
  const c = await rc();
  if (!brandId) {
    return c.fetch(`*[_type == "servicePage" && slug.current == $slug][0]`, { slug });
  }
  return c.fetch(
    `*[_type == "servicePage" && slug.current == $slug && ${BRAND_FILTER}] | ${BRAND_ORDER} [0]`,
    { slug, brandId }
  );
}

// Header menu + footer columns (per-brand singleton; null = use built-in defaults).
export async function getNavigation(brandId?: BrandId) {
  const id = brandId && brandId !== "clever" ? `navigation-${brandId}` : "navigation";
  return client.fetch(`*[_id == $id][0]{ headerLinks, footerColumns }`, { id });
}

// Editor-managed redirects. The read client uses the Sanity CDN, which caches
// for ~60s — enough to stop a scanner hitting many 404s from spamming Sanity,
// while new redirects go live within about a minute.
export async function getRedirects(): Promise<{ from: string; to: string; permanent?: boolean }[]> {
  return (
    (await client.fetch(`*[_type == "redirect" && defined(from) && defined(to)]{ from, to, permanent }`)) || []
  );
}

// Page-builder pages (/p/{slug}).
export async function getFlexiblePage(slug: string, brandId?: BrandId) {
  const c = await rc();
  if (!brandId) {
    return c.fetch(`*[_type == "flexiblePage" && slug.current == $slug][0]`, { slug });
  }
  return c.fetch(
    `*[_type == "flexiblePage" && slug.current == $slug && ${BRAND_FILTER}] | ${BRAND_ORDER} [0]`,
    { slug, brandId }
  );
}

// Home page content.
//
// homePage is a per-brand singleton (one fixed document per brand, pinned by
// id in the Studio desk — see sanity.config.ts). Clever uses the original
// "homePage" id; other brands use "homePage-<brandId>". If a brand's doc
// doesn't exist yet this returns null and the homepage falls back to the
// component's built-in copy.
export async function getHomePage(brandId?: BrandId) {
  const id = brandId && brandId !== "clever" ? `homePage-${brandId}` : "homePage";
  return (await rc()).fetch(`*[_id == $id][0]`, { id });
}

// FAQs
export async function getFAQs(category?: string) {
  const filter = category ? ` && category == "${category}"` : "";
  return client.fetch(`*[_type == "faq"${filter}] | order(category asc, order asc) {
    _id, question, answer, category, order, featured
  }`);
}

export async function getFeaturedFAQs() {
  return client.fetch(`*[_type == "faq" && featured == true] | order(order asc) {
    _id, question, answer, category
  }`);
}

// Pricing plans
export async function getPricingPlans() {
  return client.fetch(`*[_type == "pricingPlan"] | order(order asc) {
    _id, name, subtitle, price, priceNote, popular, features, ctaText, ctaLink, order,
    homepageIcon, homepageHeadline, homepagePlural, homepageStat, homepageLearnMore
  }`);
}

// Promo banner
export async function getActivePromoBanner(brandId?: BrandId) {
  const now = new Date().toISOString();
  const brandFilter = brandId ? ` && ${BRAND_FILTER}` : "";
  return client.fetch(
    `*[_type == "promoBanner" && active == true &&
      (startDate == null || startDate <= $now) &&
      (endDate == null || endDate >= $now)${brandFilter}
    ] | order(_createdAt desc)[0] {
      _id, text, linkText, linkUrl, backgroundColor
    }`,
    brandId ? { now, brandId } : { now }
  );
}

// Case studies
export async function getCaseStudies(brandId?: BrandId) {
  const brandFilter = brandId ? ` && ${BRAND_FILTER}` : "";
  return client.fetch(
    `*[_type == "caseStudy"${brandFilter}] | order(publishedAt desc) {
      _id, clientName, slug, businessType, industry, photo, headline, summary, metrics, featured, brand
    }`,
    brandId ? { brandId } : {}
  );
}

export async function getCaseStudy(slug: string, brandId?: BrandId) {
  if (!brandId) {
    return client.fetch(
      `*[_type == "caseStudy" && slug.current == $slug][0]`,
      { slug }
    );
  }
  return client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug && ${BRAND_FILTER}] | ${BRAND_ORDER} [0]`,
    { slug, brandId }
  );
}

export async function getFeaturedCaseStudy(brandId?: BrandId) {
  const brandFilter = brandId ? ` && ${BRAND_FILTER}` : "";
  return client.fetch(
    `*[_type == "caseStudy" && featured == true${brandFilter}] | order(publishedAt desc)[0] {
      _id, clientName, slug, businessType, industry, photo, headline, summary,
      challenge, solution, results, quote, metrics
    }`,
    brandId ? { brandId } : {}
  );
}

// Site settings (singleton)
export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0] {
    phone, freephone, email, tagline, offices, stats, social,
    promo {
      enabled, discountPercent, durationMonths, badgeText, endDate,
      appliesTo[]->{ _id, name }
    }
  }`);
}

// Landing pages (CMS-driven /lp/* pages)
export async function getLandingPage(slug: string, brandId?: BrandId) {
  const projection = `{
      _id, title, slug, headline, subheadline, price, targetAudience,
      urgencyText, features, whyUs, painPoints, howItWorks, testimonials,
      faq, metaTitle, metaDescription, noIndex
    }`;
  const c = await rc();
  if (!brandId) {
    return c.fetch(`*[_type == "landingPage" && slug.current == $slug][0] ${projection}`, { slug });
  }
  return c.fetch(
    `*[_type == "landingPage" && slug.current == $slug && ${BRAND_FILTER}] | ${BRAND_ORDER} [0] ${projection}`,
    { slug, brandId }
  );
}

export async function getLandingPageSlugs(): Promise<string[]> {
  return client.fetch(`*[_type == "landingPage"].slug.current`);
}

export async function getLandingPages() {
  return client.fetch(`*[_type == "landingPage"] | order(_createdAt desc) {
    _id, title, slug, headline, price, targetAudience, noIndex, _createdAt
  }`);
}

// Knowledge centre
export async function getKnowledgeTopics() {
  return client.fetch(`*[_type == "knowledgeTopic"] | order(order asc, name asc) {
    _id, name, slug, shortDescription, intro, icon, order,
    "articleCount": count(*[_type == "knowledgeArticle" && references(^._id)])
  }`);
}

// Single combined fetch for the /learn index page — topics with their top-3
// articles, the featured article (or latest if none flagged), the latest 6,
// and a slim list of every article for client-side search.
export async function getLearnIndexData() {
  return client.fetch(`{
    "topics": *[_type == "knowledgeTopic"] | order(order asc, name asc) {
      _id, name, slug, shortDescription, icon,
      "articles": *[_type == "knowledgeArticle" && references(^._id)] | order(lastReviewed desc) [0...3] {
        _id, title, slug, canonicalQuestion
      },
      "articleCount": count(*[_type == "knowledgeArticle" && references(^._id)])
    },
    "featured": *[_type == "knowledgeArticle" && featured == true] | order(lastReviewed desc) [0] {
      _id, title, slug, canonicalQuestion, excerpt, lastReviewed, appliesTo,
      "topic": topic->{ name, slug }
    },
    "latest": *[_type == "knowledgeArticle"] | order(lastReviewed desc) [0...6] {
      _id, title, slug, canonicalQuestion, excerpt, lastReviewed, appliesTo,
      "topic": topic->{ name, slug }
    },
    "allArticles": *[_type == "knowledgeArticle"] {
      _id, title, "slug": slug.current, canonicalQuestion, excerpt, appliesTo,
      "topicName": topic->name, "topicSlug": topic->slug.current
    }
  }`);
}

export async function getKnowledgeTopic(slug: string) {
  return client.fetch(
    `*[_type == "knowledgeTopic" && slug.current == $slug][0] {
      _id, name, slug, shortDescription, intro, icon,
      metaTitle, metaDescription,
      keyFacts, timeline, usefulLinks, quickAnswers,
      "articles": *[_type == "knowledgeArticle" && references(^._id)] | order(lastReviewed desc) {
        _id, title, slug, canonicalQuestion, excerpt, appliesTo, lastReviewed
      }
    }`,
    { slug }
  );
}

export async function getKnowledgeArticle(topicSlug: string, articleSlug: string) {
  return client.fetch(
    `*[_type == "knowledgeArticle" && slug.current == $articleSlug && topic->slug.current == $topicSlug][0] {
      _id, title, slug, canonicalQuestion, excerpt, appliesTo,
      lastReviewed, reviewDue, reviewedBy,
      featuredImage { alt, asset->{ url } },
      body, metaTitle, metaDescription, pageSchemas,
      "topic": topic->{ _id, name, slug },
      "relatedArticles": relatedArticles[]->{
        _id, title, slug, canonicalQuestion, excerpt,
        "topic": topic->{ name, slug }
      }
    }`,
    { topicSlug, articleSlug }
  );
}

export async function getKnowledgeArticleSlugs() {
  return client.fetch(`*[_type == "knowledgeArticle" && defined(slug.current) && defined(topic->slug.current)] {
    "articleSlug": slug.current,
    "topicSlug": topic->slug.current
  }`);
}

export async function getKnowledgeTopicSlugs() {
  return client.fetch(`*[_type == "knowledgeTopic"].slug.current`);
}
