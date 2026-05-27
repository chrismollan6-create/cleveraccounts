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
