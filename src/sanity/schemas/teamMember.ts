import { defineType, defineField } from "sanity";
import { User } from "lucide-react";

/**
 * A member of the team, shown on the "Meet the team" sections. Organised into
 * tabs (Profile / Settings) so the form stays approachable for non-technical
 * editors.
 */
export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: User,
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      description: "The team member's full name, shown as the heading on their card.",
      type: "string",
      group: "profile",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Job title",
      description: "Their position — e.g. 'Senior Accountant' or 'Client Manager'.",
      type: "string",
      group: "profile",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "speciality",
      title: "Speciality (one line)",
      type: "string",
      group: "profile",
      description: "A short tagline for what they're known for — e.g. 'Sole Trader Specialist', 'IR35 Expert'.",
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "string",
      group: "profile",
      description: "How long they've been in the field — e.g. '12 years experience'.",
    }),
    defineField({
      name: "bio",
      title: "Short bio or quote",
      description: "A sentence or two about them, or a personal quote shown on their card.",
      type: "text",
      rows: 3,
      group: "profile",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      description: "A headshot of the team member.",
      type: "image",
      group: "profile",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text (image description)",
          type: "string",
          description: "Describe the image for screen readers & Google — e.g. 'Jane Smith, Senior Accountant'.",
          validation: (R) => R.custom((v) => (v ? true : "Add alt text for accessibility & SEO")).warning(),
        }),
      ],
    }),
    defineField({
      name: "specialities",
      title: "Speciality tags",
      type: "array",
      group: "profile",
      of: [{ type: "string" }],
      description: "Add one tag per area of expertise — e.g. 'Self Assessment', 'MTD', 'Corporation Tax'.",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      group: "settings",
      description: "Controls the position in the team list. Lower numbers appear first.",
    }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", role: "role", media: "photo" },
    prepare({ title, role, media }) {
      return { title, subtitle: role || "Team member", media };
    },
  },
});
