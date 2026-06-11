import { defineConfig, buildLegacyTheme } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { Search } from "lucide-react";
import { schemaTypes } from "./src/sanity/schemas";
import { dashboardPlugin } from "./src/studio/dashboardPlugin";
import { seoPlugin, SEODocumentView } from "./src/studio/seoPlugin";
import { StudioLogo } from "./src/studio/StudioLogo";

const SEO_TYPES = ["blogPost", "caseStudy", "servicePage", "landingPage", "homePage", "knowledgeArticle"];

// Branded Studio theme — a calmer, on-brand look (teal accent, deep-teal
// navbar) instead of the default Sanity grey. Purely cosmetic.
const theme = buildLegacyTheme({
  "--black": "#1f2d31",
  "--white": "#ffffff",
  "--gray": "#64748b",
  "--gray-base": "#64748b",
  "--component-bg": "#ffffff",
  "--component-text-color": "#1f2d31",
  "--brand-primary": "#1A7A9B",
  "--default-button-color": "#64748b",
  "--default-button-primary-color": "#1A7A9B",
  "--default-button-success-color": "#16a34a",
  "--default-button-warning-color": "#f59e0b",
  "--default-button-danger-color": "#e11d48",
  "--state-info-color": "#1A7A9B",
  "--state-success-color": "#16a34a",
  "--state-warning-color": "#f59e0b",
  "--state-danger-color": "#e11d48",
  "--main-navigation-color": "#1c5e70",
  "--main-navigation-color--inverted": "#ffffff",
  "--focus-color": "#1A7A9B",
});

export default defineConfig({
  name: "clever-accounts",
  title: "Clever Accounts CMS",
  projectId: "sgaod5tg",
  dataset: "production",
  basePath: "/studio",
  theme,
  studio: {
    components: { logo: StudioLogo },
  },
  plugins: [
    dashboardPlugin(),
    seoPlugin(),
    structureTool({
      defaultDocumentNode: (S, { schemaType }) => {
        if (SEO_TYPES.includes(schemaType)) {
          return S.document().views([
            S.view.form(),
            S.view.component(SEODocumentView).title("SEO").icon(Search),
          ]);
        }
        return S.document();
      },
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
              .child(
                S.list()
                  .title("Home Page")
                  .items([
                    S.listItem()
                      .title("Clever Accounts")
                      .child(
                        S.document()
                          .schemaType("homePage")
                          .documentId("homePage")
                          .title("Home Page — Clever Accounts")
                      ),
                    S.listItem()
                      .title("Workwell Accountancy")
                      .child(
                        S.document()
                          .schemaType("homePage")
                          .documentId("homePage-workwell")
                          .title("Home Page — Workwell")
                      ),
                  ])
              ),
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

            // ── Learning Centre ─────────────────────────────────────────
            S.listItem()
              .title("🔍 Learning Centre — Review queue")
              .child(
                S.list()
                  .title("Article review queue")
                  .items([
                    S.listItem()
                      .title("🔴 To review — no accountant sign-off")
                      .child(
                        S.documentList()
                          .title("Articles awaiting accountant review")
                          .schemaType("knowledgeArticle")
                          .filter('_type == "knowledgeArticle" && !defined(lastReviewed)')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                      ),
                    S.listItem()
                      .title("🟡 To review — has grounding sources")
                      .child(
                        S.documentList()
                          .title("Drafted with Google-Search citations to spot-check")
                          .schemaType("knowledgeArticle")
                          .filter(
                            '_type == "knowledgeArticle" && !defined(lastReviewed) && defined(draftedSources) && length(draftedSources) > 0'
                          )
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                      ),
                    S.listItem()
                      .title("⚠ To verify — no grounding (training-data only)")
                      .child(
                        S.documentList()
                          .title("Articles drafted without grounding — extra scrutiny needed")
                          .schemaType("knowledgeArticle")
                          .filter(
                            '_type == "knowledgeArticle" && !defined(lastReviewed) && (!defined(draftedSources) || length(draftedSources) == 0)'
                          )
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                      ),
                    S.divider(),
                    S.listItem()
                      .title("✓ Reviewed & ready to publish")
                      .child(
                        S.documentList()
                          .title("Accountant-reviewed articles")
                          .schemaType("knowledgeArticle")
                          .filter('_type == "knowledgeArticle" && defined(lastReviewed)')
                          .defaultOrdering([{ field: "lastReviewed", direction: "desc" }])
                      ),
                    S.listItem()
                      .title("🟢 Live on /learn (published)")
                      .child(
                        S.documentList()
                          .title("Published articles")
                          .schemaType("knowledgeArticle")
                          .filter('_type == "knowledgeArticle" && !(_id in path("drafts.**"))')
                          .defaultOrdering([{ field: "lastReviewed", direction: "desc" }])
                      ),
                  ])
              ),
            S.listItem()
              .title("🎓 Learning Centre — Topics")
              .child(S.documentTypeList("knowledgeTopic").title("Knowledge Topics")),
            S.listItem()
              .title("📚 Learning Centre — Articles")
              .child(S.documentTypeList("knowledgeArticle").title("Knowledge Articles")),
            S.listItem()
              .title("💬 Learning Centre — Reader Feedback")
              .child(S.documentTypeList("knowledgeArticleFeedback").title("Reader Feedback")),

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
