import { defineType, defineField } from "sanity";
import { Settings } from "lucide-react";

/**
 * Site-wide settings (contact details, offices, social links, promo banner).
 * Organised into tabs (Contact / Company / Promotion) so the form stays
 * approachable for non-technical editors.
 */
export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: Settings,
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "company", title: "Company" },
    { name: "promo", title: "Promotion" },
  ],
  fields: [
    defineField({
      name: "phone",
      title: "Main phone number",
      type: "string",
      group: "contact",
      description: "Shown in the header navigation and the footer (e.g. 0113 518 8800).",
    }),
    defineField({
      name: "freephone",
      title: "Freephone number",
      type: "string",
      group: "contact",
      description: "Shown in the top bar and on landing pages (e.g. 0800 ...).",
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      group: "contact",
      description: "The main email address shown to visitors.",
    }),
    defineField({
      name: "tagline",
      title: "Company tagline",
      type: "string",
      group: "company",
      description: "A short strapline describing the business.",
    }),
    defineField({
      name: "offices",
      title: "Office locations",
      type: "array",
      group: "company",
      description: "Your office addresses, shown in the footer and on contact pages.",
      of: [
        {
          type: "object",
          fields: [
            { name: "city", title: "City", type: "string" },
            { name: "address", title: "Full Address", type: "text", rows: 2 },
          ],
          preview: {
            select: { title: "city", subtitle: "address" },
          },
        },
      ],
    }),
    defineField({
      name: "stats",
      title: "Company stats",
      type: "object",
      group: "company",
      description: "Headline numbers used in hero sections and social-proof strips across the site.",
      fields: [
        { name: "years", title: "Years in Business", type: "number" },
        { name: "businesses", title: "Businesses Served", type: "number" },
        { name: "rating", title: "Star Rating (e.g. 5)", type: "number" },
      ],
    }),
    defineField({
      name: "social",
      title: "Social media links",
      type: "object",
      group: "company",
      description: "Links to your social profiles, shown in the footer.",
      fields: [
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "twitter", title: "Twitter / X URL", type: "url" },
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
      ],
    }),
    defineField({
      name: "promo",
      title: "Promotional offer",
      type: "object",
      group: "promo",
      description: "Controls the discount badge shown on pricing cards. Turn 'Enable promo badge' on or off to show or hide it everywhere.",
      fields: [
        {
          name: "enabled",
          title: "Enable promo badge",
          type: "boolean",
          description: "Turn the discount badge on or off across the whole site.",
          initialValue: false,
        },
        {
          name: "discountPercent",
          title: "Discount percentage",
          type: "number",
          description: "e.g. 50 for 50% off",
        },
        {
          name: "durationMonths",
          title: "Duration (months)",
          type: "number",
          description: "e.g. 3 for first 3 months",
        },
        {
          name: "badgeText",
          title: "Badge label (optional override)",
          type: "string",
          description: "Leave blank to auto-generate from discount % and duration, e.g. '50% off for 3 months'",
        },
        {
          name: "appliesTo",
          title: "Applies to plans",
          type: "array",
          of: [{ type: "reference", to: [{ type: "pricingPlan" }] }],
          description:
            "Tick the pricing plans that should show this discount badge. " +
            "The list is driven by your actual Pricing Plan documents, so it " +
            "stays in sync automatically when a plan is renamed.",
        },
        {
          name: "endDate",
          title: "Offer end date (optional)",
          type: "date",
          description: "Displays a deadline on the badge if set",
        },
      ],
    }),
  ],
  preview: {
    select: { title: "phone" },
    prepare: ({ title }) => ({ title: "Site Settings", subtitle: title }),
  },
});
