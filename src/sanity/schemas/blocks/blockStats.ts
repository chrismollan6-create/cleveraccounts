import { defineType, defineField } from "sanity";
import { BarChart3 } from "lucide-react";
import { TONE_LIST } from "../../../components/blocks/tone";

/**
 * Page-builder block: Stats band. A row of headline numbers with labels —
 * great for social proof ("500+ clients", "4.9 rating").
 * Brand-aware — renders in the active brand's colours automatically.
 */
export default defineType({
  name: "block.stats",
  title: "Stats band",
  type: "object",
  icon: BarChart3,
  fields: [
    defineField({
      name: "tone",
      title: "Section tone",
      type: "string",
      description: "Controls the light/dark feel of this section.",
      options: { list: [...TONE_LIST], layout: "radio" },
      initialValue: "light",
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      description: "Add each number you want to show off.",
      of: [
        defineField({
          name: "stat",
          title: "Stat",
          type: "object",
          fields: [
            defineField({ name: "value", title: "Big number", type: "string", description: 'e.g. "500+" or "4.9".' }),
            defineField({ name: "label", title: "Label", type: "string", description: 'What it means, e.g. "Happy clients".' }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
            prepare: ({ title, subtitle }) => ({ title: title || "Stat", subtitle }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Stats band", subtitle: "Stats block" }),
  },
});
