"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";

export type SearchableArticle = {
  _id: string;
  title: string;
  slug: string;
  canonicalQuestion?: string;
  excerpt?: string;
  appliesTo?: string[];
  topicName?: string;
  topicSlug?: string;
};

/** Substring + token scoring. Higher = better match. */
function score(article: SearchableArticle, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const tokens = q.split(/\s+/).filter(Boolean);
  const title = (article.title || "").toLowerCase();
  const question = (article.canonicalQuestion || "").toLowerCase();
  const excerpt = (article.excerpt || "").toLowerCase();
  const topic = (article.topicName || "").toLowerCase();
  const tags = (article.appliesTo || []).join(" ").toLowerCase();
  let s = 0;
  if (title === q) s += 100;
  if (title.includes(q)) s += 40;
  if (question.includes(q)) s += 30;
  if (topic.includes(q)) s += 20;
  if (excerpt.includes(q)) s += 10;
  if (tags.includes(q)) s += 10;
  for (const t of tokens) {
    if (title.includes(t)) s += 5;
    if (question.includes(t)) s += 4;
    if (excerpt.includes(t)) s += 2;
    if (topic.includes(t)) s += 3;
  }
  return s;
}

const APPLIES_TO_LABELS: Record<string, string> = {
  "sole-trader": "Sole trader",
  ltd: "Ltd",
  director: "Director",
  employer: "Employer",
  landlord: "Landlord",
  contractor: "Contractor",
  umbrella: "Umbrella",
};

export default function LearnSearch({
  articles,
  placeholder = "Search guides… try 'VAT', 'S455', 'mileage'",
}: {
  articles: SearchableArticle[];
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: "/" focuses the input from anywhere on the page
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside closes dropdown
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return articles
      .map((a) => ({ a, s: score(a, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((r) => r.a);
  }, [query, articles]);

  const navigate = useCallback(
    (a: SearchableArticle) => {
      if (a.topicSlug && a.slug) {
        router.push(`/learn/${a.topicSlug}/${a.slug}`);
        setOpen(false);
        setQuery("");
      }
    },
    [router]
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const choice = results[highlight];
      if (choice) navigate(choice);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search the learning centre"
          className="w-full bg-white border border-border rounded-2xl pl-11 pr-12 py-4 text-base text-dark placeholder:text-text-light shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-light hover:text-dark hover:bg-surface transition-colors"
          >
            <X size={16} />
          </button>
        ) : (
          <kbd className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center gap-1 text-xs text-text-light bg-surface border border-border rounded-md px-1.5 py-0.5">
            /
          </kbd>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-xl overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="p-6 text-center text-text-light text-sm">
              No matches for &ldquo;{query}&rdquo;. Try a different word, or{" "}
              <a href="/contact" className="text-primary underline">
                ask an accountant
              </a>
              .
            </div>
          ) : (
            <ul className="max-h-[28rem] overflow-y-auto">
              {results.map((a, i) => (
                <li key={a._id}>
                  <button
                    type="button"
                    onClick={() => navigate(a)}
                    onMouseEnter={() => setHighlight(i)}
                    className={`group w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border last:border-b-0 transition-colors ${
                      highlight === i ? "bg-primary/5" : "hover:bg-surface/60"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-text-light mb-1">
                        {a.topicName && (
                          <span className="font-medium text-primary">{a.topicName}</span>
                        )}
                        {(a.appliesTo ?? []).slice(0, 2).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-surface text-text rounded">
                            {APPLIES_TO_LABELS[t] || t}
                          </span>
                        ))}
                      </div>
                      <div className="font-semibold text-dark truncate group-hover:text-primary transition-colors">
                        {a.canonicalQuestion || a.title}
                      </div>
                      {a.excerpt && (
                        <div className="text-sm text-text-light line-clamp-1 mt-0.5">{a.excerpt}</div>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      className={`mt-1 transition-all ${highlight === i ? "text-primary translate-x-0.5" : "text-text-light"}`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
