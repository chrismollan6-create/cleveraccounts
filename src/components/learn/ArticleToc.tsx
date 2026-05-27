"use client";

import { useEffect, useState } from "react";

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/**
 * Sticky table of contents column. Renders only on lg+ screens (`hidden lg:block`
 * upstream); scroll-spies the visible heading and highlights it.
 */
export default function ArticleToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;

    function onScroll() {
      // Pick the heading whose top is just above the 30%-from-top mark
      const threshold = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) current = h.id;
      }
      if (current) setActiveId(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-light mb-3">On this page</p>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block py-1 leading-snug transition-colors border-l-2 pl-3 -ml-3 ${
                activeId === h.id
                  ? "text-primary border-primary font-medium"
                  : "text-text-light border-transparent hover:text-dark hover:border-border"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
