import { defineType, defineField } from "sanity";
import { ListChecks } from "lucide-react";
import { TONE_LIST } from "../../../components/blocks/tone";

/**
 * Page-builder block: Feature list. A headed section with a tick-list of
 * features in two columns. Brand-aware — renders in the active brand's colours.
 */
export default defineType({
  name: "block.features",
  title: "Feature list",
  type: "object",
  icon: ListChecks,
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
      name: "items",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      description: "The list of features, one per line. Each shows with a tick.",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Feature list", subtitle: "Feature list block" }),
  },
});
