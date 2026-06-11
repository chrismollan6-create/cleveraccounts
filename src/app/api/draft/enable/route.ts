import { client } from "@/sanity/client";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

/**
 * Enables Next draft mode for the Studio's visual preview (Presentation tool).
 * next-sanity validates the signed preview URL with the token, so this can't be
 * triggered by the public — only from an authenticated Studio session.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_TOKEN }),
});
