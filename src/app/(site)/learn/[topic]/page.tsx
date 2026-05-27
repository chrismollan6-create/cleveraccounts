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

// Per-topic accent palettes. Topic-coloured chrome (hero tint, accent strips,
// key-fact values, timeline chips) gives each topic its own identity. Primary
// CTAs (Book a consultation buttons) stay brand primary — that's the
// throughline back to the brand.
type Accent = {
  iconBg: string;
  iconText: string;
  ring: string;
  bg: string;
  bgSoft: string;
  text: string;
  hoverBorder: string;
  gradient: string;
};
const ACCENTS: Record<string, Accent> = {
  "self-assessment": {
    iconBg: "bg-indigo-100", iconText: "text-indigo-600", ring: "ring-indigo-100",
    bg: "bg-indigo-500", bgSoft: "bg-indigo-50", text: "text-indigo-600",
    hoverBorder: "hover:border-indigo-400",
    gradient: "from-indigo-500 to-indigo-700",
  },
  "companies-house": {
    iconBg: "bg-emerald-100", iconText: "text-emerald-600", ring: "ring-emerald-100",
    bg: "bg-emerald-500", bgSoft: "bg-emerald-50", text: "text-emerald-600",
    hoverBorder: "hover:border-emerald-400",
    gradient: "from-emerald-500 to-emerald-700",
  },
  vat: {
    iconBg: "bg-purple-100", iconText: "text-purple-600", ring: "ring-purple-100",
    bg: "bg-purple-500", bgSoft: "bg-purple-50", text: "text-purple-600",
    hoverBorder: "hover:border-purple-400",
    gradient: "from-purple-500 to-purple-700",
  },
  "corporation-tax": {
    iconBg: "bg-amber-100", iconText: "text-amber-600", ring: "ring-amber-100",
    bg: "bg-amber-500", bgSoft: "bg-amber-50", text: "text-amber-600",
    hoverBorder: "hover:border-amber-400",
    gradient: "from-amber-500 to-amber-700",
  },
  dividends: {
    iconBg: "bg-rose-100", iconText: "text-rose-600", ring: "ring-rose-100",
    bg: "bg-rose-500", bgSoft: "bg-rose-50", text: "text-rose-600",
    hoverBorder: "hover:border-rose-400",
    gradient: "from-rose-500 to-rose-700",
  },
  expenses: {
    iconBg: "bg-cyan-100", iconText: "text-cyan-600", ring: "ring-cyan-100",
    bg: "bg-cyan-500", bgSoft: "bg-cyan-50", text: "text-cyan-600",
    hoverBorder: "hover:border-cyan-400",
    gradient: "from-cyan-500 to-cyan-700",
  },
  paye: {
    iconBg: "bg-pink-100", iconText: "text-pink-600", ring: "ring-pink-100",
    bg: "bg-pink-500", bgSoft: "bg-pink-50", text: "text-pink-600",
    hoverBorder: "hover:border-pink-400",
    gradient: "from-pink-500 to-pink-700",
  },
  payroll: {
    iconBg: "bg-pink-100", iconText: "text-pink-600", ring: "ring-pink-100",
    bg: "bg-pink-500", bgSoft: "bg-pink-50", text: "text-pink-600",
    hoverBorder: "hover:border-pink-400",
    gradient: "from-pink-500 to-pink-700",
  },
  bookkeeping: {
    iconBg: "bg-teal-100", iconText: "text-teal-600", ring: "ring-teal-100",
    bg: "bg-teal-500", bgSoft: "bg-teal-50", text: "text-teal-600",
    hoverBorder: "hover:border-teal-400",
    gradient: "from-teal-500 to-teal-700",
  },
  ir35: {
    iconBg: "bg-orange-100", iconText: "text-orange-600", ring: "ring-orange-100",
    bg: "bg-orange-500", bgSoft: "bg-orange-50", text: "text-orange-600",
    hoverBorder: "hover:border-orange-400",
    gradient: "from-orange-500 to-orange-700",
  },
};
const DEFAULT_ACCENT: Accent = {
  iconBg: "bg-primary/10", iconText: "text-primary", ring: "ring-primary/20",
  bg: "bg-primary", bgSoft: "bg-primary/5", text: "text-primary",
  hoverBorder: "hover:border-primary",
  gradient: "from-primary to-primary-dark",
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

      {/* ── Hero (matches pricing/marketing dark-hero pattern) ─────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={16} /> Learning Centre
          </Link>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Sparkles size={14} className="text-secondary" />
            Learning Centre · {data.name}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            <span className="text-gradient">{data.name}</span>
          </h1>

          <p className="text-lg text-white/75 leading-relaxed max-w-3xl mb-8">{data.intro}</p>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 rounded-full px-4 py-2 font-semibold">
              <BookOpen size={14} className="text-primary-light" /> {articles.length} {articles.length === 1 ? "guide" : "guides"}
            </span>
            {keyFacts.length > 0 && (
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 rounded-full px-4 py-2 font-semibold">
                <ListChecks size={14} className="text-primary-light" /> {keyFacts.length} key facts
              </span>
            )}
            {timeline.length > 0 && (
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 rounded-full px-4 py-2 font-semibold">
                <Calendar size={14} className="text-primary-light" /> Annual cycle covered
              </span>
            )}
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 rounded-full px-4 py-2 font-semibold">
              <ShieldCheck size={14} className="text-green-400" /> Reviewed by qualified accountants
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
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
            {/* Flex-wrap so a row of 5 facts fits on one line on lg+, wraps cleanly below. */}
            <div className="flex flex-wrap gap-3">
              {keyFacts.map((f, i) => (
                <div
                  key={`fact-${i}`}
                  className="relative flex-1 min-w-[170px] bg-white border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
                >
                  {f.icon && (
                    <div className={`inline-flex w-9 h-9 rounded-lg ${accent.iconBg} items-center justify-center mb-2.5`}>
                      <LucideByName name={f.icon} className={accent.iconText} size={18} />
                    </div>
                  )}
                  <p className={`text-xl md:text-2xl font-bold ${accent.text} mb-1 leading-tight`}>
                    {f.value}
                  </p>
                  <p className="text-sm font-medium text-dark leading-snug mb-1">{f.label}</p>
                  {f.context && (
                    <p className="text-xs text-text-light leading-snug">{f.context}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Timeline ───────────────────────────────────────────────────── */}
      {timeline.length > 0 && (
        <section className="relative bg-surface/40 border-t border-border py-12 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.04) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-4">
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
      <section className={`relative ${accent.bgSoft} border-y border-border py-14 overflow-hidden`}>
        {/* one subtle decorative blob (down from two) */}
        <div
          aria-hidden
          className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full ${accent.bg} opacity-[0.06] blur-3xl pointer-events-none`}
        />

        <div className="relative max-w-5xl mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex-1 min-w-0">
              <div className={`inline-flex items-center gap-2 bg-primary/10 ${accent.text} text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3`}>
                <BookOpen size={12} />
                {articles.length === 0 ? "Coming soon" : `${articles.length} ${articles.length === 1 ? "guide" : "guides"} ready to read`}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-dark leading-tight">
                {articles.length === 0 ? `${data.name} guides` : `Read our ${data.name} guides`}
              </h2>
              <p className="text-text-light text-base mt-2 max-w-2xl">
                {articles.length === 0
                  ? "We're writing these next. In the meantime, the key facts and resources should cover most needs."
                  : "Plain-English walkthroughs of the most common questions clients ask."}
              </p>
            </div>
            {/* Only show the big icon panel once we have a reasonable number of guides — otherwise it dwarfs the content */}
            {articles.length >= 3 && (
              <div className={`hidden md:flex flex-shrink-0 w-16 h-16 rounded-2xl ${accent.iconBg} items-center justify-center`}>
                <BookOpen className={accent.iconText} size={28} />
              </div>
            )}
          </div>

          {articles.length > 0 ? (
            <ul className="space-y-3">
              {articles.map((a, idx) => (
                <li key={a._id}>
                  <Link
                    href={`/learn/${data.slug.current}/${a.slug.current}`}
                    className={`group flex items-start gap-5 bg-white border-2 border-transparent ring-1 ring-border rounded-2xl p-6 ${accent.hoverBorder} hover:shadow-2xl hover:-translate-y-1 transition-all`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${accent.iconBg} flex items-center justify-center font-bold ${accent.text} text-lg`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {(a.appliesTo ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-surface text-text text-xs font-medium px-2 py-0.5 rounded-full"
                          >
                            {APPLIES_TO_LABELS[tag] || tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-dark mb-1.5 group-hover:text-primary transition-colors leading-snug">
                        {a.canonicalQuestion || a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-text-light leading-relaxed line-clamp-2">{a.excerpt}</p>
                      )}
                    </div>
                    <div className={`hidden sm:flex flex-shrink-0 self-center w-12 h-12 rounded-xl bg-white ring-1 ring-border items-center justify-center transition-all group-hover:${accent.iconBg} group-hover:ring-0 group-hover:scale-110`}>
                      <ArrowRight className={`${accent.text}`} size={20} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-white border border-border rounded-xl p-5 text-center text-sm text-text-light">
              No guides yet for {data.name}. In the meantime, the key facts above and the resources below
              should cover most needs — or{" "}
              <Link href="/contact" className={`font-medium ${accent.text} underline`}>
                ask an accountant
              </Link>
              .
            </div>
          )}
        </div>
      </section>

      {/* ── Useful links ───────────────────────────────────────────────── */}
      {usefulLinks.length > 0 && (
        <section className="relative bg-surface/40 border-t border-border py-12 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.04) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-0.5 w-8 ${accent.bg}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>Useful resources</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-8">Official tools and references</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
        <section className="bg-white border-t border-border py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-0.5 w-8 ${accent.bg}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>Quick answers</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-8">
              {data.name} FAQs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
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

      {/* ── CTA (matches pricing dark-CTA pattern) ─────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">
            Need help with {data.name.toLowerCase()}?
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Speak to a qualified accountant
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
            Our team specialises in {data.name.toLowerCase()} for UK small businesses, contractors and landlords.
            No obligation, no sales pitch — just a clear answer to your specific situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary-dark transition-colors shadow-lg"
            >
              Speak to an accountant <ArrowRight size={20} />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-colors border border-white/20"
            >
              Browse all topics
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
