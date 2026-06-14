"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/useBrand";
import {
  ArrowRight,
  Phone,
  HelpCircle,
  ChevronDown,
  Search,
  Rocket,
  MessageCircle,
  PoundSterling,
  RefreshCw,
  User,
  Building2,
  Briefcase,
  Calculator,
  Users,
  Monitor,
  Sparkles,
  X,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  faqsByCategory: Record<string, FaqItem[]>;
}

/**
 * Per-category visual treatment. If a category has no entry here, falls back to HelpCircle.
 * Keys match the human-readable labels used in faqsByCategory.
 */
const CATEGORY_META: Record<
  string,
  { icon: React.ComponentType<{ size?: number; className?: string }>; accent: string }
> = {
  "Getting Started":     { icon: Rocket,         accent: "bg-primary/10 text-primary" },
  "Services & Support":  { icon: MessageCircle,  accent: "bg-accent/10 text-accent" },
  "Pricing & Billing":   { icon: PoundSterling,  accent: "bg-secondary/10 text-secondary" },
  "Switching to Us":     { icon: RefreshCw,      accent: "bg-success/10 text-success" },
  "Sole Trader":         { icon: User,           accent: "bg-blue-100 text-blue-600" },
  "Limited Company":     { icon: Building2,      accent: "bg-purple-100 text-purple-600" },
  "Contractor / IR35":   { icon: Briefcase,      accent: "bg-amber-100 text-amber-700" },
  "VAT":                 { icon: Calculator,     accent: "bg-teal-100 text-teal-700" },
  "Payroll":             { icon: Users,          accent: "bg-rose-100 text-rose-700" },
  "Software":            { icon: Monitor,        accent: "bg-indigo-100 text-indigo-700" },
};

// Slug helper for anchor IDs (Pricing & Billing → pricing-billing)
function slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-dark hover:bg-surface transition-colors"
      >
        <span className="flex items-start gap-3 min-w-0">
          <HelpCircle size={18} className="text-primary shrink-0 mt-0.5" />
          <span className="leading-snug">{q}</span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-primary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1 text-sm text-text-light leading-relaxed border-t border-border ml-9">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPageClient({ faqsByCategory }: Props) {
  const brand = useBrand();
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const categories = useMemo(() => Object.keys(faqsByCategory), [faqsByCategory]);

  // Filter — match on question OR answer, case-insensitive
  const filtered = useMemo(() => {
    if (!query.trim()) return faqsByCategory;
    const q = query.trim().toLowerCase();
    const out: Record<string, FaqItem[]> = {};
    for (const [cat, items] of Object.entries(faqsByCategory)) {
      const matched = items.filter(
        (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      );
      if (matched.length) out[cat] = matched;
    }
    return out;
  }, [faqsByCategory, query]);

  const filteredCategories = Object.keys(filtered);
  const totalMatches = useMemo(
    () => Object.values(filtered).reduce((sum, items) => sum + items.length, 0),
    [filtered]
  );
  const isSearching = query.trim().length > 0;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Sparkles size={15} />
            {brand.id === "workwell"
              ? "Clear answers, straight away"
              : "Quick answers to common questions"}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            {brand.id === "workwell"
              ? `The detail that matters about ${brand.name} — what it costs, what's included, how switching works, the software, and what's relevant to your kind of business.`
              : `Everything you need to know about ${brand.name} — pricing, services, switching, software, and the specifics for your business type.`}
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={brand.id === "workwell" ? "Search for an answer…" : "Search questions…"}
              aria-label="Search FAQ"
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {isSearching && (
            <p className="text-white/60 text-sm mt-4">
              {totalMatches > 0
                ? `${totalMatches} ${totalMatches === 1 ? "match" : "matches"} for "${query}"`
                : `No matches for "${query}"`}
            </p>
          )}
        </div>

        {/* Wave divider — dark to white */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 md:h-16 block"
          >
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── CATEGORY PILLS (hidden during search) ──────────── */}
      {!isSearching && categories.length > 1 && (
        <section className="bg-white pt-10 pb-2">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Jump to a section</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat];
                const Icon = meta?.icon ?? HelpCircle;
                return (
                  <a
                    key={cat}
                    href={`#${slug(cat)}`}
                    className="inline-flex items-center gap-2 bg-surface hover:bg-primary/10 hover:text-primary border border-border text-sm font-semibold text-dark px-4 py-2 rounded-full transition-colors"
                  >
                    <Icon size={14} />
                    {cat}
                    <span className="text-xs text-text-light">({faqsByCategory[cat].length})</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ LIST ────────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 space-y-14">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-text-light" />
              </div>
              <h2 className="text-xl font-black text-dark mb-2">
                {brand.id === "workwell" ? "Nothing matched your search" : "No matching questions"}
              </h2>
              <p className="text-text-light text-sm max-w-md mx-auto mb-6">
                {brand.id === "workwell"
                  ? "Try another wording, or contact us and we'll answer you directly."
                  : "Try a different search term, or get in touch and we'll answer it directly."}
              </p>
              <button
                onClick={() => setQuery("")}
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => {
              const items = filtered[category];
              const meta = CATEGORY_META[category];
              const Icon = meta?.icon ?? HelpCircle;
              const accent = meta?.accent ?? "bg-primary/10 text-primary";

              return (
                <div key={category} id={slug(category)} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <h2 className="text-2xl font-black text-dark">{category}</h2>
                    <span className="text-text-light text-sm font-medium">({items.length})</span>
                  </div>
                  <div className="space-y-3">
                    {items.map((faq, i) => {
                      const key = `${category}:${i}`;
                      // When searching, expand all matches by default for scannability
                      const open = isSearching ? true : openKey === key;
                      return (
                        <FAQItem
                          key={key}
                          q={faq.q}
                          a={faq.a}
                          open={open}
                          onToggle={() => setOpenKey(openKey === key ? null : key)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">
            {brand.id === "workwell" ? "Something Not Covered?" : "Still Have Questions?"}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-5">
            {brand.id === "workwell"
              ? "Speak to an accountant who understands your business"
              : "Talk to someone who knows your business"}
          </h2>
          <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {brand.id === "workwell"
              ? "During business hours we reply in under 2 hours. No call centres and no scripted lines — just a UK accountant giving you a clear, direct answer."
              : "Our team responds in under 2 hours during business hours. No call centres, no scripted answers — just a UK accountant who can give you a straight answer."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-lg"
            >
              Contact Us <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/30"
            >
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
