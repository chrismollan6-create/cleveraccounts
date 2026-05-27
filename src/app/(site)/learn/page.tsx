import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  Search,
} from "lucide-react";
import { getLearnIndexData } from "@/sanity/queries";
import LearnSearch, { type SearchableArticle } from "@/components/learn/LearnSearch";

export const metadata: Metadata = {
  title: "Learning Centre — UK accounting & tax guides | Clever Accounts",
  description:
    "Clear, no-jargon guides on VAT, Self-Assessment, PAYE, Corporation Tax, expenses, dividends and more — written and reviewed by qualified UK accountants.",
};

export const dynamic = "force-dynamic";

type IndexTopic = {
  _id: string;
  name: string;
  slug: { current: string };
  shortDescription: string;
  icon?: string;
  articleCount?: number;
  articles?: Array<{ _id: string; title: string; slug: { current: string }; canonicalQuestion?: string }>;
};

type IndexArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  canonicalQuestion?: string;
  excerpt?: string;
  lastReviewed?: string;
  appliesTo?: string[];
  topic?: { name: string; slug: { current: string } };
};

type IndexData = {
  topics: IndexTopic[];
  featured: IndexArticle | null;
  latest: IndexArticle[];
  allArticles: SearchableArticle[];
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

// Per-topic accent palette. Full Tailwind class strings so the JIT keeps them.
type TopicAccent = {
  iconBg: string;
  iconText: string;
  ring: string;
  hoverBorder: string;
  bullet: string;
  cardBg: string;        // very faint tint for the card background
  blobBg: string;        // decorative blob colour
  tagBg: string;         // small chip colour
  hoverShadow: string;   // glow shadow on hover
};
const DEFAULT_ACCENT: TopicAccent = {
  iconBg: "bg-primary/10", iconText: "text-primary", ring: "ring-primary/20",
  hoverBorder: "hover:border-primary", bullet: "text-primary",
  cardBg: "bg-gradient-to-br from-white to-primary/5", blobBg: "bg-primary/20",
  tagBg: "bg-primary/10 text-primary", hoverShadow: "hover:shadow-primary/10",
};
const TOPIC_ACCENTS: Record<string, TopicAccent> = {
  "self-assessment": {
    iconBg: "bg-indigo-100", iconText: "text-indigo-600", ring: "ring-indigo-200",
    hoverBorder: "hover:border-indigo-400", bullet: "text-indigo-500",
    cardBg: "bg-gradient-to-br from-white to-indigo-50", blobBg: "bg-indigo-200",
    tagBg: "bg-indigo-100 text-indigo-700", hoverShadow: "hover:shadow-indigo-200/60",
  },
  "companies-house": {
    iconBg: "bg-emerald-100", iconText: "text-emerald-600", ring: "ring-emerald-200",
    hoverBorder: "hover:border-emerald-400", bullet: "text-emerald-500",
    cardBg: "bg-gradient-to-br from-white to-emerald-50", blobBg: "bg-emerald-200",
    tagBg: "bg-emerald-100 text-emerald-700", hoverShadow: "hover:shadow-emerald-200/60",
  },
  vat: {
    iconBg: "bg-purple-100", iconText: "text-purple-600", ring: "ring-purple-200",
    hoverBorder: "hover:border-purple-400", bullet: "text-purple-500",
    cardBg: "bg-gradient-to-br from-white to-purple-50", blobBg: "bg-purple-200",
    tagBg: "bg-purple-100 text-purple-700", hoverShadow: "hover:shadow-purple-200/60",
  },
  "corporation-tax": {
    iconBg: "bg-amber-100", iconText: "text-amber-600", ring: "ring-amber-200",
    hoverBorder: "hover:border-amber-400", bullet: "text-amber-500",
    cardBg: "bg-gradient-to-br from-white to-amber-50", blobBg: "bg-amber-200",
    tagBg: "bg-amber-100 text-amber-700", hoverShadow: "hover:shadow-amber-200/60",
  },
  dividends: {
    iconBg: "bg-rose-100", iconText: "text-rose-600", ring: "ring-rose-200",
    hoverBorder: "hover:border-rose-400", bullet: "text-rose-500",
    cardBg: "bg-gradient-to-br from-white to-rose-50", blobBg: "bg-rose-200",
    tagBg: "bg-rose-100 text-rose-700", hoverShadow: "hover:shadow-rose-200/60",
  },
  expenses: {
    iconBg: "bg-cyan-100", iconText: "text-cyan-600", ring: "ring-cyan-200",
    hoverBorder: "hover:border-cyan-400", bullet: "text-cyan-500",
    cardBg: "bg-gradient-to-br from-white to-cyan-50", blobBg: "bg-cyan-200",
    tagBg: "bg-cyan-100 text-cyan-700", hoverShadow: "hover:shadow-cyan-200/60",
  },
  paye: {
    iconBg: "bg-pink-100", iconText: "text-pink-600", ring: "ring-pink-200",
    hoverBorder: "hover:border-pink-400", bullet: "text-pink-500",
    cardBg: "bg-gradient-to-br from-white to-pink-50", blobBg: "bg-pink-200",
    tagBg: "bg-pink-100 text-pink-700", hoverShadow: "hover:shadow-pink-200/60",
  },
  payroll: {
    iconBg: "bg-pink-100", iconText: "text-pink-600", ring: "ring-pink-200",
    hoverBorder: "hover:border-pink-400", bullet: "text-pink-500",
    cardBg: "bg-gradient-to-br from-white to-pink-50", blobBg: "bg-pink-200",
    tagBg: "bg-pink-100 text-pink-700", hoverShadow: "hover:shadow-pink-200/60",
  },
  bookkeeping: {
    iconBg: "bg-teal-100", iconText: "text-teal-600", ring: "ring-teal-200",
    hoverBorder: "hover:border-teal-400", bullet: "text-teal-500",
    cardBg: "bg-gradient-to-br from-white to-teal-50", blobBg: "bg-teal-200",
    tagBg: "bg-teal-100 text-teal-700", hoverShadow: "hover:shadow-teal-200/60",
  },
  ir35: {
    iconBg: "bg-orange-100", iconText: "text-orange-600", ring: "ring-orange-200",
    hoverBorder: "hover:border-orange-400", bullet: "text-orange-500",
    cardBg: "bg-gradient-to-br from-white to-orange-50", blobBg: "bg-orange-200",
    tagBg: "bg-orange-100 text-orange-700", hoverShadow: "hover:shadow-orange-200/60",
  },
};
function accentFor(slug?: string): TopicAccent {
  if (!slug) return DEFAULT_ACCENT;
  return TOPIC_ACCENTS[slug] || DEFAULT_ACCENT;
}

function TopicIcon({ name, accent, size = 24 }: { name?: string; accent: TopicAccent; size?: number }) {
  const fallback = <BookOpen className={accent.iconText} size={size} />;
  if (!name) return fallback;
  const pascal = name
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[pascal];
  if (!Icon) return fallback;
  return <Icon className={accent.iconText} size={size} />;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

// Subtle inline-SVG dot grid used as a hero background. Sized at 24×24 so it
// tiles softly across the section. Two layers (dark + light) for depth.
const HERO_PATTERN_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.06) 1px, transparent 0)",
  backgroundSize: "24px 24px",
};

export default async function LearnIndexPage() {
  const data = (await getLearnIndexData().catch(() => ({
    topics: [],
    featured: null,
    latest: [],
    allArticles: [],
  }))) as IndexData;

  const { topics, featured, latest, allArticles } = data;
  const hasContent = topics.length > 0 || latest.length > 0;

  // Pick up to 4 popular suggestions from the latest articles
  const popular = latest.slice(0, 4);

  return (
    <>
      {/* ── Hero (matches pricing/marketing dark-hero pattern) ──────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Sparkles size={14} className="text-secondary" />
            Learning Centre
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Plain-English answers to the<br />
            <span className="text-gradient">UK tax questions</span> that actually come up
          </h1>
          <p className="text-lg text-white/75 max-w-2xl mx-auto mb-10">
            Guides written and reviewed by qualified accountants — kept up to date so you can trust what you read.
          </p>

          <LearnSearch articles={allArticles ?? []} />

          {/* Popular searches */}
          {popular.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-white/60 inline-flex items-center gap-1.5"><Search size={12} /> Popular:</span>
              {popular.map((a) => (
                <Link
                  key={a._id}
                  href={`/learn/${a.topic?.slug.current}/${a.slug.current}`}
                  className="inline-flex items-center bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 text-white/80 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                >
                  {a.topic?.name}: {(a.canonicalQuestion || a.title).replace(/\?+$/, "")
                    .split(" ")
                    .slice(0, 6)
                    .join(" ")}
                  …
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* SVG wave divider between hero and trust band */}
      <div aria-hidden className="relative -mt-px">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-12 md:h-20">
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ── Trust band ─────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50/60 border border-green-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/15 ring-4 ring-green-200/50 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-dark text-sm">Reviewed by qualified accountants</p>
              <p className="text-xs text-text-light leading-snug mt-0.5">Every guide carries a last-reviewed date you can verify.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/15 ring-4 ring-blue-200/50 flex items-center justify-center">
              <RefreshCw className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-dark text-sm">Updated when the rules change</p>
              <p className="text-xs text-text-light leading-snug mt-0.5">HMRC and Companies House change yearly — so do these guides.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/15 ring-4 ring-purple-200/50 flex items-center justify-center">
              <MessageSquare className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-dark text-sm">Plain English, no jargon</p>
              <p className="text-xs text-text-light leading-snug mt-0.5">Written the way clients actually ask — not the way HMRC writes.</p>
            </div>
          </div>
        </div>
      </section>

      {!hasContent ? (
        <section className="bg-white py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-text-light">
              The learning centre is being set up — check back soon.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* ── Featured article ──────────────────────────────────────────── */}
          {featured && (
            <section className="bg-white pt-12 pb-6">
              <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Featured</p>
                </div>
                <Link
                  href={`/learn/${featured.topic?.slug.current}/${featured.slug.current}`}
                  className="group relative block bg-gradient-to-br from-primary/5 via-white to-primary/15 border border-primary/20 rounded-3xl p-8 md:p-12 hover:shadow-2xl hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  {/* decorative accent */}
                  <div
                    aria-hidden
                    className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
                  />
                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {featured.topic && (
                        <span className="inline-flex items-center text-xs font-semibold text-primary bg-white px-2.5 py-1 rounded-full border border-primary/20">
                          {featured.topic.name}
                        </span>
                      )}
                      {(featured.appliesTo ?? []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-white border border-border text-text text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {APPLIES_TO_LABELS[tag] || tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-dark mb-3 leading-tight group-hover:text-primary transition-colors">
                      {featured.canonicalQuestion || featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-text-light leading-relaxed text-base md:text-lg max-w-3xl mb-6">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-primary group-hover:gap-2 transition-all">
                        Read the guide <ArrowRight size={14} />
                      </span>
                      {featured.lastReviewed && (
                        <span className="inline-flex items-center gap-1.5 text-text-light">
                          <ShieldCheck size={14} /> Reviewed {formatDate(featured.lastReviewed)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* ── Topic grid ────────────────────────────────────────────────── */}
          <section className="bg-white py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-0.5 w-8 bg-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">Topics</p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-dark mb-1">Browse by topic</h2>
                  <p className="text-text-light">
                    {topics.length} topic{topics.length === 1 ? "" : "s"}
                    {allArticles.length > 0 ? ` · ${allArticles.length} guide${allArticles.length === 1 ? "" : "s"}` : ""},
                    growing every month.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((t) => {
                  const accent = accentFor(t.slug.current);
                  const count = t.articleCount ?? 0;
                  return (
                    <Link
                      key={t._id}
                      href={`/learn/${t.slug.current}`}
                      className={`group relative flex flex-col ${accent.cardBg} border border-border rounded-2xl p-6 ${accent.hoverBorder} hover:shadow-2xl ${accent.hoverShadow} hover:-translate-y-1 transition-all overflow-hidden`}
                    >
                      {/* decorative corner blob */}
                      <div
                        aria-hidden
                        className={`absolute -top-12 -right-12 w-40 h-40 rounded-full ${accent.blobBg} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity pointer-events-none`}
                      />
                      <div className="relative flex items-start justify-between mb-5">
                        <div className={`w-14 h-14 rounded-2xl ${accent.iconBg} ring-4 ${accent.ring} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                          <TopicIcon name={t.icon} accent={accent} size={28} />
                        </div>
                        {count > 0 ? (
                          <span className={`text-xs font-semibold ${accent.tagBg} px-2.5 py-1 rounded-full inline-flex items-center gap-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${accent.iconText.replace("text-", "bg-")}`} />
                            {count} {count === 1 ? "guide" : "guides"}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-text-light bg-white/70 backdrop-blur px-2.5 py-1 rounded-full italic border border-border">
                            Coming soon
                          </span>
                        )}
                      </div>
                      <h3 className={`relative text-2xl font-bold text-dark mb-2 transition-colors group-hover:${accent.iconText}`}>
                        {t.name}
                      </h3>
                      <p className="relative text-text-light text-sm leading-relaxed mb-4 flex-1">
                        {t.shortDescription}
                      </p>
                      {(t.articles ?? []).length > 0 && (
                        <ul className="relative border-t border-border/60 pt-3 mt-auto space-y-1.5">
                          {(t.articles ?? []).map((a) => (
                            <li key={a._id} className="text-sm text-text leading-snug flex items-start gap-1.5">
                              <span className={`${accent.bullet} mt-0.5 font-bold flex-shrink-0`}>→</span>
                              <span className="line-clamp-1">{a.canonicalQuestion || a.title}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className={`relative mt-4 text-sm font-semibold ${accent.iconText} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                        Explore <ArrowRight size={14} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Latest articles ───────────────────────────────────────────── */}
          {latest.length > 0 && (
            <section className="relative bg-surface/40 py-12 overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-40"
                style={HERO_PATTERN_STYLE}
              />
              <div className="relative max-w-6xl mx-auto px-4">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-0.5 w-8 bg-primary" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Latest</p>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-dark mb-1">Recently updated</h2>
                    <p className="text-text-light">Latest guides reviewed by our accountants.</p>
                  </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {latest.map((a) => {
                    const accent = accentFor(a.topic?.slug.current);
                    return (
                      <li key={a._id}>
                        <Link
                          href={`/learn/${a.topic?.slug.current}/${a.slug.current}`}
                          className={`group block h-full bg-white border border-border rounded-2xl p-5 ${accent.hoverBorder} hover:shadow-lg hover:-translate-y-0.5 transition-all`}
                        >
                          <div className="flex items-center gap-2 text-xs mb-3">
                            {a.topic && (
                              <span className={`font-semibold ${accent.iconText}`}>{a.topic.name}</span>
                            )}
                            {a.lastReviewed && (
                              <span className="text-text-light inline-flex items-center gap-1">
                                <Clock size={11} /> {formatDate(a.lastReviewed)}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-dark mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {a.canonicalQuestion || a.title}
                          </h3>
                          {a.excerpt && (
                            <p className="text-sm text-text-light line-clamp-2 leading-snug">{a.excerpt}</p>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Final CTA (white — matches pricing's bottom CTA so the dark footer has a clean break) ─ */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Can&apos;t find it?
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
            Ask one of our accountants
          </h2>
          <p className="text-text-light mb-8 max-w-xl mx-auto leading-relaxed">
            Our team will answer any UK tax or accounting question — no obligation, no sales pitch.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary-dark transition-colors shadow-lg"
          >
            Ask an accountant <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
