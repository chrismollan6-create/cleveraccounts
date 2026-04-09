import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cleveraccounts.com";
  const now = new Date().toISOString();

  const staticPages = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/our-services", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/sole-trader", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/limited-company", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/contractor-accountancy", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/freelancer-accountancy", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/landlord-accounting", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/accounting-for-startups", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contractor-accountants/ir35", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/our-services/accounting-software", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/our-services/accountant-switch", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/local-accountants", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/how-it-works", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/compare", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/about-us", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/reviews", priority: 0.6, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/sign-up", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vat-returns", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/payroll-services", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/tax-returns", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const blogSlugs = [
    "mtd-income-tax-sole-traders",
    "ir35-2026-updates",
    "tax-saving-tips-ltd",
    "claiming-expenses-sole-trader",
    "choosing-business-structure",
    "vat-registration-guide",
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
