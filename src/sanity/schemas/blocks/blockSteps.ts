import { defineType, defineField } from "sanity";
import { ListOrdered } from "lucide-react";
import { TONE_LIST } from "../../../components/blocks/tone";

/**
 * Page-builder block: How it works (steps). A numbered sequence of steps
 * laid out in a row — great for explaining a process.
 * Brand-aware — renders in the active brand's colours automatically.
 */
export default defineType({
  name: "block.steps",
  title: "How it works (steps)",
  type: "object",
  icon: ListOrdered,
  fields: [
    defineField({
      name: "tone",
      title: "Section tone",
      type: "string",
      description: "Controls the light/dark feel of this section.",
      options: { list: [...TONE_LIST], layout: "radio" },
      initialValue: "light",
    }),
    defineField({ name: "eyebrow", title: "Small label (eyebrow)", type: "string", description: "Optional little label above the heading." }),
    defineField({ name: "heading", title: "Heading", type: "string", description: "The section title, e.g. \"How it works\"." }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      description: "Add each step in order — they're numbered automatically.",
      of: [
        defineField({
          name: "step",
          title: "Step",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Step title", type: "string", description: 'e.g. "Sign up".' }),
            defineField({ name: "text", title: "Step description", type: "text", rows: 3, description: "A sentence or two explaining this step." }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }) => ({ title: title || "Step" }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "How it works", subtitle: "Steps block" }),
  },
});
