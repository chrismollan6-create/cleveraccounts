import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "clever-accounts",
  title: "Clever Accounts CMS",
  projectId: "sgaod5tg",
  dataset: "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Home Page")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.divider(),
            S.listItem()
              .title("Blog Posts")
              .child(S.documentTypeList("blogPost").title("Blog Posts")),
            S.divider(),
            S.listItem()
              .title("Services")
              .child(S.documentTypeList("servicePage").title("Service Pages")),
            S.listItem()
              .title("Testimonials")
              .child(S.documentTypeList("testimonial").title("Testimonials")),
            S.listItem()
              .title("Team Members")
              .child(S.documentTypeList("teamMember").title("Team Members")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
