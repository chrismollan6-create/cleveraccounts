import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { SchemaRenderer, type PageSchemaItem } from "@/components/seo/SchemaRenderer";
import {
  HtmlEmbedBlock,
  FaqBlockRenderer,
  HowToBlockRenderer,
  CtaBlockRenderer,
} from "@/components/blog/PortableTextBlocks";
import { getKnowledgeArticle, getKnowledgeArticleSlugs } from "@/sanity/queries";
import ArticleToc from "@/components/learn/ArticleToc";
import ReadingProgressBar from "@/components/learn/ReadingProgressBar";
import WasThisHelpful from "@/components/learn/WasThisHelpful";
import { extractHeadings, estimateReadingTimeMinutes, slugifyHeading } from "@/components/learn/bodyUtils";

export const dynamic = "force-dynamic";

const APPLIES_TO_LABELS: Record<string, string> = {
  "sole-trader": "Sole trader",
  ltd: "Limited company",
  director: "Director",
  employer: "Employer",
  landlord: "Landlord",
  contractor: "Contractor",
  umbrella: "Umbrella worker",
};

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  canonicalQuestion: string;
  excerpt: string;
  appliesTo?: string[];
  lastReviewed?: string;
  reviewedBy?: string;
  featuredImage?: { alt?: string; asset?: { url: string } };
  body?: unknown[];
  metaTitle?: string;
  metaDescription?: string;
  pageSchemas?: unknown[];
  topic: { _id: string; name: string; slug: { current: string } };
  relatedArticles?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    canonicalQuestion?: string;
    excerpt?: string;
    topic?: { name: string; slug: { current: string } };
  }>;
};

/** Extract plain text from a PortableText block's children — used for heading anchors. */
function blockText(value: { children?: Array<{ _type?: string; text?: string }> } | undefined): string {
  return (value?.children ?? [])
    .filter((c) => c?._type === "span" && typeof c.text === "string")
    .map((c) => c.text!)
    .join("");
}

const ptComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => {
      const id = slugifyHeading(blockText(value as { children?: Array<{ _type?: string; text?: string }> }));
      return (
        <h2 id={id} className="text-2xl md:text-3xl font-bold text-dark mt-10 mb-4 leading-tight scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const id = slugifyHeading(blockText(value as { children?: Array<{ _type?: string; text?: string }> }));
      return (
        <h3 id={id} className="text-xl md:text-2xl font-bold text-dark mt-8 mb-3 leading-tight scroll-mt-24">
          {children}
        </h3>
      );
    },
    h4: ({ children }) => <h4 className="text-lg font-semibold text-dark mt-6 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-text-light my-6">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="text-text leading-relaxed mb-4">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-dark">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-primary underline hover:text-primary-dark"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 space-y-2 mb-4 text-text">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 space-y-2 mb-4 text-text">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    htmlEmbed: ({ value }) => <HtmlEmbedBlock html={value?.html ?? ""} />,
    faqBlock: ({ value }) => (
      <FaqBlockRenderer heading={value?.heading} faqs={value?.faqs ?? []} />
    ),
    howToBlock: ({ value }) => (
      <HowToBlockRenderer
        name={value?.name ?? ""}
        description={value?.description}
        steps={value?.steps ?? []}
      />
    ),
    ctaBlock: ({ value }) => (
      <CtaBlockRenderer
        heading={value?.heading ?? ""}
        subheading={value?.subheading}
        buttonText={value?.buttonText}
        buttonHref={value?.buttonHref}
      />
    ),
  },
};

export async function generateStaticParams() {
  const slugs = (await getKnowledgeArticleSlugs().catch(() => [])) as Array<{
    topicSlug: string;
    articleSlug: string;
  }>;
  return slugs
    .filter((s) => s?.topicSlug && s?.articleSlug)
    .map((s) => ({ topic: s.topicSlug, slug: s.articleSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}): Promise<Metadata> {
  const { topic, slug } = await params;
  const article = (await getKnowledgeArticle(topic, slug).catch(() => null)) as Article | null;
  if (!article) return { title: "Article" };
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
  };
}

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;
  const article = (await getKnowledgeArticle(topic, slug).catch(() => null)) as Article | null;
  if (!article) notFound();

  const lastReviewed = formatDate(article.lastReviewed);
  const headings = extractHeadings(article.body);
  const readingTime = estimateReadingTimeMinutes(article.body);
  const hasBody = Array.isArray(article.body) && article.body.length > 0;

  return (
    <>
      <ReadingProgressBar />

      <BlogPostingJsonLd
        title={article.title}
        description={article.excerpt}
        publishedAt={article.lastReviewed || new Date().toISOString()}
        authorName={article.reviewedBy || "Clever Accounts"}
        url={`/learn/${article.topic.slug.current}/${article.slug.current}`}
        imageUrl={article.featuredImage?.asset?.url}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Learning Centre", url: "/learn" },
          { name: article.topic.name, url: `/learn/${article.topic.slug.current}` },
          {
            name: article.title,
            url: `/learn/${article.topic.slug.current}/${article.slug.current}`,
          },
        ]}
      />
      <SchemaRenderer
        schemas={article.pageSchemas as PageSchemaItem[] | undefined}
        fallbackUrl={`/learn/${article.topic.slug.current}/${article.slug.current}`}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="gradient-hero-subtle py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href={`/learn/${article.topic.slug.current}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft size={16} /> {article.topic.name}
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {(article.appliesTo ?? []).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                {APPLIES_TO_LABELS[tag] || tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-dark mb-4 leading-tight">{article.title}</h1>
          {article.excerpt && (
            <p className="text-lg text-text-light leading-relaxed mb-6">{article.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {lastReviewed && (
              <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-700 px-3 py-1.5 rounded-full">
                <ShieldCheck size={14} />
                Reviewed by an accountant on {lastReviewed}
                {article.reviewedBy ? ` (${article.reviewedBy})` : ""}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-text-light">
              <Clock size={14} /> {readingTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* ── Article body + TOC ─────────────────────────────────────────── */}
      <article className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr,16rem] gap-12">
          <div className="min-w-0">
            {hasBody ? (
              <PortableText
                value={article.body as Parameters<typeof PortableText>[0]["value"]}
                components={ptComponents}
              />
            ) : (
              <p className="text-text-light italic">Content coming soon.</p>
            )}

            <WasThisHelpful articleId={article._id} />
          </div>

          {headings.length >= 2 && (
            <aside className="hidden lg:block">
              <ArticleToc headings={headings} />
            </aside>
          )}
        </div>
      </article>

      {/* ── Related ────────────────────────────────────────────────────── */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <section className="bg-surface py-12">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark mb-6">Related articles</h2>
            <ul className="space-y-4">
              {article.relatedArticles.map((r) => (
                <li key={r._id}>
                  <Link
                    href={`/learn/${r.topic?.slug.current}/${r.slug.current}`}
                    className="group block bg-white border border-border rounded-xl p-5 hover:border-primary hover:shadow transition-all"
                  >
                    <h3 className="font-semibold text-dark mb-1 group-hover:text-primary transition-colors">
                      {r.canonicalQuestion || r.title}
                    </h3>
                    {r.excerpt && <p className="text-sm text-text-light">{r.excerpt}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-primary/5 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Want this handled for you?</h2>
          <p className="text-text-light mb-6">
            Our accountants do the work, file with HMRC and keep you compliant — from £42.50/month.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Book a free consultation <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
