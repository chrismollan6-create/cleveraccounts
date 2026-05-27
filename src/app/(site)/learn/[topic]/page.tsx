import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Calendar,
  ListChecks,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getKnowledgeTopic, getKnowledgeTopicSlugs } from "@/sanity/queries";

export const dynamic = "force-dynamic";

// ── Types ────────────────────────────────────────────────────────────────────
type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  canonicalQuestion?: string;
  excerpt?: string;
  appliesTo?: string[];
  lastReviewed?: string;
};

type KeyFact = { label: string; value: string; context?: string; icon?: string };
type TimelineItem = { period: string; label: string; description?: string };
type UsefulLink = { label: string; url: string; description?: string; source?: string };
type QuickAnswer = { q: string; a: string };

type TopicWithExtras = {
  _id: string;
  name: string;
  slug: { current: string };
  shortDescription: string;
  intro: string;
  icon?: string;
  metaTitle?: string;
  metaDescription?: string;
  keyFacts?: KeyFact[];
  timeline?: TimelineItem[];
  usefulLinks?: UsefulLink[];
  quickAnswers?: QuickAnswer[];
  articles: Article[];
};

// ── Topic accent colours (full-string Tailwind classes for JIT) ────────────
type Accent = {
  bg: string;
  bgSoft: string;
  iconBg: string;
  text: string;
  hoverBorder: string;
  ring: string;
  gradient: string;
  buttonBg: string;
  buttonHover: string;
};
const ACCENTS: Record<string, Accent> = {
  "self-assessment": {
    bg: "bg-indigo-500", bgSoft: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600",
    hoverBorder: "hover:border-indigo-400", ring: "ring-indigo-200",
    gradient: "from-indigo-500 via-indigo-400 to-purple-500",
    buttonBg: "bg-indigo-600", buttonHover: "hover:bg-indigo-700",
  },
  "companies-house": {
    bg: "bg-emerald-500", bgSoft: "bg-emerald-50", iconBg: "bg-emerald-100", text: "text-emerald-600",
    hoverBorder: "hover:border-emerald-400", ring: "ring-emerald-200",
    gradient: "from-emerald-500 via-emerald-400 to-teal-500",
    buttonBg: "bg-emerald-600", buttonHover: "hover:bg-emerald-700",
  },
  vat: {
    bg: "bg-purple-500", bgSoft: "bg-purple-50", iconBg: "bg-purple-100", text: "text-purple-600",
    hoverBorder: "hover:border-purple-400", ring: "ring-purple-200",
    gradient: "from-purple-500 via-purple-400 to-fuchsia-500",
    buttonBg: "bg-purple-600", buttonHover: "hover:bg-purple-700",
  },
  "corporation-tax": {
    bg: "bg-amber-500", bgSoft: "bg-amber-50", iconBg: "bg-amber-100", text: "text-amber-600",
    hoverBorder: "hover:border-amber-400", ring: "ring-amber-200",
    gradient: "from-amber-500 via-orange-400 to-rose-500",
    buttonBg: "bg-amber-600", buttonHover: "hover:bg-amber-700",
  },
  dividends: {
    bg: "bg-rose-500", bgSoft: "bg-rose-50", iconBg: "bg-rose-100", text: "text-rose-600",
    hoverBorder: "hover:border-rose-400", ring: "ring-rose-200",
    gradient: "from-rose-500 via-pink-400 to-fuchsia-500",
    buttonBg: "bg-rose-600", buttonHover: "hover:bg-rose-700",
  },
  expenses: {
    bg: "bg-cyan-500", bgSoft: "bg-cyan-50", iconBg: "bg-cyan-100", text: "text-cyan-600",
    hoverBorder: "hover:border-cyan-400", ring: "ring-cyan-200",
    gradient: "from-cyan-500 via-sky-400 to-blue-500",
    buttonBg: "bg-cyan-600", buttonHover: "hover:bg-cyan-700",
  },
  paye: {
    bg: "bg-pink-500", bgSoft: "bg-pink-50", iconBg: "bg-pink-100", text: "text-pink-600",
    hoverBorder: "hover:border-pink-400", ring: "ring-pink-200",
    gradient: "from-pink-500 via-rose-400 to-red-500",
    buttonBg: "bg-pink-600", buttonHover: "hover:bg-pink-700",
  },
  payroll: {
    bg: "bg-pink-500", bgSoft: "bg-pink-50", iconBg: "bg-pink-100", text: "text-pink-600",
    hoverBorder: "hover:border-pink-400", ring: "ring-pink-200",
    gradient: "from-pink-500 via-rose-400 to-red-500",
    buttonBg: "bg-pink-600", buttonHover: "hover:bg-pink-700",
  },
  bookkeeping: {
    bg: "bg-teal-500", bgSoft: "bg-teal-50", iconBg: "bg-teal-100", text: "text-teal-600",
    hoverBorder: "hover:border-teal-400", ring: "ring-teal-200",
    gradient: "from-teal-500 via-emerald-400 to-cyan-500",
    buttonBg: "bg-teal-600", buttonHover: "hover:bg-teal-700",
  },
  ir35: {
    bg: "bg-orange-500", bgSoft: "bg-orange-50", iconBg: "bg-orange-100", text: "text-orange-600",
    hoverBorder: "hover:border-orange-400", ring: "ring-orange-200",
    gradient: "from-orange-500 via-amber-400 to-red-500",
    buttonBg: "bg-orange-600", buttonHover: "hover:bg-orange-700",
  },
};
const DEFAULT_ACCENT: Accent = {
  bg: "bg-primary", bgSoft: "bg-primary/5", iconBg: "bg-primary/10", text: "text-primary",
  hoverBorder: "hover:border-primary", ring: "ring-primary/20",
  gradient: "from-primary via-primary to-primary-dark",
  buttonBg: "bg-primary", buttonHover: "hover:bg-primary-dark",
};
function accentFor(slug: string): Accent {
  return ACCENTS[slug] || DEFAULT_ACCENT;
}

const APPLIES_TO_LABELS: Record<string, string> = {
  "sole-trader": "Sole trader",
  ltd: "Limited company",
  director: "Director",
  employer: "Employer",
  landlord: "Landlord",
  contractor: "Contractor",
  umbrella: "Umbrella worker",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function LucideByName({
  name,
  className,
  size = 24,
  fallback = "BookOpen",
}: {
  name?: string;
  className?: string;
  size?: number;
  fallback?: string;
}) {
  const pascalise = (n: string) =>
    n.split(/[-_]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const Lookup = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>);
  const Icon = (name && Lookup[pascalise(name)]) || Lookup[fallback] || BookOpen;
  return <Icon size={size} className={className} />;
}

export async function generateStaticParams() {
  const slugs = (await getKnowledgeTopicSlugs().catch(() => [])) as string[];
  return slugs.filter(Boolean).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const data = (await getKnowledgeTopic(topic).catch(() => null)) as TopicWithExtras | null;
  if (!data) return { title: "Learning Centre" };
  return {
    title: data.metaTitle || `${data.name} — guides & answers | Clever Accounts`,
    description: data.metaDescription || data.shortDescription,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const data = (await getKnowledgeTopic(topic).catch(() => null)) as TopicWithExtras | null;
  if (!data) notFound();

  const accent = accentFor(data.slug.current);
  const articles = data.articles ?? [];
  const keyFacts = data.keyFacts ?? [];
  const timeline = data.timeline ?? [];
  const usefulLinks = data.usefulLinks ?? [];
  const quickAnswers = data.quickAnswers ?? [];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Learning Centre", url: "/learn" },
          { name: data.name, url: `/learn/${data.slug.current}` },
        ]}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className={`relative ${accent.bgSoft} border-b border-border py-12 md:py-16 overflow-hidden`}>
        {/* very subtle dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.06) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* faint giant icon — much lower opacity than before */}
        <div
          aria-hidden
          className={`absolute -right-10 -bottom-10 ${accent.text} opacity-[0.08] pointer-events-none select-none`}
        >
          <LucideByName name={data.icon} size={300} className="rotate-12" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-primary mb-6"
          >
            <ArrowLeft size={16} /> Learning Centre
          </Link>

          <div className="flex items-start gap-5 mb-5">
            <div className={`hidden sm:flex flex-shrink-0 w-14 h-14 rounded-2xl ${accent.iconBg} ring-4 ${accent.ring} items-center justify-center`}>
              <LucideByName name={data.icon} size={28} className={accent.text} />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold bg-white ${accent.text} px-2.5 py-1 rounded-full mb-3 border border-border`}>
                <Sparkles size={12} /> Learning Centre · Topic
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-dark">{data.name}</h1>
            </div>
          </div>

          <p className="text-lg text-text-light leading-relaxed max-w-3xl">{data.intro}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 bg-white border border-border text-text px-3 py-1.5 rounded-full">
              <BookOpen size={14} className={accent.text} /> {articles.length} {articles.length === 1 ? "guide" : "guides"}
            </span>
            {keyFacts.length > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-border text-text px-3 py-1.5 rounded-full">
                <ListChecks size={14} className={accent.text} /> {keyFacts.length} key facts
              </span>
            )}
            {timeline.length > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-border text-text px-3 py-1.5 rounded-full">
                <Calendar size={14} className={accent.text} /> Annual cycle covered
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-white border border-border text-text px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-green-600" /> Reviewed by qualified accountants
            </span>
          </div>
        </div>
      </section>

      {/* ── Key facts ──────────────────────────────────────────────────── */}
      {keyFacts.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-0.5 w-8 ${accent.bg}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>Key facts</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-8">The headline figures</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {keyFacts.map((f, i) => (
                <div
                  key={`fact-${i}`}
                  className={`relative ${accent.bgSoft} border border-border rounded-2xl p-5 overflow-hidden`}
                >
                  <div
                    aria-hidden
                    className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${accent.bg} opacity-10`}
                  />
                  {f.icon && (
                    <div className={`relative inline-flex w-10 h-10 rounded-lg ${accent.iconBg} ring-4 ${accent.ring} items-center justify-center mb-3`}>
                      <LucideByName name={f.icon} className={accent.text} size={20} />
                    </div>
                  )}
                  <p className={`relative text-2xl md:text-3xl font-bold text-dark mb-1 leading-none`}>
                    {f.value}
                  </p>
                  <p className="relative text-sm font-medium text-dark mb-1">{f.label}</p>
                  {f.context && (
                    <p className="relative text-xs text-text-light">{f.context}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Timeline ───────────────────────────────────────────────────── */}
      {timeline.length > 0 && (
        <section className="bg-surface/40 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-0.5 w-8 ${accent.bg}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>Annual cycle</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-2">Key dates and deadlines</h2>
            <p className="text-text-light mb-8">The events you can&apos;t afford to miss in a typical year.</p>
            <ol className="relative border-l-2 border-border ml-3 space-y-6">
              {timeline.map((t, i) => (
                <li key={`timeline-${i}`} className="relative pl-6">
                  <span className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full ${accent.bg} ring-4 ${accent.ring} flex items-center justify-center`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <div className={`inline-block ${accent.bgSoft} ${accent.text} text-xs font-semibold px-2.5 py-1 rounded-full mb-1.5`}>
                    {t.period}
                  </div>
                  <p className="font-semibold text-dark leading-snug">{t.label}</p>
                  {t.description && (
                    <p className="text-sm text-text-light mt-1 leading-relaxed max-w-2xl">{t.description}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── Articles ───────────────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-1">
            <div className={`h-0.5 w-8 ${accent.bg}`} />
            <p className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>Guides</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-2">
            {articles.length === 0 ? `${data.name} guides — coming soon` : `Read our ${data.name} guides`}
          </h2>
          <p className="text-text-light mb-8">
            {articles.length === 0
              ? "We're writing these next. In the meantime, the key facts and resources above should cover most needs."
              : "Plain-English walkthroughs of the most common questions clients ask."}
          </p>

          {articles.length > 0 ? (
            <ul className="space-y-3">
              {articles.map((a) => (
                <li key={a._id}>
                  <Link
                    href={`/learn/${data.slug.current}/${a.slug.current}`}
                    className={`group block bg-white border border-border rounded-2xl p-5 ${accent.hoverBorder} hover:shadow-lg hover:-translate-y-0.5 transition-all`}
                  >
                    <h3 className="text-lg font-semibold text-dark mb-1.5 group-hover:text-primary transition-colors">
                      {a.canonicalQuestion || a.title}
                    </h3>
                    {a.excerpt && <p className="text-text-light leading-relaxed mb-3">{a.excerpt}</p>}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {(a.appliesTo ?? []).map((tag) => (
                        <span
                          key={tag}
                          className={`inline-block ${accent.bgSoft} ${accent.text} text-xs font-medium px-2 py-1 rounded-full`}
                        >
                          {APPLIES_TO_LABELS[tag] || tag}
                        </span>
                      ))}
                      <span className={`ml-auto font-medium ${accent.text} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                        Read <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={`${accent.bgSoft} border border-border rounded-2xl p-8 text-center`}>
              <BookOpen className={`mx-auto ${accent.text} mb-3`} size={32} />
              <p className="text-text-light max-w-md mx-auto">
                In the meantime, the key facts above + the links below should help. If you need a specific
                answer, our accountants are happy to help.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Useful links ───────────────────────────────────────────────── */}
      {usefulLinks.length > 0 && (
        <section className="bg-surface/40 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-0.5 w-8 ${accent.bg}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>Useful resources</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-8">Official tools and references</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {usefulLinks.map((l, i) => (
                <li key={`link-${i}`}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block bg-white border border-border rounded-xl p-4 ${accent.hoverBorder} hover:shadow transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${accent.iconBg} flex items-center justify-center`}>
                        <ExternalLink className={accent.text} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-dark group-hover:text-primary transition-colors leading-snug">
                          {l.label}
                        </p>
                        {l.description && (
                          <p className="text-sm text-text-light mt-0.5 leading-snug">{l.description}</p>
                        )}
                        {l.source && (
                          <p className="text-xs text-text-light mt-1 uppercase tracking-wider font-medium">
                            {l.source}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Quick answers / FAQ ────────────────────────────────────────── */}
      {quickAnswers.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-0.5 w-8 ${accent.bg}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>Quick answers</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-8">
              {data.name} FAQs
            </h2>
            <div className="space-y-3">
              {quickAnswers.map((qa, i) => (
                <details
                  key={`qa-${i}`}
                  className="group bg-white border border-border rounded-xl open:shadow-md open:border-primary/40 transition-shadow"
                >
                  <summary className="cursor-pointer list-none p-5 flex items-start gap-3 select-none">
                    <HelpCircle
                      className={`flex-shrink-0 mt-0.5 ${accent.text} transition-transform group-open:rotate-180`}
                      size={18}
                    />
                    <span className="font-semibold text-dark flex-1 leading-snug">{qa.q}</span>
                  </summary>
                  <div className="px-5 pb-5 pl-14 text-text leading-relaxed">{qa.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className={`${accent.bgSoft} border-t border-border py-12`}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className={`inline-flex w-12 h-12 rounded-xl ${accent.iconBg} ring-4 ${accent.ring} items-center justify-center mb-4`}>
            <LucideByName name={data.icon} size={24} className={accent.text} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">Still got a question about {data.name}?</h2>
          <p className="text-text-light mb-6 max-w-xl mx-auto">
            Our team specialises in {data.name.toLowerCase()} for UK small businesses, contractors and landlords.
            No obligation, no sales pitch.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-md"
          >
            Speak to an accountant <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
