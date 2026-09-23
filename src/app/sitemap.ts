import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { BRANDS } from "@/lib/constants";
import { brandIdFromHost } from "@/lib/brand-host";
import { isWorkwellIndexable } from "@/lib/workwell-index";
import {
  getBlogSitemapEntries,
  getKnowledgeArticleSitemapEntries,
  getKnowledgeTopicSitemapEntries,
} from "@/sanity/queries";

const STATIC_PAGES: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { url: "/",                                  priority: 1.0, changeFrequency: "weekly" },
  { url: "/pricing",                           priority: 0.9, changeFrequency: "weekly" },
  { url: "/our-services",                      priority: 0.9, changeFrequency: "monthly" },
  { url: "/sole-trader",                       priority: 0.9, changeFrequency: "monthly" },
  { url: "/limited-company",                   priority: 0.9, changeFrequency: "monthly" },
  { url: "/contractor-accountancy",            priority: 0.9, changeFrequency: "monthly" },
  { url: "/freelancer-accountancy",            priority: 0.8, changeFrequency: "monthly" },
  { url: "/landlord-accounting",               priority: 0.8, changeFrequency: "monthly" },
  { url: "/accounting-for-startups",           priority: 0.8, changeFrequency: "monthly" },
  { url: "/ecommerce-accounting",              priority: 0.8, changeFrequency: "monthly" },
  { url: "/cis-accounting",                    priority: 0.8, changeFrequency: "monthly" },
  { url: "/small-business-accountant",         priority: 0.8, changeFrequency: "monthly" },
  { url: "/contractor-accountants/ir35",       priority: 0.8, changeFrequency: "monthly" },
  { url: "/it-contractor-accountant",          priority: 0.7, changeFrequency: "monthly" },
  { url: "/our-services/accounting-software",  priority: 0.7, changeFrequency: "monthly" },
  { url: "/our-services/accountant-switch",    priority: 0.7, changeFrequency: "monthly" },
  { url: "/local-accountants",                 priority: 0.7, changeFrequency: "monthly" },
  { url: "/how-it-works",                      priority: 0.7, changeFrequency: "monthly" },
  { url: "/compare",                           priority: 0.7, changeFrequency: "monthly" },
  { url: "/vat-returns",                       priority: 0.7, changeFrequency: "monthly" },
  { url: "/payroll-services",                  priority: 0.7, changeFrequency: "monthly" },
  { url: "/payroll-and-salary-information",     priority: 0.6, changeFrequency: "yearly" },
  { url: "/tax-returns",                       priority: 0.7, changeFrequency: "monthly" },
  { url: "/making-tax-digital",                priority: 0.7, changeFrequency: "monthly" },
  { url: "/take-home-calculator",              priority: 0.7, changeFrequency: "monthly" },
  { url: "/integrations",                      priority: 0.6, changeFrequency: "monthly" },
  { url: "/freeagent",                         priority: 0.7, changeFrequency: "monthly" },
  { url: "/about-us",                          priority: 0.6, changeFrequency: "monthly" },
  { url: "/reviews",                           priority: 0.6, changeFrequency: "weekly" },
  { url: "/contact",                           priority: 0.6, changeFrequency: "monthly" },
  { url: "/faq",                               priority: 0.6, changeFrequency: "monthly" },
  { url: "/blog",                              priority: 0.7, changeFrequency: "weekly" },
  { url: "/learn",                             priority: 0.8, changeFrequency: "weekly" },
  { url: "/switching-accountants",             priority: 0.7, changeFrequency: "monthly" },
  { url: "/self-assessment",                   priority: 0.7, changeFrequency: "monthly" },
  { url: "/partners",                          priority: 0.5, changeFrequency: "monthly" },
];

// Excluded from sitemap (noIndex, tag pages, category pages, landing pages):
// - /sign-up (the page itself is noindex — advertising it contradicts that)
// - /lp/* (PPC landing pages — no SEO value, often noIndex)
// - /blog/tag/* and /blog/category/* (tag/category archive pages)
// - /log-in, /portal/* (auth pages)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Per-brand sitemap: emit the requesting host's brand domain. Middleware is
  // excluded from /sitemap.xml, so derive the brand from the host directly.
  const host = (await headers()).get("host") || "";
  const brandId = brandIdFromHost(host);
  const BASE = `https://${BRANDS[brandId].domain}`;

  // Fetch live content from Sanity — automatically picks up new posts.
  // Blog rows are brand-filtered with the SAME filter the post page uses, so
  // the sitemap can never advertise a slug that renders "Post Not Found".
  let blog: Array<{ slug: string; lastmod: string }> = [];
  let learnTopics: Array<{ slug: string; lastmod: string }> = [];
  let learnArticles: Array<{ topicSlug: string; articleSlug: string; lastmod: string }> = [];
  try {
    [blog, learnTopics, learnArticles] = await Promise.all([
      getBlogSitemapEntries(brandId),
      getKnowledgeTopicSitemapEntries(),
      getKnowledgeArticleSitemapEntries(),
    ]);
  } catch {
    // If Sanity is unreachable at build time, sitemap still generates without dynamic entries
  }

  // Static pages carry NO lastmod. We don't track when their copy last changed,
  // and a made-up date (this file used to stamp `new Date()` on every URL, on
  // every request) teaches Google to ignore lastmod across the whole sitemap.
  const entries: MetadataRoute.Sitemap = [
    ...STATIC_PAGES.map((p) => ({
      url: `${BASE}${p.url}`,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...blog.map((b) => ({
      url: `${BASE}/blog/${b.slug}`,
      lastModified: b.lastmod,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...learnTopics.map((t) => ({
      url: `${BASE}/learn/${t.slug}`,
      lastModified: t.lastmod,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...learnArticles.map((a) => ({
      url: `${BASE}/learn/${a.topicSlug}/${a.articleSlug}`,
      lastModified: a.lastmod,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Non-Clever brands: only submit pages with unique content (the allowlist) —
  // duplicated pages stay out of the index until rewritten.
  if (brandId !== "clever") {
    return entries.filter((e) => isWorkwellIndexable(e.url.replace(BASE, "") || "/"));
  }
  return entries;
}
