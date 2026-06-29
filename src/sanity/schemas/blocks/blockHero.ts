import { defineType, defineField } from "sanity";
import { Sparkles } from "lucide-react";

/**
 * Page-builder block: Hero. The big top-of-page banner with a headline and CTA.
 * Brand-aware — renders in the active brand's colours automatically.
 */
export default defineType({
  name: "block.hero",
  title: "Hero",
  type: "object",
  icon: Sparkles,
  fields: [
    defineField({ name: "eyebrow", title: "Small label (eyebrow)", type: "string", description: "Optional little label above the headline." }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (R) => R.required() }),
    defineField({ name: "subheadline", title: "Sub-headline", type: "text", rows: 3, description: "The supporting sentence or two under the headline." }),
    defineField({ name: "primaryCtaLabel", title: "Button text", type: "string", description: 'e.g. "Get Started".' }),
    defineField({ name: "primaryCtaHref", title: "Button link", type: "string", description: 'Where it goes, e.g. "/sign-up".' }),
    defineField({ name: "secondaryCtaLabel", title: "Second button text (optional)", type: "string" }),
    defineField({ name: "secondaryCtaHref", title: "Second button link (optional)", type: "string" }),
    defineField({ name: "note", title: "Small note under the buttons (optional)", type: "string", description: 'e.g. "Free to set up · Cancel anytime".' }),
  ],
  preview: {
    select: { title: "headline" },
    prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Hero block" }),
  },
});
