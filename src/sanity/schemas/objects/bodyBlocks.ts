import { defineType, defineField } from "sanity";

export const htmlEmbed = defineType({
  name: "htmlEmbed",
  title: "HTML embed",
  type: "object",
  fields: [
    defineField({
      name: "html",
      title: "HTML",
      type: "text",
      rows: 12,
      description:
        "Pasted HTML is sanitized on render — <script> tags and event handlers (onclick, etc.) are stripped for safety.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      title: "Internal label",
      type: "string",
      description: "For your reference — not rendered.",
    }),
  ],
  preview: {
    select: { title: "label", html: "html" },
    prepare: ({ title, html }: { title?: string; html?: string }) => ({
      title: "HTML embed",
      subtitle: title || (html ? `${html.slice(0, 60)}…` : "empty"),
    }),
  },
});

export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ block",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading (optional)", type: "string" }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "q", type: "string", title: "Question", validation: (r) => r.required() },
            { name: "a", type: "text", rows: 3, title: "Answer", validation: (r) => r.required() },
          ],
          preview: { select: { title: "q" } },
        },
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "heading", faqs: "faqs" },
    prepare: ({ title, faqs }: { title?: string; faqs?: unknown[] }) => ({
      title: title || "FAQ block",
      subtitle: `${faqs?.length || 0} Q&A — emits FAQPage schema`,
    }),
  },
});

export const howToBlock = defineType({
  name: "howToBlock",
  title: "How-To block",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string", title: "Title", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Step title" },
            { name: "text", type: "text", title: "Step description", validation: (r) => r.required() },
          ],
          preview: { select: { title: "name", subtitle: "text" } },
        },
      ],
      validation: (r) => r.min(2),
    }),
  ],
  preview: {
    select: { title: "name", steps: "steps" },
    prepare: ({ title, steps }: { title?: string; steps?: unknown[] }) => ({
      title: title || "How-To block",
      subtitle: `${steps?.length || 0} steps — emits HowTo schema`,
    }),
  },
});

export const reviewBlock = defineType({
  name: "reviewBlock",
  title: "Review block",
  type: "object",
  fields: [
    defineField({ name: "author", type: "string", title: "Reviewer name", validation: (r) => r.required() }),
    defineField({ name: "rating", type: "number", title: "Rating (1–5)", validation: (r) => r.required().min(1).max(5) }),
    defineField({ name: "reviewBody", type: "text", rows: 3, title: "Quote", validation: (r) => r.required() }),
    defineField({ name: "itemReviewed", type: "string", title: "What's being reviewed (e.g. service name)" }),
  ],
  preview: {
    select: { title: "author", rating: "rating" },
    prepare: ({ title, rating }: { title?: string; rating?: number }) => ({
      title: "Review block",
      subtitle: `${title ?? "anon"} — ${rating ?? "?"}/5 — emits Review schema`,
    }),
  },
});

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "CTA block",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", title: "Heading", validation: (r) => r.required() }),
    defineField({ name: "subheading", type: "text", rows: 2 }),
    defineField({ name: "buttonText", type: "string", initialValue: "Get Started" }),
    defineField({ name: "buttonHref", type: "string", initialValue: "/sign-up" }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }: { title?: string }) => ({ title: "CTA block", subtitle: title }),
  },
});
