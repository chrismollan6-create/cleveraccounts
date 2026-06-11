import { defineType, defineField } from "sanity";
import { Text } from "lucide-react";
import { TONE_LIST } from "../../../components/blocks/tone";

/**
 * Page-builder block: Rich text. Free-form prose — headings, paragraphs,
 * lists and links. For "about" copy, intros, longer explanations.
 */
export default defineType({
  name: "block.richText",
  title: "Text",
  type: "object",
  icon: Text,
  fields: [
    defineField({
      name: "tone",
      title: "Background",
      type: "string",
      options: { list: [...TONE_LIST], layout: "radio" },
      initialValue: "light",
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { body: "body" },
    prepare: ({ body }) => {
      const first = Array.isArray(body) ? body.find((b: { _type?: string }) => b?._type === "block") : null;
      const text = first?.children?.map((c: { text?: string }) => c.text).join("") || "";
      return { title: text || "Text", subtitle: "Text block" };
    },
  },
});
