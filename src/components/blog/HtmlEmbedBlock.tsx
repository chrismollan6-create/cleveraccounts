"use client";

import { sanitizeHtml } from "@/lib/sanitizeHtml";

// Isolated from PortableTextBlocks because `sanitizeHtml` pulls in
// isomorphic-dompurify → jsdom → html-encoding-sniffer, which fails to
// load on Vercel's serverless runtime (ERR_REQUIRE_ESM on @exodus/bytes).
// Splitting this into its own client chunk means the FAQ/HowTo/Review
// renderers don't load that broken module on every blog post.
export function HtmlEmbedBlock({ html }: { html: string }) {
  const safe = sanitizeHtml(html ?? "");
  return <div className="my-6 prose-html" dangerouslySetInnerHTML={{ __html: safe }} />;
}
