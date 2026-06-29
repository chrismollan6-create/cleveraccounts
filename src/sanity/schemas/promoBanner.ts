import { defineType, defineField } from "sanity";
import { Megaphone } from "lucide-react";
import { brandField } from "./objects/brandField";

/**
 * The thin promotional banner shown at the top of the site. Organised into
 * tabs (Content / Settings) so the form stays approachable for non-technical
 * editors.
 */
export default defineType({
  name: "promoBanner",
  title: "Promotion Banner",
  type: "document",
  icon: Megaphone,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fieldsets: [
    { name: "link", title: "Optional link", options: { collapsible: false } },
    { name: "schedule", title: "Schedule (optional)", options: { collapsible: false } },
  ],
  fields: [
    { ...brandField(), group: "settings" },
    defineField({
      name: "text",
      title: "Banner message",
      type: "string",
      group: "content",
      description: "The headline message shown in the banner — e.g. 'Switch today — get your first month FREE!'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkText",
      title: "Button / link text",
      type: "string",
      group: "content",
      fieldset: "link",
      description: "The clickable wording — e.g. 'Learn more' or 'Claim offer'. Leave blank for no link.",
    }),
    defineField({
      name: "linkUrl",
      title: "Link destination",
      type: "string",
      group: "content",
      fieldset: "link",
      description: "Where the link goes — e.g. '/sign-up' or '/pricing'.",
    }),
    defineField({
      name: "backgroundColor",
      title: "Banner colour",
      description: "The background colour of the banner. Pick the one that suits the message.",
      type: "string",
      group: "content",
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
      title: "Show this banner?",
      type: "boolean",
      group: "settings",
      description: "Turn off to hide the banner without deleting it.",
      initialValue: true,
    }),
    defineField({
      name: "startDate",
      title: "Show from",
      type: "datetime",
      group: "settings",
      fieldset: "schedule",
      description: "The banner appears from this date. Leave blank to show it immediately.",
    }),
    defineField({
      name: "endDate",
      title: "Hide after",
      type: "datetime",
      group: "settings",
      fieldset: "schedule",
      description: "The banner disappears after this date. Leave blank for no expiry.",
    }),
  ],
  preview: {
    select: { title: "text", active: "active", brand: "brand" },
    prepare({ title, active, brand }) {
      const brandLabel = brand === "workwell" ? "Workwell" : brand === "clever" ? "Clever" : "Shared";
      return { title, subtitle: `${brandLabel} · ${active ? "Active" : "Inactive"}` };
    },
  },
});
