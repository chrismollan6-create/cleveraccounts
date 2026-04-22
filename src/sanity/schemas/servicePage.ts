import { defineType, defineField } from "sanity";

export default defineType({
  name: "servicePage",
  title: "Service Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Hero Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Hero Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "price",
      title: "Starting Price (per month)",
      type: "string",
      description: "e.g. '42.50' or '104.50'",
    }),
    defineField({
      name: "features",
      title: "What's Included",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "benefits",
      title: "Key Benefits",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Benefit Title" },
            { name: "description", type: "text", title: "Description" },
          ],
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", title: "Answer" },
          ],
        },
      ],
    }),
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      description: "Override the page title for search engines. Ideal: 30–60 characters.",
      validation: (Rule) => Rule.max(60).warning("Aim for under 60 characters for best display in Google"),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Meta description shown in Google search results. Ideal: 120–160 characters.",
      validation: (Rule) => Rule.max(160).warning("Over 160 characters may be truncated by Google"),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "price" },
  },
});
