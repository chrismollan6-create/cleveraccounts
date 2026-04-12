"use client";

import Script from "next/script";

export default function GoogleReviewsWidget() {
  return (
    <div className="embedsocial-reviews-wrapper">
      <div
        className="embedsocial-reviews"
        data-ref="f1e784fdf537d9876ef24e119a197eda526c4ced"
      />
      <Script
        src="https://embedsocial.com/embedscript/ri.js"
        id="EmbedSocialReviewsScript"
        strategy="lazyOnload"
      />
    </div>
  );
}
