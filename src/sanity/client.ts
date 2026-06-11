import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityConfig } from "./config";

export const client = createClient({
  ...sanityConfig,
  useCdn: true,
});

/**
 * Draft-aware client for the Studio's visual preview (Presentation tool). Only
 * used server-side when Next draft mode is enabled — never for normal visitors.
 * `SANITY_TOKEN` is a server-only env var (stripped from client bundles), so it
 * can't leak. stega embeds invisible field source-maps so Presentation can
 * offer click-to-edit overlays.
 */
export const previewClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  perspective: "drafts",
  stega: { enabled: true, studioUrl: "/studio" },
});

const builder = createImageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
