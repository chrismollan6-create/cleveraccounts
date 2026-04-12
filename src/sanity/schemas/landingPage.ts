import { defineType, defineField } from "sanity";

export default defineType({
  name: "landingPage",
  title: "Landing Pages",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      description: "Only visible in the CMS — used to identify this page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "The page will be live at /lp/{slug}. Must be unique.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "Main H1 shown in the hero section",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
      description: "Supporting text below the headline",
    }),
    defineField({
      name: "price",
      title: "Starting Price",
      type: "string",
      description: 'Numeric only, e.g. "42.50" — rendered as From £XX/mo',
    }),
    defineField({
      name: "targetAudience",
      title: "Target Audience Label",
      type: "string",
      description: 'Short badge label, e.g. "For Sole Traders & Self-Employed"',
    }),
    defineField({
      name: "urgencyText",
      title: "Urgency / Social Proof Text",
      type: "string",
      description: 'Shown on the hero CTA panel, e.g. "Join 4,000+ sole traders who switched this year"',
    }),

    // ── What&apos;s Included ────────────────────────────────────────────────────────
    defineField({
      name: "features",
      title: "Included Features",
      type: "array",
      description: "Bullet list of what's included for the price",
      of: [{ type: "string" }],
    }),

    // ── Why Us ────────────────────────────────────────────────────────────────
    defineField({
      name: "whyUs",
      title: "Why Choose Us (up to 4 cards)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text", rows: 3 },
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── Pain Points ───────────────────────────────────────────────────────────
    defineField({
      name: "painPoints",
      title: "Pain Points We Solve (up to 3 cards)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text", rows: 3 },
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ── How It Works ──────────────────────────────────────────────────────────
    defineField({
      name: "howItWorks",
      title: "How It Works Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Step Title", type: "string" },
            { name: "description", title: "Description", type: "text", rows: 2 },
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),

    // ── Testimonials ──────────────────────────────────────────────────────────
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "quote", title: "Quote", type: "text", rows: 3 },
            { name: "name", title: "Client Name", type: "string" },
            { name: "businessType", title: "Business Type / Role", type: "string" },
          ],
          preview: { select: { title: "name", subtitle: "businessType" } },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── FAQs ─────────────────────────────────────────────────────────────────
    defineField({
      name: "faq",
      title: "Frequently Asked Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text", rows: 4 },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      description: "Defaults to headline if left blank. Aim for under 60 characters.",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Shown in Google search results. Aim for 140–160 characters.",
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines (noindex)",
      type: "boolean",
      description: "Tick for PPC/ad landing pages you don't want Google to index",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug ? `/lp/${slug}` : "No slug set",
    }),
  },
});
