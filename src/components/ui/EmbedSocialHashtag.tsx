"use client";

import { useEffect, useRef } from "react";

interface Props {
  /** EmbedSocial Hashtag widget reference (data-ref). */
  dataRef: string;
}

/**
 * Renders an EmbedSocial *Hashtag* widget (the `ht.js` product — distinct from
 * the EmbedSocial Reviews widget used by GoogleReviewsWidget, which loads
 * `ri.js`). EmbedSocial's canonical snippet guards the script with an id so it
 * only ever loads once; that guard breaks SPA navigation because the already
 * loaded script never re-scans the DOM. We instead (re)inject the script on
 * mount whenever this widget hasn't been populated yet, so it renders reliably
 * after client-side navigation too.
 */
export default function EmbedSocialHashtag({ dataRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Already populated by ht.js (it injects child nodes) → nothing to do.
    if (el.childElementCount > 0) return;

    const SCRIPT_ID = "EmbedSocialHashtagScript";
    document.getElementById(SCRIPT_ID)?.remove();
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://embedsocial.com/cdn/ht.js";
    script.async = true;
    document.head.appendChild(script);
  }, [dataRef]);

  return <div ref={containerRef} className="embedsocial-hashtag" data-ref={dataRef} />;
}
