import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { getBlogPosts } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Accounting & Tax Blog — Expert Insights | Clever Accounts",
  description:
    "Latest accounting news, tax tips and business advice from Clever Accounts. Expert insights for sole traders, limited companies, contractors, and landlords.",
};

const posts = [
  {
    slug: "mtd-income-tax-sole-traders",
    title: "MTD for Income Tax: What Sole Traders Need to Know in 2026",
    excerpt: "Making Tax Digital for Income Tax Self Assessment is coming in April 2026 for those earning over £50,000. Here's everything you need to prepare your business for the change — including what quarterly reporting actually means in practice.",
    category: "Tax",
    date: "March 2026",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "ir35-2026-updates",
    title: "IR35 in 2026: Latest Updates for Contractors",
    excerpt: "The IR35 landscape continues to evolve. We break down the latest changes and what they mean for your contracts and working arrangements.",
    category: "IR35",
    date: "February 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "tax-saving-tips-ltd",
    title: "5 Tax-Saving Tips for Limited Company Directors",
    excerpt: "Maximise your tax efficiency as a limited company director with these five expert strategies recommended by our accountants.",
    category: "Business Tips",
    date: "January 2026",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "claiming-expenses-sole-trader",
    title: "Expenses You Can Claim as a Sole Trader",
    excerpt: "A comprehensive guide to allowable expenses for sole traders. Don't miss out on legitimate deductions that could reduce your tax bill.",
    category: "Tax",
    date: "December 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "choosing-business-structure",
    title: "Sole Trader vs Limited Company: Which Is Right for You?",
    excerpt: "The structure you choose affects your tax, liability, and admin. We break down the pros and cons of each option so you can make the right call.",
    category: "Business Tips",
    date: "November 2025",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "vat-registration-guide",
    title: "VAT Registration: When & How to Register",
    excerpt: "Everything you need to know about VAT registration thresholds, voluntary registration, and the process of getting registered with HMRC.",
    category: "VAT",
    date: "October 2025",
    readTime: "4 min read",
    featured: false,
  },
];

const categoryColours: Record<string, string> = {
  "Tax": "bg-primary/10 text-primary",
  "IR35": "bg-orange-500/10 text-orange-600",
  "Business Tips": "bg-green-500/10 text-green-700",
  "VAT": "bg-purple-500/10 text-purple-700",
};

const categoryDots: Record<string, string> = {
  "Tax": "bg-primary",
  "IR35": "bg-orange-500",
  "Business Tips": "bg-green-500",
  "VAT": "bg-purple-500",
};

// Gradient placeholders per category
const categoryGradients: Record<string, string> = {
  "Tax": "from-primary/20 to-primary/5",
  "IR35": "from-orange-500/20 to-orange-500/5",
  "Business Tips": "from-green-500/20 to-green-500/5",
  "VAT": "from-purple-500/20 to-purple-500/5",
};

export const revalidate = 60;

function normaliseCategory(raw: string | undefined): string {
  const map: Record<string, string> = {
    "tax": "Tax", "ir35": "IR35", "vat": "VAT",
    "business-tips": "Business Tips", "payroll": "Payroll",
    "news": "News", "guides": "Guides",
  };
  return map[raw ?? ""] ?? raw ?? "General";
}

export default async function BlogPage() {
  // Merge Sanity posts (new, at front) with hardcoded posts (fallback)
  const sanitized = await getBlogPosts().catch(() => []);
  const sanityPosts = sanitized.map((p) => ({
    slug: p.slug.current,
    title: p.title,
    excerpt: p.excerpt ?? "",
    category: normaliseCategory(p.category),
    date: p.publishedAt
      ? new Date(p.publishedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
      : "",
    readTime: p.readTime ?? "5 min read",
    featured: false,
  }));

  const merged = [
    ...sanityPosts,
    ...posts.filter((p) => !sanityPosts.find((s) => s.slug === p.slug)),
  ];

  const allCategories = ["All", ...Array.from(new Set(merged.map((p) => p.category)))];
  const [featured, ...rest] = merged;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-4">Expert Insights</p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Accounting &<br />
            <span className="text-gradient">Tax Blog</span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Practical tax tips, accountancy news, and business advice — written by our accountants for UK businesses.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">

          {/* ── Featured post ── */}
          <div className="mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-5">Featured Article</p>
            <Link href={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-0 bg-white border border-border rounded-3xl overflow-hidden shadow-sm card-hover">
              {/* Image placeholder */}
              <div className={`bg-gradient-to-br ${categoryGradients[featured.category] ?? "from-primary/10 to-secondary/10"} h-56 md:h-auto flex items-center justify-center relative`}>
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl ${categoryDots[featured.category] ?? "bg-primary"} flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 shadow-lg`}>
                    {featured.category[0]}
                  </div>
                  <span className="text-white/80 text-sm font-semibold">{featured.category}</span>
                </div>
              </div>
              {/* Copy */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColours[featured.category] ?? "bg-primary/10 text-primary"}`}>
                    {featured.category}
                  </span>
                  <span className="text-text-light text-xs flex items-center gap-1">
                    <Clock size={12} /> {featured.readTime}
                  </span>
                  <span className="text-text-light text-xs">{featured.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-dark mb-4 leading-tight group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-text-light leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                  Read article <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>

          {/* ── Category tags ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allCategories.map((cat) => (
              <span
                key={cat}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border cursor-default ${
                  cat === "All"
                    ? "bg-dark text-white border-dark"
                    : "bg-white text-text-light border-border hover:border-primary hover:text-primary transition-colors"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* ── Post grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-border rounded-2xl overflow-hidden card-hover flex flex-col"
              >
                {/* Card image */}
                <div className={`h-40 bg-gradient-to-br ${categoryGradients[post.category] ?? "from-primary/10 to-secondary/10"} flex items-center justify-center`}>
                  <div className={`w-12 h-12 rounded-xl ${categoryDots[post.category] ?? "bg-primary"} flex items-center justify-center text-white text-lg font-black shadow-md`}>
                    {post.category[0]}
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColours[post.category] ?? "bg-primary/10 text-primary"}`}>
                      {post.category}
                    </span>
                    <span className="text-text-light text-xs flex items-center gap-1 ml-auto">
                      <Clock size={11} /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-dark mb-2 leading-snug group-hover:text-primary transition-colors flex-1">
                    {post.title}
                  </h2>
                  <p className="text-xs text-text-light leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-text-light text-xs">{post.date}</span>
                    <span className="text-primary text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── Newsletter / CTA ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">Stay Informed</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Tax deadlines. MTD updates.<br />
            <span className="text-gradient">Right when you need them.</span>
          </h2>
          <p className="text-white/65 max-w-xl mx-auto mb-8 leading-relaxed">
            Our accountants write about the things that actually affect your business — tax changes, deadline reminders, and practical tips. No jargon, no filler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
              Get an Accountant <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
