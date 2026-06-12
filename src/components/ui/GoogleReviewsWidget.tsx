"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useBrand } from "@/lib/useBrand";

const CLEVER_DEFAULT_REF = "f1e784fdf537d9876ef24e119a197eda526c4ced";

/**
 * Real reviews shown for a brand that doesn't yet have its own EmbedSocial
 * widget configured (`brand.reviewsWidgetRef`). Prevents one brand's reviews
 * leaking onto another, and keeps the section populated until the live widget
 * is connected. Replace with the live EmbedSocial widget once available.
 */
const FALLBACK_REVIEWS: Record<string, { quote: string; attribution: string }[]> = {
  workwell: [
    {
      quote:
        "Workwell has administered my company since formation in 2014. I am very happy with the quality of the service that they have provided. Danielle and Ross, in particular, have been excellent in their roles as lead client accountants.",
      attribution: "Limited company client · since 2014",
    },
    {
      quote:
        "This is a great firm to help with all accounting needs. They helped me set up my company & bank account really easily when I started my business years ago & they've been a great support on all sorts of questions since. The friendly staff are very approachable & always respond quickly to calls & emails. Thanks in particular to Letitia & her team.",
      attribution: "Small business owner",
    },
  ],
};

declare global {
  interface Window {
    EMBEDSOCIALREVIEWS?: {
      getEmbedData: (ref: string, el: HTMLElement) => void;
    };
  }
}

interface Props {
  /** Override the EmbedSocial widget reference (Clever-specific widgets only). */
  dataRef?: string;
}

export default function GoogleReviewsWidget({ dataRef }: Props = {}) {
  const brand = useBrand();
  const divRef = useRef<HTMLDivElement>(null);

  // Resolve the EmbedSocial ref for THIS brand. Clever may pass a page-specific
  // override; other brands only ever use their own configured widget (never
  // Clever's), so a passed Clever ref is ignored for non-Clever brands.
  const widgetRef =
    brand.id === "clever" ? dataRef ?? brand.reviewsWidgetRef ?? CLEVER_DEFAULT_REF : brand.reviewsWidgetRef;

  // ri.js scans `.embedsocial-reviews` once on script load (and again on
  // window.load if none were present). After SPA navigation it never re-scans,
  // so we render this widget instance explicitly. getEmbedData is idempotent —
  // it bails when an iframe already exists.
  useEffect(() => {
    if (!widgetRef) return;
    const tryRender = () => {
      const el = divRef.current;
      if (!el) return false;
      if (el.getElementsByTagName("iframe").length > 0) return true;
      const api = window.EMBEDSOCIALREVIEWS;
      if (api?.getEmbedData) {
        api.getEmbedData(widgetRef, el);
        return true;
      }
      return false;
    };

    if (tryRender()) return;
    const poll = window.setInterval(() => {
      if (tryRender()) window.clearInterval(poll);
    }, 200);
    const giveUp = window.setTimeout(() => window.clearInterval(poll), 10000);
    return () => {
      window.clearInterval(poll);
      window.clearTimeout(giveUp);
    };
  }, [widgetRef]);

  // No live widget for this brand → show its real-review fallback (or nothing).
  if (!widgetRef) {
    const fallback = FALLBACK_REVIEWS[brand.id];
    if (!fallback?.length) return null;
    return (
      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto text-left">
        {fallback.map((r) => (
          <div key={r.attribution} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-text-light leading-relaxed italic mb-4">&ldquo;{r.quote}&rdquo;</p>
            <p className="text-sm font-semibold text-dark">{r.attribution}</p>
            <p className="text-xs text-text-light mt-0.5">Verified Google review</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="embedsocial-reviews-wrapper">
      <div ref={divRef} className="embedsocial-reviews" data-ref={widgetRef} />
      <Script src="https://embedsocial.com/embedscript/ri.js" id="EmbedSocialReviewsScript" strategy="afterInteractive" />
    </div>
  );
}
