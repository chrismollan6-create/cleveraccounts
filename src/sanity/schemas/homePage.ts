import { defineType, defineField } from "sanity";
import { Home } from "lucide-react";

/**
 * The homepage. Organised into tabs (Content / SEO) so the form stays
 * approachable for non-technical editors.
 */
export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: Home,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fieldsets: [
    { name: "hero", title: "Hero (top of the page)", options: { collapsible: false } },
    { name: "cta", title: "Closing call-to-action (bottom of the page)", options: { collapsible: false } },
  ],
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
      group: "content",
      fieldset: "hero",
      description: "The big heading at the very top of the homepage.",
      initialValue: "Stop Worrying About Your Accounts.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero text",
      type: "text",
      rows: 2,
      group: "content",
      fieldset: "hero",
      description: "The sentence or two under the hero headline.",
      initialValue: "Your own dedicated accountant, unlimited advice, and free software — all for one fixed monthly fee. No surprises. Ever.",
    }),
    defineField({
      name: "heroCTA",
      title: "Hero button text",
      type: "string",
      group: "content",
      fieldset: "hero",
      description: "The wording on the main button at the top of the page.",
      initialValue: "Get Started — It's Free to Set Up",
    }),
    defineField({
      name: "trustBadgeText",
      title: "Trust badge text",
      type: "string",
      group: "content",
      fieldset: "hero",
      description: "Small reassurance line near the hero, e.g. a rating or client count.",
      initialValue: "Rated 5/5 by 10,000+ UK businesses",
    }),
    defineField({
      name: "stats",
      title: "Stats bar",
      type: "array",
      group: "content",
      description: "Short proof points shown in a row, e.g. value '10,000+' + label 'Businesses served'.",
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
      name: "problemSectionTitle",
      title: "Problem section heading",
      type: "string",
      group: "content",
      description: "Heading for the section that speaks to the client's pain points.",
      initialValue: "Running a Business Is Hard Enough",
    }),
    defineField({
      name: "ctaHeadline",
      title: "Closing heading",
      type: "string",
      group: "content",
      fieldset: "cta",
      description: "The heading of the final call-to-action at the bottom of the page.",
      initialValue: "Ready to Make Your Accounting Clever?",
    }),
    defineField({
      name: "ctaSubheadline",
      title: "Closing text",
      type: "text",
      rows: 2,
      group: "content",
      fieldset: "cta",
      description: "The supporting line under the closing heading.",
      initialValue: "Join 10,000+ UK businesses. Set up in 2 minutes. No setup fees. Cancel anytime.",
    }),
    defineField({
      name: "pageSchemas",
      title: "Structured data (advanced)",
      type: "pageSchemas",
      group: "seo",
      description: "Optional behind-the-scenes data that helps Google understand the page. Safe to leave to a developer.",
    }),
    defineField({
      name: "metaTitle",
      title: "Search engine title",
      type: "string",
      group: "seo",
      description: "Override the homepage title shown in Google. Aim for 30–60 characters.",
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
    select: { title: "heroHeadline" },
    prepare: ({ title }) => ({ title: "Home Page", subtitle: title }),
  },
});
