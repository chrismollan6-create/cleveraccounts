import { defineType, defineField } from "sanity";

export default defineType({
  name: "knowledgeTopic",
  title: "Knowledge Topic",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. \"VAT\", \"Self-Assessment\", \"PAYE\"",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "name", maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 2,
      description: "One sentence shown on the /learn index hub card",
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: "intro",
      title: "Topic intro",
      type: "text",
      rows: 4,
      description: "Paragraph shown on the topic page above the article list",
      validation: (Rule) => Rule.required().max(600),
    }),
    defineField({
      name: "icon",
      title: "Icon (lucide-react name)",
      type: "string",
      description: "e.g. \"calculator\", \"file-text\", \"building-2\", \"banknote\". See lucide.dev/icons",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first on /learn",
      initialValue: 100,
    }),
    defineField({
      name: "keyFacts",
      title: "Key facts",
      type: "array",
      description: "Headline numbers and rules for this topic. Shown as cards on the topic page.",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label", validation: (r) => r.required() },
            { name: "value", type: "string", title: "Value", validation: (r) => r.required() },
            { name: "context", type: "string", title: "Context (optional)", description: "e.g. \"2025/26\", \"Standard rate\"" },
            { name: "icon", type: "string", title: "Icon (lucide-react name, optional)" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "timeline",
      title: "Annual cycle / key dates",
      type: "array",
      description: "Ordered timeline of key dates and events. Shown as a visual timeline on the topic page.",
      of: [
        {
          type: "object",
          fields: [
            { name: "period", type: "string", title: "Period / Date", description: "e.g. \"5 October\", \"Every quarter\", \"12 months after year-end\"", validation: (r) => r.required() },
            { name: "label", type: "string", title: "Event / Action", validation: (r) => r.required() },
            { name: "description", type: "text", rows: 2, title: "Description (optional)" },
          ],
          preview: {
            select: { title: "label", subtitle: "period" },
          },
        },
      ],
    }),
    defineField({
      name: "usefulLinks",
      title: "Useful external links",
      type: "array",
      description: "Curated links to gov.uk, HMRC tools, calculators etc.",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label", validation: (r) => r.required() },
            { name: "url", type: "url", title: "URL", validation: (r) => r.required() },
            { name: "description", type: "text", rows: 2, title: "Description (optional)" },
            { name: "source", type: "string", title: "Source", description: "e.g. \"gov.uk\", \"HMRC\", \"Companies House\"" },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "quickAnswers",
      title: "Quick answers (FAQ)",
      type: "array",
      description: "Short Q&A pairs shown as an FAQ section on the topic page.",
      of: [
        {
          type: "object",
          fields: [
            { name: "q", type: "string", title: "Question", validation: (r) => r.required() },
            { name: "a", type: "text", rows: 3, title: "Answer", validation: (r) => r.required() },
          ],
          preview: { select: { title: "q" } },
        },
      ],
    }),
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      description: "Optional override for search engines (max 60 chars)",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Optional meta description (max 160 chars)",
      validation: (Rule) => Rule.max(160),
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Name (A→Z)", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "shortDescription" },
  },
});
