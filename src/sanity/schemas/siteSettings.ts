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
  ],
  preview: {
    select: { title: "phone" },
    prepare: ({ title }) => ({ title: "Site Settings", subtitle: title }),
  },
});
