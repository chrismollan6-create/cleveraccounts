"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const DEFAULT_DATA_REF = "f1e784fdf537d9876ef24e119a197eda526c4ced";

declare global {
  interface Window {
    EMBEDSOCIALREVIEWS?: {
      getEmbedData: (ref: string, el: HTMLElement) => void;
    };
  }
}

interface Props {
  /** Override the EmbedSocial widget reference. Defaults to the standard sitewide ref. */
  dataRef?: string;
}

export default function GoogleReviewsWidget({ dataRef = DEFAULT_DATA_REF }: Props = {}) {
  const divRef = useRef<HTMLDivElement>(null);

  // ri.js scans `.embedsocial-reviews` once on script load (and again on
  // window.load if none were present). After SPA navigation it never re-scans,
  // so we render this widget instance explicitly. getEmbedData is idempotent —
  // it bails when an iframe already exists.
  useEffect(() => {
    const tryRender = () => {
      const el = divRef.current;
      if (!el) return false;
      if (el.getElementsByTagName("iframe").length > 0) return true;
      const api = window.EMBEDSOCIALREVIEWS;
      if (api?.getEmbedData) {
        api.getEmbedData(dataRef, el);
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
  }, [dataRef]);

  return (
    <div className="embedsocial-reviews-wrapper">
      <div ref={divRef} className="embedsocial-reviews" data-ref={dataRef} />
      <Script
        src="https://embedsocial.com/embedscript/ri.js"
        id="EmbedSocialReviewsScript"
        strategy="afterInteractive"
      />
    </div>
  );
}
