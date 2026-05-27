import { defineType, defineField } from "sanity";

export default defineType({
  name: "knowledgeArticleFeedback",
  title: "Learning Centre — Feedback",
  type: "document",
  fields: [
    defineField({
      name: "article",
      title: "Article",
      type: "reference",
      to: [{ type: "knowledgeArticle" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "helpful",
      title: "Was this helpful?",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "comment",
      title: "Comment (optional)",
      type: "text",
      rows: 4,
      description: "Free-text feedback from the reader. Only populated if they wrote anything.",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userAgent",
      title: "User agent",
      type: "string",
      readOnly: true,
    }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { article: "article.title", helpful: "helpful", submittedAt: "submittedAt", comment: "comment" },
    prepare({ article, helpful, submittedAt, comment }) {
      const when = submittedAt ? new Date(submittedAt).toLocaleDateString("en-GB") : "?";
      const emoji = helpful ? "👍" : "👎";
      const sub = [when, comment ? `"${String(comment).slice(0, 60)}…"` : "no comment"].filter(Boolean).join(" · ");
      return { title: `${emoji} ${article || "(unknown article)"}`, subtitle: sub };
    },
  },
});
