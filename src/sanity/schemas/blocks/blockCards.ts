import { defineType, defineField } from "sanity";
import { LayoutGrid } from "lucide-react";
import { TONE_LIST } from "../../../components/blocks/tone";

/**
 * Page-builder block: Cards. A headed section with a responsive grid of
 * title + text cards. Brand-aware — renders in the active brand's colours.
 */
export default defineType({
  name: "block.cards",
  title: "Cards",
  type: "object",
  icon: LayoutGrid,
  fields: [
    defineField({
      name: "tone",
      title: "Section tone",
      type: "string",
      description: "Sets the light/dark rhythm of the section. Brand-aware.",
      options: { list: [...TONE_LIST], layout: "radio" },
      initialValue: "light",
    }),
    defineField({ name: "eyebrow", title: "Small label (eyebrow)", type: "string", description: "Optional little label above the heading." }),
    defineField({ name: "heading", title: "Heading", type: "string", description: "The section title." }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2, description: "Optional supporting sentence or two under the heading." }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      description: "The grid of cards. Each has a title and a short description.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Card title", type: "string", description: "The card's heading." }),
            defineField({ name: "text", title: "Card text", type: "text", rows: 3, description: "A short supporting description." }),
          ],
          preview: {
            select: { title: "title", subtitle: "text" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Cards", subtitle: "Cards block" }),
  },
});
