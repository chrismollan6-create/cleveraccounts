"use client";

import Script from "next/script";

/**
 * Default EmbedSocial widget ref used across the site (homepage, service pages, etc.).
 * The /reviews page passes a different ref to show a richer review collection.
 */
const DEFAULT_DATA_REF = "f1e784fdf537d9876ef24e119a197eda526c4ced";

interface Props {
  /** Override the EmbedSocial widget reference. Defaults to the standard sitewide ref. */
  dataRef?: string;
}

export default function GoogleReviewsWidget({ dataRef = DEFAULT_DATA_REF }: Props = {}) {
  return (
    <div className="embedsocial-reviews-wrapper">
      <div className="embedsocial-reviews" data-ref={dataRef} />
      <Script
        src="https://embedsocial.com/embedscript/ri.js"
        id="EmbedSocialReviewsScript"
        strategy="lazyOnload"
      />
    </div>
  );
}
