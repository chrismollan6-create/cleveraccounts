import { defineType, defineField } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
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
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
    defineField({
      name: "featured",
      title: "Show on Homepage?",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    { title: "Category then Order", name: "categoryOrder", by: [{ field: "category", direction: "asc" }, { field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
  },
});
