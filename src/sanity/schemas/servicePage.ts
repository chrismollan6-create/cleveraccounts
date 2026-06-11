import { defineType, defineField } from "sanity";
import { brandField } from "./objects/brandField";

/**
 * Service / audience page (sole trader, limited company, contractor, etc).
 * Organised into tabs (Content / Section headings / SEO / Settings) so the
 * form is approachable for non-technical editors.
 */
export default defineType({
  name: "servicePage",
  title: "Service Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "headings", title: "Section headings" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fieldsets: [
    { name: "hero", title: "Hero (top of the page)", options: { collapsible: false } },
  ],
  fields: [
    { ...brandField(), group: "settings" },
    defineField({
      name: "title",
      title: "Page name",
      description: "Shown in the browser tab and used across the page (e.g. 'Sole Trader Accountants').",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (URL)",
      description: "The page lives at /your-slug — e.g. 'sole-trader'. Avoid changing once live.",
      type: "slug",
      group: "settings",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Hero headline",
      description: "The big heading at the top of the page.",
      type: "string",
      group: "content",
      fieldset: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Hero text",
      description: "The sentence or two under the headline.",
      type: "text",
      rows: 3,
      group: "content",
      fieldset: "hero",
    }),
    defineField({
      name: "price",
      title: "Starting price (per month)",
      description: "Just the number, e.g. '42.50'. The £ and '/month + VAT' are added automatically.",
      type: "string",
      group: "content",
      fieldset: "hero",
    }),
    defineField({
      name: "features",
      title: "What's included",
      description: "The checklist of what clients get. Add one line per item.",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "benefits",
      title: "Key benefits",
      description: "A few cards explaining why clients choose us.",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Benefit title" },
            { name: "description", type: "text", title: "Description", rows: 2 },
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats band (optional)",
      description: "Short proof points shown in a dark band, e.g. value '£1,200' + label 'Average annual tax saving'.",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Value" },
            { name: "label", type: "string", title: "Label" },
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "serviceCategories",
      title: "What we do (optional)",
      description: "Columns of what's handled, e.g. a 'Self Assessment' column with bullet points.",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Column title" },
            { name: "items", type: "array", of: [{ type: "string" }], title: "Bullet points" },
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial (optional)",
      description: "A single client quote shown mid-page.",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "name", type: "string", title: "Client name" },
        { name: "role", type: "string", title: "Role / business type" },
        { name: "quote", type: "text", title: "Quote", rows: 3 },
      ],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      description: "Common questions, shown in an expandable list.",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", title: "Answer", rows: 3 },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({
      name: "sections",
      title: "Section headings",
      description: "Optional — override the on-page section headings. Leave any blank to use the built-in default.",
      type: "object",
      group: "headings",
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: "featuresEyebrow", title: "What's included — small label", type: "string" },
        { name: "featuresHeading", title: "What's included — heading", type: "string" },
        { name: "benefitsEyebrow", title: "Benefits — small label", type: "string" },
        { name: "benefitsHeading", title: "Benefits — heading", type: "string" },
        { name: "categoriesEyebrow", title: "What we do — small label", type: "string" },
        { name: "categoriesHeading", title: "What we do — heading", type: "string" },
        { name: "faqEyebrow", title: "FAQ — small label", type: "string" },
        { name: "faqHeading", title: "FAQ — heading", type: "string" },
        { name: "ctaHeading", title: "Closing call-to-action — heading", type: "string" },
        { name: "ctaBody", title: "Closing call-to-action — text", type: "text", rows: 2 },
      ],
    }),
    defineField({
      name: "metaTitle",
      title: "Search engine title",
      type: "string",
      group: "seo",
      description: "Override the page title for Google. Aim for 30–60 characters.",
      validation: (Rule) => Rule.max(60).warning("Aim for under 60 characters for best display in Google"),
    }),
    defineField({
      name: "metaDescription",
      title: "Search engine description",
      type: "text",
      rows: 2,
      group: "seo",
      description: "The grey text shown under the title in Google results. Aim for 120–160 characters.",
      validation: (Rule) => Rule.max(160).warning("Over 160 characters may be truncated by Google"),
    }),
    defineField({
      name: "pageSchemas",
      title: "Structured data (advanced)",
      type: "pageSchemas",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", price: "price", brand: "brand" },
    prepare({ title, price, brand }) {
      const brandLabel = brand === "workwell" ? "Workwell" : brand === "clever" ? "Clever" : "Shared";
      return { title, subtitle: `${brandLabel}${price ? ` · £${price}/mo` : ""}` };
    },
  },
});
