import { defineType, defineField } from "sanity";
import { CornerUpRight } from "lucide-react";

/**
 * Editor-managed URL redirect. Applied when someone visits the "from" path —
 * they're sent to "to". Lets editors change a page's URL safely: change the
 * slug, then add a redirect from the old path to the new one.
 */
export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: CornerUpRight,
  fields: [
    defineField({
      name: "from",
      title: "From (old web address)",
      type: "string",
      description: 'The old path, starting with a slash — e.g. "/old-page". Just the path, not the full https:// address.',
      validation: (R) =>
        R.required().custom((v) => (typeof v === "string" && v.startsWith("/")) || 'Must start with "/"'),
    }),
    defineField({
      name: "to",
      title: "To (new destination)",
      type: "string",
      description: 'Where to send people — e.g. "/new-page", or a full "https://…" address for another site.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "permanent",
      title: "Permanent move?",
      type: "boolean",
      description: "On = permanent (301 — use this when a page has moved for good; best for SEO). Off = temporary (302).",
      initialValue: true,
    }),
    defineField({
      name: "note",
      title: "Note (optional)",
      type: "string",
      description: "For your own reference — why this redirect exists.",
    }),
  ],
  preview: {
    select: { from: "from", to: "to", permanent: "permanent" },
    prepare: ({ from, to, permanent }) => ({
      title: `${from || "?"}  →  ${to || "?"}`,
      subtitle: permanent ? "Permanent (301)" : "Temporary (302)",
    }),
  },
});
