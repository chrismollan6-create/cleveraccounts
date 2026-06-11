import { defineType, defineField } from "sanity";
import { HelpCircle } from "lucide-react";
import { TONE_LIST } from "../../../components/blocks/tone";

/**
 * Page-builder block: FAQ. A list of expandable question/answer pairs with an
 * optional eyebrow + heading. Brand-aware — renders in the active brand's
 * colours automatically.
 */
export default defineType({
  name: "block.faq",
  title: "FAQ",
  type: "object",
  icon: HelpCircle,
  fields: [
    defineField({
      name: "tone",
      title: "Section colour",
      type: "string",
      description: "How light or dark this section looks. Defaults to a soft brand tint.",
      options: { list: [...TONE_LIST], layout: "radio" },
      initialValue: "tinted",
    }),
    defineField({
      name: "eyebrow",
      title: "Small label (eyebrow)",
      type: "string",
      description: "Optional little label above the heading.",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "Frequently asked questions".',
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      description: "Each question and its answer.",
      of: [
        defineField({
          name: "item",
          title: "Question",
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              description: "The question a visitor might ask.",
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              description: "The answer they see when they open it.",
            }),
          ],
          preview: {
            select: { title: "question" },
            prepare: ({ title }) => ({ title: title || "Question" }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "FAQ", subtitle: "FAQ block" }),
  },
});
