import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getKnowledgeTopic, getKnowledgeTopicSlugs } from "@/sanity/queries";

export const revalidate = 60;

type TopicWithArticles = {
  _id: string;
  name: string;
  slug: { current: string };
  shortDescription: string;
  intro: string;
  metaTitle?: string;
  metaDescription?: string;
  articles: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    canonicalQuestion: string;
    excerpt: string;
    appliesTo?: string[];
    lastReviewed?: string;
  }>;
};

const APPLIES_TO_LABELS: Record<string, string> = {
  "sole-trader": "Sole trader",
  ltd: "Limited company",
  director: "Director",
  employer: "Employer",
  landlord: "Landlord",
  contractor: "Contractor",
  umbrella: "Umbrella worker",
};

export async function generateStaticParams() {
  const slugs = (await getKnowledgeTopicSlugs().catch(() => [])) as string[];
  return slugs.filter(Boolean).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const data = (await getKnowledgeTopic(topic).catch(() => null)) as TopicWithArticles | null;
  if (!data) return { title: "Learning Centre" };
  return {
    title: data.metaTitle || `${data.name} — guides & answers | Clever Accounts`,
    description: data.metaDescription || data.shortDescription,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const data = (await getKnowledgeTopic(topic).catch(() => null)) as TopicWithArticles | null;
  if (!data) notFound();

  const articles = data.articles ?? [];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Learning Centre", url: "/learn" },
          { name: data.name, url: `/learn/${data.slug.current}` },
        ]}
      />

      <section className="gradient-hero-subtle py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft size={16} /> Learning Centre
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-dark mb-4">{data.name}</h1>
          <p className="text-lg text-text-light leading-relaxed">{data.intro}</p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto text-text-light mb-4" size={40} />
              <p className="text-text-light">
                No articles yet for {data.name}. Check back soon.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {articles.map((a) => (
                <li key={a._id}>
                  <Link
                    href={`/learn/${data.slug.current}/${a.slug.current}`}
                    className="group block py-6 hover:bg-surface/40 -mx-4 px-4 rounded-xl transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-dark mb-2 group-hover:text-primary transition-colors">
                      {a.canonicalQuestion || a.title}
                    </h2>
                    <p className="text-text-light leading-relaxed mb-3">{a.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {(a.appliesTo ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {APPLIES_TO_LABELS[tag] || tag}
                        </span>
                      ))}
                      <span className="ml-auto text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Still got a question?</h2>
          <p className="text-text-light mb-6">
            Our team specialises in {data.name.toLowerCase()} for UK small businesses, contractors and landlords.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Speak to an accountant <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
