import { defineType, defineField } from "sanity";
import { Quote } from "lucide-react";
import { TONE_LIST } from "../../../components/blocks/tone";

/**
 * Page-builder block: Testimonial. A single, centred client quote with a
 * star rating, name and role. Brand-aware — renders in the active brand's
 * colours automatically.
 */
export default defineType({
  name: "block.testimonial",
  title: "Testimonial",
  type: "object",
  icon: Quote,
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
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      description: "What the client said, in their words.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "name",
      title: "Person's name",
      type: "string",
      description: 'Who said it, e.g. "Jane Smith".',
    }),
    defineField({
      name: "role",
      title: "Their role or company",
      type: "string",
      description: 'e.g. "Founder, Acme Ltd".',
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Testimonial",
      subtitle: subtitle || "Testimonial block",
    }),
  },
});
