import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Main Phone Number",
      type: "string",
      description: "Displayed in the header desktop nav and footer (e.g. 0113 518 8800)",
    }),
    defineField({
      name: "freephone",
      title: "Freephone Number",
      type: "string",
      description: "Displayed in the top bar and landing pages (e.g. 0800 756 9786)",
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "tagline",
      title: "Company Tagline",
      type: "string",
    }),
    defineField({
      name: "offices",
      title: "Office Locations",
      type: "array",
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
      title: "Company Stats",
      type: "object",
      description: "Used in hero sections and social proof strips across the site",
      fields: [
        { name: "years", title: "Years in Business", type: "number" },
        { name: "businesses", title: "Businesses Served", type: "number" },
        { name: "rating", title: "Star Rating (e.g. 5)", type: "number" },
      ],
    }),
    defineField({
      name: "social",
      title: "Social Media Links",
      type: "object",
      fields: [
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "twitter", title: "Twitter / X URL", type: "url" },
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
      ],
    }),
    defineField({
      name: "promo",
      title: "Promotional Offer",
      type: "object",
      description: "Controls the discount badge shown on pricing cards. Toggle 'enabled' to show or hide site-wide.",
      fields: [
        {
          name: "enabled",
          title: "Enable promo badge",
          type: "boolean",
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
          of: [{ type: "string" }],
          options: {
            list: [
              { title: "Sole Trader", value: "Sole Trader" },
              { title: "Limited Company", value: "Limited Company" },
              { title: "Contractor", value: "Contractor" },
            ],
          },
          description: "Which pricing plans show the badge",
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
