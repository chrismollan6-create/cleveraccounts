import { defineType, defineField } from "sanity";

export default defineType({
  name: "knowledgeArticle",
  title: "Knowledge Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The article headline. Long form is OK (e.g. \"How to register for Self-Assessment and get your UTR\").",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "reference",
      to: [{ type: "knowledgeTopic" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "canonicalQuestion",
      title: "Canonical question",
      type: "string",
      description: "The one question this article answers, phrased the way a client would Google it. Used in the FAQ schema and the hero.",
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt / answer in one line",
      type: "text",
      rows: 2,
      description: "Short summary shown on listings and as the meta description fallback. Lead with the answer.",
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: "appliesTo",
      title: "Applies to",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Sole trader", value: "sole-trader" },
          { title: "Limited company", value: "ltd" },
          { title: "Director", value: "director" },
          { title: "Employer", value: "employer" },
          { title: "Landlord", value: "landlord" },
          { title: "Contractor", value: "contractor" },
          { title: "Umbrella worker", value: "umbrella" },
        ],
        layout: "tags",
      },
      description: "Who this article is for. Used for filtering and tagging.",
    }),
    defineField({
      name: "lastReviewed",
      title: "Last reviewed by an accountant",
      type: "date",
      description: "Shown as a trust badge. Update whenever an accountant reviews the article for ongoing accuracy.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reviewDue",
      title: "Next review due",
      type: "date",
      description: "Optional. Internal reminder — typically 6 or 12 months after lastReviewed.",
    }),
    defineField({
      name: "reviewedBy",
      title: "Reviewed by",
      type: "string",
      description: "Optional. The name of the accountant who last reviewed this (shown next to lastReviewed).",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image (optional)",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                title: "Link",
                name: "link",
                type: "object",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
        { type: "htmlEmbed" },
        { type: "faqBlock" },
        { type: "howToBlock" },
        { type: "ctaBlock" },
      ],
    }),
    defineField({
      name: "relatedArticles",
      title: "Related articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "knowledgeArticle" }] }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "pageSchemas",
      title: "Structured data (schema.org)",
      type: "pageSchemas",
      description:
        "Add page-level JSON-LD here. Inline FAQ/HowTo blocks in the body already emit their own schema — only add page-level schemas here.",
    }),
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      description: "Override the page title for search engines (max 60 chars)",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Meta description for search engines (max 160 chars)",
      validation: (Rule) => Rule.max(160),
    }),
  ],
  orderings: [
    { title: "Last Reviewed (New → Old)", name: "lastReviewedDesc", by: [{ field: "lastReviewed", direction: "desc" }] },
    { title: "Title (A→Z)", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", media: "featuredImage", topicName: "topic.name", reviewed: "lastReviewed" },
    prepare({ title, media, topicName, reviewed }) {
      const sub = [topicName, reviewed ? `reviewed ${reviewed}` : "needs review"].filter(Boolean).join(" · ");
      return { title, media, subtitle: sub };
    },
  },
});
