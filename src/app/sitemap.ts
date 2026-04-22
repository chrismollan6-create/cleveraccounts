import type { MetadataRoute } from "next";
import { getBlogSlugs } from "@/sanity/queries";

const BASE = "https://cleveraccounts.com";

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
  { url: "/tax-returns",                       priority: 0.7, changeFrequency: "monthly" },
  { url: "/making-tax-digital",                priority: 0.7, changeFrequency: "monthly" },
  { url: "/take-home-calculator",              priority: 0.7, changeFrequency: "monthly" },
  { url: "/integrations",                      priority: 0.6, changeFrequency: "monthly" },
  { url: "/about-us",                          priority: 0.6, changeFrequency: "monthly" },
  { url: "/reviews",                           priority: 0.6, changeFrequency: "weekly" },
  { url: "/contact",                           priority: 0.6, changeFrequency: "monthly" },
  { url: "/faq",                               priority: 0.6, changeFrequency: "monthly" },
  { url: "/blog",                              priority: 0.7, changeFrequency: "weekly" },
  { url: "/sign-up",                           priority: 0.8, changeFrequency: "monthly" },
  { url: "/switching-accountants",             priority: 0.7, changeFrequency: "monthly" },
  { url: "/self-assessment",                   priority: 0.7, changeFrequency: "monthly" },
  { url: "/partners",                          priority: 0.5, changeFrequency: "monthly" },
];

// Excluded from sitemap (noIndex, tag pages, category pages, landing pages):
// - /lp/* (PPC landing pages — no SEO value, often noIndex)
// - /blog/tag/* and /blog/category/* (tag/category archive pages)
// - /log-in, /portal/* (auth pages)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Fetch live blog slugs from Sanity — automatically picks up new posts
  let blogSlugs: string[] = [];
  try {
    const raw = await getBlogSlugs();
    blogSlugs = (raw ?? []).filter(Boolean);
  } catch {
    // If Sanity is unreachable at build time, sitemap still generates without blog posts
  }

  return [
    ...STATIC_PAGES.map((p) => ({
      url: `${BASE}${p.url}`,
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
