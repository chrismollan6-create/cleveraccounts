import { defineType, defineField, defineArrayMember } from "sanity";

export const breadcrumbSchema = defineType({
  name: "breadcrumbSchema",
  title: "Breadcrumb",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Breadcrumb items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Name", validation: (r) => r.required() },
            { name: "url", type: "string", title: "Path", description: "e.g. /sole-trader", validation: (r) => r.required() },
          ],
          preview: { select: { title: "name", subtitle: "url" } },
        },
      ],
      validation: (r) => r.min(2),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }: { items?: { name?: string }[] }) => ({
      title: "Breadcrumb",
      subtitle: items?.map((i) => i.name).filter(Boolean).join(" → ") || "no items",
    }),
  },
});

export const faqPageSchema = defineType({
  name: "faqPageSchema",
  title: "FAQ Page",
  type: "object",
  fields: [
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
    select: { faqs: "faqs" },
    prepare: ({ faqs }: { faqs?: unknown[] }) => ({
      title: "FAQ Page",
      subtitle: `${faqs?.length || 0} questions`,
    }),
  },
});

export const articleSchema = defineType({
  name: "articleSchema",
  title: "Article / BlogPosting",
  type: "object",
  fields: [
    defineField({ name: "headline", type: "string", title: "Headline", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2, title: "Description" }),
    defineField({ name: "author", type: "string", title: "Author", initialValue: "Clever Accounts" }),
    defineField({ name: "datePublished", type: "datetime", title: "Date published" }),
    defineField({ name: "dateModified", type: "datetime", title: "Date modified" }),
    defineField({ name: "imageUrl", type: "url", title: "Image URL" }),
  ],
  preview: {
    select: { title: "headline" },
    prepare: ({ title }: { title?: string }) => ({ title: "Article", subtitle: title }),
  },
});

export const serviceSchema = defineType({
  name: "serviceSchema",
  title: "Service",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string", title: "Service name", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "price", type: "string", title: "Price (numeric only)", description: 'e.g. "42.50"' }),
    defineField({
      name: "priceCurrency",
      type: "string",
      title: "Currency",
      initialValue: "GBP",
      options: { list: [{ title: "GBP", value: "GBP" }, { title: "USD", value: "USD" }, { title: "EUR", value: "EUR" }] },
    }),
    defineField({
      name: "billingInterval",
      type: "string",
      title: "Billing interval",
      initialValue: "month",
      options: { list: [{ title: "Per month", value: "month" }, { title: "Per year", value: "year" }, { title: "One-off", value: "one-off" }] },
    }),
    defineField({ name: "areaServed", type: "string", title: "Area served", initialValue: "United Kingdom" }),
    defineField({ name: "serviceUrl", type: "string", title: "Service page path", description: "e.g. /sole-trader" }),
  ],
  preview: {
    select: { title: "name", price: "price" },
    prepare: ({ title, price }: { title?: string; price?: string }) => ({
      title: "Service",
      subtitle: title ? `${title}${price ? ` — £${price}` : ""}` : "no name",
    }),
  },
});

export const reviewSchema = defineType({
  name: "reviewSchema",
  title: "Review",
  type: "object",
  fields: [
    defineField({ name: "author", type: "string", title: "Reviewer name", validation: (r) => r.required() }),
    defineField({ name: "rating", type: "number", title: "Rating (1–5)", validation: (r) => r.required().min(1).max(5) }),
    defineField({ name: "reviewBody", type: "text", rows: 3, title: "Review text", validation: (r) => r.required() }),
    defineField({ name: "datePublished", type: "datetime", title: "Date published" }),
    defineField({ name: "itemReviewed", type: "string", title: "What's being reviewed" }),
  ],
  preview: {
    select: { title: "author", rating: "rating" },
    prepare: ({ title, rating }: { title?: string; rating?: number }) => ({
      title: "Review",
      subtitle: `${title ?? "anon"}${rating ? ` — ${rating}/5` : ""}`,
    }),
  },
});

export const howToSchema = defineType({
  name: "howToSchema",
  title: "How-To",
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
      title: "How-To",
      subtitle: `${title ?? ""} (${steps?.length || 0} steps)`,
    }),
  },
});

export const localBusinessSchema = defineType({
  name: "localBusinessSchema",
  title: "Local Business",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string", title: "Business name" }),
    defineField({ name: "telephone", type: "string", title: "Telephone" }),
    defineField({ name: "addressLocality", type: "string", title: "City/Town" }),
    defineField({ name: "addressRegion", type: "string", title: "Region" }),
    defineField({ name: "postalCode", type: "string", title: "Postcode" }),
    defineField({ name: "addressCountry", type: "string", title: "Country code", initialValue: "GB" }),
  ],
  preview: { prepare: () => ({ title: "Local Business" }) },
});

export const rawJsonLdSchema = defineType({
  name: "rawJsonLdSchema",
  title: "Custom JSON-LD",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      title: "Internal label",
      description: "For your reference — not rendered.",
    }),
    defineField({
      name: "json",
      type: "text",
      rows: 12,
      title: "Raw JSON-LD",
      description: 'Paste the schema.org object (no <script> wrapper). Must be valid JSON.',
      validation: (r) =>
        r.required().custom((value: unknown) => {
          if (typeof value !== "string" || !value) return "Required";
          try {
            JSON.parse(value);
            return true;
          } catch {
            return "Invalid JSON";
          }
        }),
    }),
  ],
  preview: {
    select: { title: "label" },
    prepare: ({ title }: { title?: string }) => ({ title: "Custom JSON-LD", subtitle: title || "no label" }),
  },
});

export const pageSchemas = defineType({
  name: "pageSchemas",
  title: "Structured data (schema.org)",
  type: "array",
  of: [
    defineArrayMember({ type: "breadcrumbSchema" }),
    defineArrayMember({ type: "faqPageSchema" }),
    defineArrayMember({ type: "articleSchema" }),
    defineArrayMember({ type: "serviceSchema" }),
    defineArrayMember({ type: "reviewSchema" }),
    defineArrayMember({ type: "howToSchema" }),
    defineArrayMember({ type: "localBusinessSchema" }),
    defineArrayMember({ type: "rawJsonLdSchema" }),
  ],
});
