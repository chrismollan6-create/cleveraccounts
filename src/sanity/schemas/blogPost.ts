import { defineType, defineField } from "sanity";
import { Newspaper } from "lucide-react";

/**
 * Blog post / article. Organised into tabs (Content / SEO / Settings) so the
 * form stays approachable for non-technical editors.
 */
export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: Newspaper,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fieldsets: [
    { name: "publishing", title: "Author & publishing", options: { collapsible: false } },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Post title",
      description: "The headline of the article. Keep it under 70 characters so it reads well everywhere.",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: "slug",
      title: "Web address (URL)",
      description: "The end of the page's web address. Tap 'Generate' to build it from the title. Avoid changing once published.",
      type: "slug",
      group: "settings",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      description: "A one or two sentence teaser. Shown on the blog listing and when the post is shared on social media.",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "featuredImage",
      title: "Main image",
      description: "The headline image shown at the top of the post and on the blog listing.",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Image description",
          description: "Describe the image in a few words (helps accessibility and Google).",
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Pick the topic this post fits under. Used to group and filter posts.",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Tax", value: "tax" },
          { title: "IR35", value: "ir35" },
          { title: "VAT", value: "vat" },
          { title: "Business Tips", value: "business-tips" },
          { title: "Payroll", value: "payroll" },
          { title: "News", value: "news" },
          { title: "Guides", value: "guides" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author name",
      description: "Who wrote this post. Shown as the byline.",
      type: "string",
      group: "content",
      fieldset: "publishing",
      initialValue: "Clever Accounts",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date & time",
      description: "When this post goes live. Posts are listed newest first.",
      type: "datetime",
      group: "content",
      fieldset: "publishing",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Article content",
      description: "The main body of the post. Use headings, bold/italic and links, and drop in images or special blocks as needed.",
      type: "array",
      group: "content",
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
            { name: "alt", type: "string", title: "Image description" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
        { type: "htmlEmbed" },
        { type: "faqBlock" },
        { type: "howToBlock" },
        { type: "reviewBlock" },
        { type: "ctaBlock" },
      ],
    }),
    defineField({
      name: "pageSchemas",
      title: "Structured data (advanced)",
      type: "pageSchemas",
      group: "seo",
      description:
        "Add one or more JSON-LD schemas to this page. Inline FAQ/HowTo/Review blocks in the body already emit their own schema — only add page-level schemas here.",
    }),
    defineField({
      name: "metaTitle",
      title: "Search engine title",
      type: "string",
      group: "seo",
      description: "Override the page title shown in Google. Aim for 30–60 characters.",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Search engine description",
      type: "text",
      rows: 2,
      group: "seo",
      description: "The grey text shown under the title in Google results. Aim for 120–160 characters.",
      validation: (Rule) => Rule.max(160),
    }),
  ],
  orderings: [
    { title: "Published Date (New → Old)", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", media: "featuredImage", category: "category" },
    prepare({ title, media, category }) {
      return { title, subtitle: category ? `Category: ${category}` : "Blog post", media };
    },
  },
});
