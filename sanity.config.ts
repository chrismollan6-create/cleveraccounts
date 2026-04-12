import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { dashboardPlugin } from "./src/studio/dashboardPlugin";

export default defineConfig({
  name: "clever-accounts",
  title: "Clever Accounts CMS",
  projectId: "sgaod5tg",
  dataset: "production",
  basePath: "/studio",
  plugins: [
    dashboardPlugin(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Clever Accounts CMS")
          .items([
            // ── Global settings ──────────────────────────────────────────
            S.listItem()
              .title("⚙️ Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("🏠 Home Page")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem()
              .title("📢 Promo Banner")
              .child(S.documentTypeList("promoBanner").title("Promotion Banners")),

            S.divider(),

            // ── Marketing & Pages ────────────────────────────────────────
            S.listItem()
              .title("🚀 Landing Pages (CMS)")
              .child(S.documentTypeList("landingPage").title("Landing Pages")),
            S.listItem()
              .title("💼 Service Pages")
              .child(S.documentTypeList("servicePage").title("Service Pages")),

            S.divider(),

            // ── Content ──────────────────────────────────────────────────
            S.listItem()
              .title("📝 Blog Posts")
              .child(S.documentTypeList("blogPost").title("Blog Posts")),
            S.listItem()
              .title("📖 Case Studies")
              .child(S.documentTypeList("caseStudy").title("Case Studies")),

            S.divider(),

            // ── Pricing & Plans ──────────────────────────────────────────
            S.listItem()
              .title("💰 Pricing Plans")
              .child(S.documentTypeList("pricingPlan").title("Pricing Plans")),

            S.divider(),

            // ── Social proof & Team ──────────────────────────────────────
            S.listItem()
              .title("⭐ Testimonials")
              .child(S.documentTypeList("testimonial").title("Testimonials")),
            S.listItem()
              .title("👥 Team Members")
              .child(S.documentTypeList("teamMember").title("Team Members")),

            S.divider(),

            // ── Support ──────────────────────────────────────────────────
            S.listItem()
              .title("❓ FAQs")
              .child(
                S.documentTypeList("faq").title("Frequently Asked Questions")
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
