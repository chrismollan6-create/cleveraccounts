import { defineType, defineField } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Job Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "speciality",
      title: "Speciality",
      type: "string",
      description: "e.g. 'Sole Trader Specialist', 'IR35 Expert'",
    }),
    defineField({
      name: "experience",
      title: "Years of Experience",
      type: "string",
      description: "e.g. '12 years experience'",
    }),
    defineField({
      name: "bio",
      title: "Short Bio / Quote",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "specialities",
      title: "Speciality Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. 'Self Assessment', 'MTD', 'Corporation Tax'",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
