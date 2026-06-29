import { defineType, defineField } from "sanity";
import { LayoutTemplate } from "lucide-react";
import { brandField } from "./objects/brandField";

/**
 * Page builder — editors compose a page by stacking pre-designed blocks.
 * Lives at /p/{slug}. The block library is the `of` list on `sections`.
 */
export default defineType({
  name: "flexiblePage",
  title: "Page (builder)",
  type: "document",
  icon: LayoutTemplate,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "experiment", title: "A/B test" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    { ...brandField(), group: "settings" },
    defineField({
      name: "title",
      title: "Page name",
      type: "string",
      group: "settings",
      description: "Used in the browser tab and to identify this page in the list.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (URL)",
      type: "slug",
      group: "settings",
      description: "The page lives at /p/your-slug — must be unique. Avoid changing once live.",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "sections",
      title: "Page sections",
      description: "Build your page by adding blocks. Click 'Add item', pick a block, fill it in. Drag to reorder.",
      type: "array",
      group: "content",
      of: [
        { type: "block.hero" },
        { type: "block.features" },
        { type: "block.cards" },
        { type: "block.steps" },
        { type: "block.stats" },
        { type: "block.testimonial" },
        { type: "block.faq" },
        { type: "block.richText" },
        { type: "block.cta" },
      ],
    }),
    defineField({
      name: "experimentEnabled",
      title: "Run an A/B test?",
      type: "boolean",
      group: "experiment",
      description: "When on, half your visitors see Variant B instead of the normal sections.",
      initialValue: false,
    }),
    defineField({
      name: "sectionsB",
      title: "Variant B sections",
      description: "The alternative version shown to half your visitors. Build it like the main page sections.",
      type: "array",
      group: "experiment",
      of: [
        { type: "block.hero" },
        { type: "block.features" },
        { type: "block.cards" },
        { type: "block.steps" },
        { type: "block.stats" },
        { type: "block.testimonial" },
        { type: "block.faq" },
        { type: "block.richText" },
        { type: "block.cta" },
      ],
    }),
    defineField({
      name: "metaTitle",
      title: "Search engine title",
      type: "string",
      group: "seo",
      description: "Override the page title shown in Google. Aim for 30–60 characters.",
      validation: (R) => R.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Search engine description",
      type: "text",
      rows: 2,
      group: "seo",
      description: "The grey text shown under the title in Google results. Aim for 120–160 characters.",
      validation: (R) => R.max(170),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines?",
      type: "boolean",
      group: "settings",
      description: "Turn on for private or paid-ad landing pages you don't want in Google.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current", brand: "brand" },
    prepare({ title, slug, brand }) {
      const brandLabel = brand === "workwell" ? "Workwell" : brand === "clever" ? "Clever" : "Shared";
      return { title: title || "Untitled page", subtitle: `${brandLabel} · /p/${slug || "…"}` };
    },
  },
});
