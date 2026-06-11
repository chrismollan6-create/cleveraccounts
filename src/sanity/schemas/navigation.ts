import { defineType, defineField } from "sanity";
import { PanelsTopLeft } from "lucide-react";

/**
 * Header menu + footer columns. A per-brand singleton (one for Clever, one for
 * Workwell), edited in Studio → Navigation & Footer. If a brand has no
 * navigation document, the site falls back to the built-in defaults, so this
 * is safe to leave empty.
 */
const linkFields = [
  defineField({ name: "label", title: "Label", type: "string", validation: (R) => R.required() }),
  defineField({ name: "href", title: "Link", type: "string", description: 'e.g. "/pricing" or a full https:// URL', validation: (R) => R.required() }),
];
const linkPreview = { select: { title: "label", subtitle: "href" } };

export default defineType({
  name: "navigation",
  title: "Navigation & Footer",
  type: "document",
  icon: PanelsTopLeft,
  groups: [
    { name: "header", title: "Header menu", default: true },
    { name: "footer", title: "Footer columns" },
  ],
  fields: [
    defineField({
      name: "headerLinks",
      title: "Header menu items",
      type: "array",
      group: "header",
      description: "The top navigation, left to right. A plain item is a simple link; add 'Dropdown sections' to turn it into a dropdown menu.",
      of: [
        {
          type: "object",
          name: "navItem",
          fields: [
            ...linkFields,
            defineField({
              name: "sections",
              title: "Dropdown sections (optional)",
              type: "array",
              description: "Leave empty for a simple link. Add one or more sections to make this a dropdown menu.",
              of: [
                {
                  type: "object",
                  name: "navSection",
                  fields: [
                    defineField({ name: "heading", title: "Section heading", type: "string" }),
                    defineField({
                      name: "items",
                      title: "Links",
                      type: "array",
                      of: [{ type: "object", name: "navChild", fields: linkFields, preview: linkPreview }],
                    }),
                  ],
                  preview: { select: { title: "heading" } },
                },
              ],
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "footerColumns",
      title: "Footer link columns",
      type: "array",
      group: "footer",
      description: "The columns of links in the footer. Each column has a heading and a list of links.",
      of: [
        {
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({ name: "heading", title: "Column heading", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [{ type: "object", name: "footerLink", fields: linkFields, preview: linkPreview }],
            }),
          ],
          preview: {
            select: { title: "heading", links: "links" },
            prepare: ({ title, links }) => ({ title, subtitle: `${links?.length || 0} link(s)` }),
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Navigation & Footer" }) },
});
