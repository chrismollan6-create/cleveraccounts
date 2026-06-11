import { defineType, defineField } from "sanity";
import { Megaphone } from "lucide-react";
import { brandField } from "./objects/brandField";

/**
 * PPC / ad landing page (lives at /lp/{slug}).
 * Organised into tabs (Content / SEO / Settings) so the form is approachable
 * for non-technical editors.
 */
export default defineType({
  name: "landingPage",
  title: "Landing Pages",
  type: "document",
  icon: Megaphone,
  groups: [
    { name: "content", title: "Content", default: true },
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
      title: "Page name (internal)",
      type: "string",
      group: "settings",
      description: "Only visible here in the CMS — used to identify this page in the list.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (URL)",
      type: "slug",
      group: "settings",
      description: "The page lives at /lp/your-slug — must be unique. Avoid changing once live.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: "headline",
      title: "Hero headline",
      type: "string",
      group: "content",
      fieldset: "hero",
      description: "The big heading at the very top of the page.",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "subheadline",
      title: "Hero text",
      type: "text",
      rows: 3,
      group: "content",
      fieldset: "hero",
      description: "The supporting sentence or two under the headline.",
    }),
    defineField({
      name: "price",
      title: "Starting price (per month)",
      type: "string",
      group: "content",
      fieldset: "hero",
      description: 'Just the number, e.g. "42.50". Shown as "From £XX/mo".',
    }),
    defineField({
      name: "targetAudience",
      title: "Audience badge",
      type: "string",
      group: "content",
      fieldset: "hero",
      description: 'Short badge label, e.g. "For Sole Traders & Self-Employed".',
    }),
    defineField({
      name: "urgencyText",
      title: "Urgency / social proof line",
      type: "string",
      group: "content",
      fieldset: "hero",
      description: 'Shown on the hero call-to-action panel, e.g. "Join 4,000+ sole traders who switched this year".',
    }),

    // ── What's Included ────────────────────────────────────────────────────────
    defineField({
      name: "features",
      title: "What's included",
      type: "array",
      group: "content",
      description: "The checklist of what clients get for the price. Add one line per item.",
      of: [{ type: "string" }],
    }),

    // ── Why Us ────────────────────────────────────────────────────────────────
    defineField({
      name: "whyUs",
      title: "Why choose us (up to 6 cards)",
      type: "array",
      group: "content",
      description: "A few cards explaining why clients pick us.",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Card title", type: "string" },
            { name: "description", title: "Card text", type: "text", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── Pain Points ───────────────────────────────────────────────────────────
    defineField({
      name: "painPoints",
      title: "Pain points we solve (up to 3 cards)",
      type: "array",
      group: "content",
      description: "Common frustrations your audience has, and how we fix them.",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Pain point", type: "string" },
            { name: "description", title: "How we solve it", type: "text", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ── How It Works ──────────────────────────────────────────────────────────
    defineField({
      name: "howItWorks",
      title: "How it works (steps)",
      type: "array",
      group: "content",
      description: "The simple steps a client goes through, shown in order.",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Step title", type: "string" },
            { name: "description", title: "Step text", type: "text", rows: 2 },
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),

    // ── Testimonials ──────────────────────────────────────────────────────────
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      group: "content",
      description: "Real client quotes to build trust.",
      of: [
        {
          type: "object",
          fields: [
            { name: "quote", title: "Quote", type: "text", rows: 3 },
            { name: "name", title: "Client name", type: "string" },
            { name: "businessType", title: "Business type / role", type: "string" },
          ],
          preview: { select: { title: "name", subtitle: "businessType" } },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── FAQs ─────────────────────────────────────────────────────────────────
    defineField({
      name: "faq",
      title: "FAQs",
      type: "array",
      group: "content",
      description: "Common questions, shown in an expandable list.",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text", rows: 4 },
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        },
      ],
    }),

    // ── Structured data ───────────────────────────────────────────────────────
    defineField({
      name: "pageSchemas",
      title: "Structured data (advanced)",
      type: "pageSchemas",
      group: "seo",
      description: "Optional schema.org data for search engines. Leave alone unless you know you need it.",
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: "metaTitle",
      title: "Search engine title",
      type: "string",
      group: "seo",
      description: "Override the page title shown in Google. Defaults to the headline if left blank. Aim for under 60 characters.",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Search engine description",
      type: "text",
      rows: 2,
      group: "seo",
      description: "The grey text shown under the title in Google results. Aim for 140–160 characters.",
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines (noindex)",
      type: "boolean",
      group: "seo",
      description: "Tick for PPC/ad landing pages you don't want Google to index.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current", brand: "brand" },
    prepare: ({ title, slug, brand }) => {
      const brandLabel = brand === "workwell" ? "Workwell" : brand === "clever" ? "Clever" : "Shared";
      return {
        title,
        subtitle: `${brandLabel} · ${slug ? `/lp/${slug}` : "No slug set"}`,
      };
    },
  },
});
