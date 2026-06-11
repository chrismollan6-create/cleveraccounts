import { defineType, defineField } from "sanity";
import { HelpCircle } from "lucide-react";

/**
 * A single frequently-asked question and its answer. Short schema, so no tabs —
 * just clear, plain-English labels for non-technical editors.
 */
export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircle,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      description: "The question as a visitor would ask it, e.g. 'How much does it cost to switch?'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      description: "A clear, friendly answer in a sentence or two.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Topic",
      type: "string",
      description: "Groups this question with similar ones on the FAQ page. Pick the best fit.",
      options: {
        list: [
          { title: "Getting Started", value: "getting-started" },
          { title: "Pricing & Billing", value: "pricing" },
          { title: "Services & Support", value: "services" },
          { title: "Switching to Us", value: "switching" },
          { title: "Sole Trader", value: "sole-trader" },
          { title: "Limited Company", value: "limited-company" },
          { title: "Contractor / IR35", value: "contractor" },
          { title: "VAT", value: "vat" },
          { title: "Payroll", value: "payroll" },
          { title: "Software", value: "software" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Position within topic",
      type: "number",
      description: "Controls the order within its topic — lower numbers appear first.",
    }),
    defineField({
      name: "featured",
      title: "Show on homepage?",
      type: "boolean",
      description: "Turn on to include this question in the shortlist on the homepage.",
      initialValue: false,
    }),
  ],
  orderings: [
    { title: "Category then Order", name: "categoryOrder", by: [{ field: "category", direction: "asc" }, { field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "question", category: "category", featured: "featured" },
    prepare({ title, category, featured }) {
      return {
        title,
        subtitle: `${category || "No topic"}${featured ? " · On homepage" : ""}`,
      };
    },
  },
});
