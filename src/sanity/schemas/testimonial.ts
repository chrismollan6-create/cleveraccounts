import { defineType, defineField } from "sanity";
import { Quote } from "lucide-react";
import { brandField } from "./objects/brandField";

/**
 * A single client review/quote. Split into a 'Review' tab (the words and who
 * said them) and a 'Settings' tab (brand + where it shows) so the form is
 * approachable for non-technical editors.
 */
export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: Quote,
  groups: [
    { name: "review", title: "Review", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    { ...brandField(), group: "settings" },
    defineField({
      name: "name",
      title: "Client name",
      type: "string",
      group: "review",
      description: "The name shown with the review, e.g. 'Sarah J' or 'James Patel'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Business type or role",
      type: "string",
      group: "review",
      description: "Shown under the name, e.g. 'Sole Trader', 'IT Contractor' or 'Limited Company Director'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Review text",
      type: "text",
      rows: 4,
      group: "review",
      description: "The client's own words, in full.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Star rating",
      type: "number",
      group: "review",
      description: "How many stars out of 5 to show with this review.",
      options: { list: [1, 2, 3, 4, 5] },
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "photo",
      title: "Client photo (optional)",
      type: "image",
      group: "review",
      description: "An optional headshot shown beside the review.",
      options: { hotspot: true },
    }),
    defineField({
      name: "featured",
      title: "Show on homepage?",
      type: "boolean",
      group: "settings",
      description: "Turn on to feature this review on the homepage.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", role: "role", rating: "rating", media: "photo" },
    prepare({ title, role, rating, media }) {
      const stars = rating ? "★".repeat(rating) : "";
      return {
        title,
        subtitle: `${role || "No role"}${stars ? ` · ${stars}` : ""}`,
        media,
      };
    },
  },
});
