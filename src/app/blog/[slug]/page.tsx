import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getBlogPost, getBlogSlugs } from "@/lib/sanity";

// ── Hardcoded fallback posts ──────────────────────────────────────────────────
const HARDCODED: Record<string, { title: string; category: string; date: string; author: string; content: string[] }> = {
  "mtd-income-tax-sole-traders": {
    title: "MTD for Income Tax: What Sole Traders Need to Know",
    category: "Tax",
    date: "15 March 2026",
    author: "Clever Accounts",
    content: [
      "Making Tax Digital (MTD) for Income Tax Self Assessment represents one of the biggest changes to the UK tax system in decades. If you're a sole trader or landlord with qualifying income, this will affect how you report your earnings to HMRC.",
      "Under MTD for ITSA, you'll need to keep digital records using compatible software and submit quarterly updates to HMRC, instead of filing a single annual self assessment tax return. This means HMRC will have a more up-to-date picture of your income throughout the year.",
      "The good news? If you're a Clever Accounts client, you're already prepared. Our FreeAgent accounting software is fully MTD compliant, and your dedicated accountant will handle the transition for you.",
      "Key dates to remember: MTD for ITSA is being rolled out in phases. Sole traders and landlords with annual business or property income above £50,000 will need to comply first. Those with income above £30,000 will follow in the next phase.",
      "What you need to do: Start keeping digital records now if you haven't already. Your Clever Accounts software makes this easy — simply log your income and expenses as you go, and we'll take care of the rest.",
      "If you have any questions about MTD and how it affects your business, your dedicated accountant is always just a phone call away. We're here to make the transition as smooth as possible.",
    ],
  },
  "ir35-2026-updates": {
    title: "IR35 in 2026: Latest Updates for Contractors",
    category: "IR35",
    date: "20 February 2026",
    author: "Clever Accounts",
    content: [
      "IR35 continues to be one of the most important topics for UK contractors. The off-payroll working rules determine whether a contractor should be taxed as an employee or can operate through their own limited company (PSC).",
      "Since the reforms that shifted IR35 responsibility to end clients in the private sector, the contracting landscape has evolved significantly. Many contractors have faced challenges with blanket determinations and uncertainty about their status.",
      "At Clever Accounts, our specialist contractor team reviews every contract to assess IR35 status. We provide detailed written assessments and can support you if a client's determination doesn't align with the reality of your working arrangements.",
      "Our unique Clever FLEX solution means you don't have to choose between PSC and umbrella. As your contracts change, you can switch seamlessly between the two — all managed by the same dedicated accountant.",
      "Tips for contractors in 2026: Always get your contracts reviewed before starting work. Keep evidence of your working practices. Understand the difference between substitution, control, and mutuality of obligation. And most importantly, work with an accountant who specialises in contractor tax.",
      "If you need IR35 advice or want to discuss your contracting arrangements, our specialist team is here to help. Call us on 0800 756 9786 or get in touch through our website.",
    ],
  },
  "tax-saving-tips-ltd": {
    title: "5 Tax-Saving Tips for Limited Company Directors",
    category: "Business Tips",
    date: "10 January 2026",
    author: "Clever Accounts",
    content: [
      "Running a limited company gives you more flexibility when it comes to tax planning. Here are five strategies our accountants recommend to maximise your tax efficiency.",
      "1. Optimise your salary and dividend mix: The most tax-efficient way to extract profits from your company is usually a combination of a low salary (up to the NI threshold) and dividends for the rest. Your Clever Accounts accountant will calculate the optimal split for your circumstances.",
      "2. Claim all allowable business expenses: From home office costs to business travel, professional subscriptions to equipment — make sure you're claiming everything you're entitled to. Many directors miss legitimate deductions that could reduce their tax bill.",
      "3. Consider pension contributions: Company pension contributions are a corporation tax deductible expense and don't attract income tax or NI. This can be one of the most tax-efficient ways to extract value from your company.",
      "4. Plan your corporation tax: With careful timing of expenses and income, you can optimise your corporation tax position. Your accountant can advise on year-end tax planning strategies.",
      "5. Use your annual allowances: Make sure you're using your tax-free dividend allowance, capital gains annual exemption, and ISA allowances. A proactive accountant will ensure you're not leaving money on the table.",
    ],
  },
  "claiming-expenses-sole-trader": {
    title: "Expenses You Can Claim as a Sole Trader",
    category: "Tax",
    date: "5 December 2025",
    author: "Clever Accounts",
    content: [
      "As a sole trader, claiming all your allowable expenses is crucial for reducing your tax bill. Here's a comprehensive guide to what you can and can't claim.",
      "Home office costs: If you work from home, you can claim a proportion of your household bills including heating, electricity, broadband, and council tax. You can use HMRC's simplified expenses method or calculate the actual costs.",
      "Travel and vehicle expenses: Business mileage can be claimed at 45p per mile for the first 10,000 miles and 25p thereafter. You can also claim for public transport, parking, and accommodation for business trips.",
      "Equipment and supplies: Computers, phones, printers, stationery, and other business equipment are all claimable. Larger items may need to be claimed as capital allowances rather than expenses.",
      "Professional costs: Accountancy fees, professional memberships, trade publications, training courses, and software subscriptions related to your business are all allowable expenses.",
      "Marketing and communication: Website hosting, advertising, business cards, phone bills (business proportion), and postal costs are all claimable business expenses.",
    ],
  },
  "choosing-business-structure": {
    title: "Sole Trader vs Limited Company: Which Is Right for You?",
    category: "Business Tips",
    date: "15 November 2025",
    author: "Clever Accounts",
    content: [
      "One of the first decisions you'll make when starting a business is choosing your legal structure. The two most common options for small businesses in the UK are sole trader and limited company.",
      "Sole Trader: This is the simplest structure. You and your business are legally the same entity. Setup is instant and free, there's less admin and compliance, and your accounts are private. However, you're personally liable for business debts and you pay income tax on all profits.",
      "Limited Company: Your business is a separate legal entity. This means limited personal liability for business debts, potential tax advantages (corporation tax is lower than higher rate income tax), and more credibility with some clients. However, there's more admin, public accounts, and Companies House requirements.",
      "When is a limited company more tax-efficient? Generally, once your profits exceed around £30,000-£50,000 per year, a limited company structure can be more tax-efficient. But it depends on your individual circumstances.",
      "The best advice? Talk to an accountant. At Clever Accounts, your dedicated accountant will assess your situation and recommend the most tax-efficient structure for your business. And if you need to switch structures later, we'll handle that too.",
      "Get in touch for a free, no-obligation chat about which structure is right for you.",
    ],
  },
  "vat-registration-guide": {
    title: "VAT Registration: When & How to Register",
    category: "VAT",
    date: "20 October 2025",
    author: "Clever Accounts",
    content: [
      "Value Added Tax (VAT) is something every growing business needs to understand. Here's your guide to VAT registration.",
      "When must you register? You must register for VAT when your taxable turnover exceeds £90,000 in any 12-month period, or when you expect it to exceed £90,000 in the next 30 days alone.",
      "Should you register voluntarily? Even if your turnover is below the threshold, voluntary registration can be beneficial. You can reclaim VAT on business purchases, it can make your business appear larger and more established, and some businesses prefer to work with VAT-registered suppliers.",
      "How to register: You can register online through the HMRC website, or your Clever Accounts accountant can handle the entire process for you. Registration typically takes a few weeks.",
      "VAT schemes: There are several VAT schemes available including the Flat Rate Scheme (simplified VAT calculation), Cash Accounting Scheme (pay VAT when you receive payment), and Annual Accounting Scheme (one annual VAT return instead of quarterly).",
      "If you're unsure about VAT registration, speak to your Clever Accounts accountant. We'll advise whether registration is right for your business and handle all the paperwork if you decide to go ahead.",
    ],
  },
};

export async function generateStaticParams() {
  const [hardcodedSlugs, sanitySlugs] = await Promise.all([
    Promise.resolve(Object.keys(HARDCODED)),
    getBlogSlugs().catch(() => [] as string[]),
  ]);
  const all = Array.from(new Set([...hardcodedSlugs, ...sanitySlugs]));
  return all.map((slug) => ({ slug }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const sanityPost = await getBlogPost(slug).catch(() => null);
  if (sanityPost) {
    const description = sanityPost.metaDescription || sanityPost.excerpt || "";
    return {
      title: sanityPost.metaTitle || sanityPost.title,
      description,
    };
  }

  const post = HARDCODED[slug];
  if (!post) return { title: "Blog Post" };
  return { title: post.title, description: post.content[0] };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try Sanity first
  const sanityPost = await getBlogPost(slug).catch(() => null);
  if (sanityPost) {
    const publishedIso = sanityPost.publishedAt
      ? new Date(sanityPost.publishedAt).toISOString()
      : new Date().toISOString();
    const displayDate = sanityPost.publishedAt
      ? new Date(sanityPost.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "";

    return (
      <>
        <BlogPostingJsonLd
          title={sanityPost.title}
          description={sanityPost.excerpt || ""}
          publishedAt={publishedIso}
          authorName="Clever Accounts"
          url={`/blog/${slug}`}
          imageUrl={sanityPost.featuredImage?.asset?.url}
        />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: sanityPost.title, url: `/blog/${slug}` },
          ]}
        />
        <section className="gradient-hero-subtle py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark mb-6">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            {sanityPost.category && (
              <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-4 capitalize">
                {sanityPost.category.replace("-", " ")}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">{sanityPost.title}</h1>
            <div className="flex items-center gap-4 text-sm text-text-light">
              {displayDate && <span className="flex items-center gap-1.5"><Calendar size={14} /> {displayDate}</span>}
              <span className="flex items-center gap-1.5"><User size={14} /> Clever Accounts</span>
            </div>
          </div>
        </section>

        <article className="bg-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 prose prose-lg">
            {sanityPost.body ? (
              <PortableText value={sanityPost.body as Parameters<typeof PortableText>[0]["value"]} />
            ) : sanityPost.excerpt ? (
              <p className="text-text leading-relaxed">{sanityPost.excerpt}</p>
            ) : (
              <p className="text-text-light italic">No content yet.</p>
            )}
          </div>
        </article>

        <section className="bg-surface py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-dark mb-4">Need Accounting Help?</h2>
            <p className="text-text-light mb-6">Our expert accountants are ready to support your business.</p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </>
    );
  }

  // Fallback to hardcoded
  const post = HARDCODED[slug];
  if (!post) {
    return (
      <section className="bg-white py-24 text-center">
        <h1 className="text-3xl font-bold text-dark mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-primary font-medium">Back to Blog</Link>
      </section>
    );
  }

  const publishedIso = new Date(post.date).toISOString();

  return (
    <>
      <BlogPostingJsonLd
        title={post.title}
        description={post.content[0]}
        publishedAt={publishedIso}
        authorName={post.author}
        url={`/blog/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${slug}` },
        ]}
      />
      <section className="gradient-hero-subtle py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark mb-6">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-4">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-text-light">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
            <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
          </div>
        </div>
      </section>

      <article className="bg-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          {post.content.map((para, i) => (
            <p key={i} className="text-text leading-relaxed">{para}</p>
          ))}
        </div>
      </article>

      <section className="bg-surface py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Need Accounting Help?</h2>
          <p className="text-text-light mb-6">Our expert accountants are ready to support your business.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
