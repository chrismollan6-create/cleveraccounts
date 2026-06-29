import { defineType, defineField } from "sanity";
import { MousePointerClick } from "lucide-react";

/**
 * Page-builder block: Call-to-action band. A bold prompt with a button —
 * usually near the bottom of a page.
 */
export default defineType({
  name: "block.cta",
  title: "Call to action",
  type: "object",
  icon: MousePointerClick,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (R) => R.required() }),
    defineField({ name: "text", title: "Text", type: "text", rows: 2, description: "Supporting line under the heading." }),
    defineField({ name: "ctaLabel", title: "Button text", type: "string" }),
    defineField({ name: "ctaHref", title: "Button link", type: "string", description: 'e.g. "/sign-up".' }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Call to action", subtitle: "Call-to-action block" }),
  },
});
