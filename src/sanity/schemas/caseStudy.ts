import { defineType, defineField } from "sanity";

export default defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "clientName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessType",
      title: "Business Type",
      type: "string",
      options: {
        list: [
          { title: "Sole Trader", value: "sole-trader" },
          { title: "Limited Company", value: "limited-company" },
          { title: "Contractor", value: "contractor" },
          { title: "Freelancer", value: "freelancer" },
          { title: "Landlord", value: "landlord" },
          { title: "Startup", value: "startup" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      description: "e.g. 'IT Consulting', 'Freelance Design', 'Property Investment'",
    }),
    defineField({
      name: "photo",
      title: "Client Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "e.g. 'How Sarah saved £3,800 in her first year'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Short Summary",
      type: "text",
      rows: 3,
      description: "2-3 sentence overview for listing pages",
    }),
    defineField({
      name: "challenge",
      title: "The Challenge",
      type: "text",
      rows: 4,
      description: "What was the client struggling with before?",
    }),
    defineField({
      name: "solution",
      title: "The Solution",
      type: "text",
      rows: 4,
      description: "How did Clever Accounts help?",
    }),
    defineField({
      name: "results",
      title: "The Results",
      type: "text",
      rows: 4,
      description: "What outcomes did they achieve?",
    }),
    defineField({
      name: "quote",
      title: "Client Quote",
      type: "text",
      rows: 3,
      description: "A powerful quote from the client",
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Value", description: "e.g. '£3,800' or '10+ hours'" },
            { name: "label", type: "string", title: "Label", description: "e.g. 'Tax Saved' or 'Hours Freed/Month'" },
          ],
        },
      ],
      description: "Key numbers that show the impact (2-4 metrics)",
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "clientName", subtitle: "headline", media: "photo" },
  },
});
