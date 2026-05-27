import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight, BookOpen } from "lucide-react";
import { getKnowledgeTopics } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Learning Centre — UK accounting & tax guides | Clever Accounts",
  description:
    "Clear, no-jargon guides on VAT, Self-Assessment, PAYE, Corporation Tax, expenses, dividends and more — written and reviewed by qualified UK accountants.",
};

export const revalidate = 60;

type Topic = {
  _id: string;
  name: string;
  slug: { current: string };
  shortDescription: string;
  icon?: string;
  articleCount?: number;
};

function TopicIcon({ name }: { name?: string }) {
  if (!name) return <BookOpen className="text-primary" size={28} />;
  const pascal = name
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[pascal];
  if (!Icon) return <BookOpen className="text-primary" size={28} />;
  return <Icon className="text-primary" size={28} />;
}

export default async function LearnIndexPage() {
  const topics = (await getKnowledgeTopics().catch(() => [])) as Topic[];

  return (
    <>
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            Learning Centre
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Plain-English answers to the UK tax questions that actually come up
          </h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Guides written and reviewed by qualified accountants — kept up to date so you can trust what you read.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {topics.length === 0 ? (
            <p className="text-text-light text-center py-12">
              The learning centre is being set up — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((t) => (
                <Link
                  key={t._id}
                  href={`/learn/${t.slug.current}`}
                  className="group block bg-white border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <TopicIcon name={t.icon} />
                  </div>
                  <h2 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                    {t.name}
                  </h2>
                  <p className="text-text-light text-sm leading-relaxed mb-4">{t.shortDescription}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-light">
                      {t.articleCount ?? 0} {(t.articleCount ?? 0) === 1 ? "article" : "articles"}
                    </span>
                    <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-text-light mb-6">
            Our accountants are happy to answer any UK tax or accounting question — no obligation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Ask an accountant <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
