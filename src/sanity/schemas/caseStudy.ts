import { defineType, defineField } from "sanity";
import { BookOpen } from "lucide-react";
import { brandField } from "./objects/brandField";

/**
 * Client case study / success story. Organised into tabs (Content / SEO /
 * Settings) so the form stays approachable for non-technical editors.
 */
export default defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  icon: BookOpen,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fieldsets: [
    { name: "story", title: "The story", options: { collapsible: false } },
  ],
  fields: [
    { ...brandField(), group: "settings" },
    defineField({
      name: "clientName",
      title: "Client name",
      description: "The name of the client or business this story is about.",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (URL)",
      description: "The end of the page's web address. Tap 'Generate' to build it from the client name. Avoid changing once published.",
      type: "slug",
      group: "settings",
      options: { source: "clientName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessType",
      title: "Business type",
      description: "What kind of business the client runs. Used to group and filter case studies.",
      type: "string",
      group: "content",
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
      group: "content",
      description: "The client's line of work — e.g. 'IT Consulting', 'Freelance Design', 'Property Investment'.",
    }),
    defineField({
      name: "photo",
      title: "Client photo",
      description: "A photo of the client. Shown at the top of the story and on listing pages.",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "content",
      description: "The big, attention-grabbing heading — e.g. 'How Sarah saved £3,800 in her first year'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "content",
      description: "A 2–3 sentence overview, shown on listing pages and previews.",
    }),
    defineField({
      name: "challenge",
      title: "The challenge",
      type: "text",
      rows: 4,
      group: "content",
      fieldset: "story",
      description: "What was the client struggling with before they came to us?",
    }),
    defineField({
      name: "solution",
      title: "The solution",
      type: "text",
      rows: 4,
      group: "content",
      fieldset: "story",
      description: "How did we help? What did we put in place?",
    }),
    defineField({
      name: "results",
      title: "The results",
      type: "text",
      rows: 4,
      group: "content",
      fieldset: "story",
      description: "What outcomes did the client achieve?",
    }),
    defineField({
      name: "quote",
      title: "Client quote",
      type: "text",
      rows: 3,
      group: "content",
      description: "A short, powerful quote in the client's own words.",
    }),
    defineField({
      name: "metrics",
      title: "Key numbers",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Number", description: "e.g. '£3,800' or '10+ hours'" },
            { name: "label", type: "string", title: "What it means", description: "e.g. 'Tax Saved' or 'Hours Freed/Month'" },
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
      description: "The standout numbers that prove the impact (add 2–4).",
    }),
    defineField({
      name: "featured",
      title: "Show on homepage?",
      type: "boolean",
      group: "settings",
      description: "Turn on to feature this story on the homepage.",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "settings",
      description: "When this case study went live.",
    }),
    defineField({
      name: "metaTitle",
      title: "Search engine title",
      type: "string",
      group: "seo",
      description: "Override the page title shown in Google. Aim for 30–60 characters.",
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
  ],
  preview: {
    select: { title: "clientName", subtitle: "headline", media: "photo" },
  },
});
