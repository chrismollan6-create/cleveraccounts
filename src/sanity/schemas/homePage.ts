import { defineType, defineField } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      description: "Main headline on the homepage",
      initialValue: "Stop Worrying About Your Accounts.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Sub-headline",
      type: "text",
      rows: 2,
      initialValue: "Your own dedicated accountant, unlimited advice, and free software — all for one fixed monthly fee. No surprises. Ever.",
    }),
    defineField({
      name: "heroCTA",
      title: "Hero CTA Button Text",
      type: "string",
      initialValue: "Get Started — It's Free to Set Up",
    }),
    defineField({
      name: "trustBadgeText",
      title: "Trust Badge Text",
      type: "string",
      initialValue: "Rated 5/5 by 10,000+ UK businesses",
    }),
    defineField({
      name: "stats",
      title: "Stats Bar",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Value" },
            { name: "label", type: "string", title: "Label" },
          ],
        },
      ],
    }),
    defineField({
      name: "problemSectionTitle",
      title: "Problem Section Title",
      type: "string",
      initialValue: "Running a Business Is Hard Enough",
    }),
    defineField({
      name: "ctaHeadline",
      title: "Bottom CTA Headline",
      type: "string",
      initialValue: "Ready to Make Your Accounting Clever?",
    }),
    defineField({
      name: "ctaSubheadline",
      title: "Bottom CTA Sub-headline",
      type: "text",
      rows: 2,
      initialValue: "Join 10,000+ UK businesses. Set up in 2 minutes. No setup fees. Cancel anytime.",
    }),
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      description: "Override the homepage title for search engines. Ideal: 30–60 characters.",
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
});
