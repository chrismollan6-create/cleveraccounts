import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Accounting & Tax News",
  description: "Latest accounting news, tax tips and business advice from Clever Accounts. Stay informed with expert insights for sole traders, limited companies and contractors.",
};

const posts = [
  { slug: "mtd-income-tax-sole-traders", title: "MTD for Income Tax: What Sole Traders Need to Know", excerpt: "Making Tax Digital for Income Tax Self Assessment is coming. Here's everything you need to prepare your business for the changes ahead.", category: "Tax", date: "March 2026" },
  { slug: "ir35-2026-updates", title: "IR35 in 2026: Latest Updates for Contractors", excerpt: "The IR35 landscape continues to evolve. We break down the latest changes and what they mean for your contracts and working arrangements.", category: "IR35", date: "February 2026" },
  { slug: "tax-saving-tips-ltd", title: "5 Tax-Saving Tips for Limited Company Directors", excerpt: "Maximise your tax efficiency as a limited company director with these five expert strategies recommended by our accountants.", category: "Business Tips", date: "January 2026" },
  { slug: "claiming-expenses-sole-trader", title: "Expenses You Can Claim as a Sole Trader", excerpt: "A comprehensive guide to allowable expenses for sole traders. Don't miss out on legitimate deductions that could reduce your tax bill.", category: "Tax", date: "December 2025" },
  { slug: "choosing-business-structure", title: "Sole Trader vs Limited Company: Which Is Right for You?", excerpt: "The structure you choose affects your tax, liability, and admin. We break down the pros and cons of each option.", category: "Business Tips", date: "November 2025" },
  { slug: "vat-registration-guide", title: "VAT Registration: When & How to Register", excerpt: "Everything you need to know about VAT registration thresholds, voluntary registration, and the process of getting registered.", category: "VAT", date: "October 2025" },
];

export default function BlogPage() {
  return (
    <>
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Accounting &amp; Tax Blog</h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Expert insights, tax tips and the latest news to help your business thrive.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white border border-border rounded-2xl overflow-hidden card-hover">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl gradient-cta flex items-center justify-center text-white text-2xl font-bold">
                    {post.category[0]}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{post.category}</span>
                    <span className="text-xs text-text-light">{post.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="text-sm text-text-light leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
