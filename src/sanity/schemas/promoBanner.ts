import { defineType, defineField } from "sanity";

export default defineType({
  name: "promoBanner",
  title: "Promotion Banner",
  type: "document",
  fields: [
    defineField({
      name: "text",
      title: "Banner Text",
      type: "string",
      description: "e.g. 'Switch today — get your first month FREE!'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkText",
      title: "Link Text (optional)",
      type: "string",
      description: "e.g. 'Learn more' or 'Claim offer'",
    }),
    defineField({
      name: "linkUrl",
      title: "Link URL (optional)",
      type: "string",
      description: "e.g. '/sign-up' or '/pricing'",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      options: {
        list: [
          { title: "Orange (CTA)", value: "orange" },
          { title: "Teal (Brand)", value: "teal" },
          { title: "Dark Navy", value: "dark" },
          { title: "Green (Success)", value: "green" },
          { title: "Red (Urgent)", value: "red" },
        ],
      },
      initialValue: "orange",
    }),
    defineField({
      name: "active",
      title: "Active?",
      type: "boolean",
      description: "Toggle this off to hide the banner without deleting it",
      initialValue: true,
    }),
    defineField({
      name: "startDate",
      title: "Start Date (optional)",
      type: "datetime",
      description: "Banner appears from this date. Leave blank for immediately.",
    }),
    defineField({
      name: "endDate",
      title: "End Date (optional)",
      type: "datetime",
      description: "Banner disappears after this date. Leave blank for no expiry.",
    }),
  ],
  preview: {
    select: { title: "text", active: "active" },
    prepare({ title, active }) {
      return { title, subtitle: active ? "Active" : "Inactive" };
    },
  },
});
