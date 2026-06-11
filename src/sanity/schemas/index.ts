import blogPost from "./blogPost";
import testimonial from "./testimonial";
import teamMember from "./teamMember";
import servicePage from "./servicePage";
import homePage from "./homePage";
import faq from "./faq";
import pricingPlan from "./pricingPlan";
import promoBanner from "./promoBanner";
import caseStudy from "./caseStudy";
import siteSettings from "./siteSettings";
import landingPage from "./landingPage";
import knowledgeTopic from "./knowledgeTopic";
import knowledgeArticle from "./knowledgeArticle";
import knowledgeArticleFeedback from "./knowledgeArticleFeedback";
import navigation from "./navigation";
import redirect from "./redirect";
import flexiblePage from "./flexiblePage";
import blockHero from "./blocks/blockHero";
import blockRichText from "./blocks/blockRichText";
import blockFeatures from "./blocks/blockFeatures";
import blockCards from "./blocks/blockCards";
import blockSteps from "./blocks/blockSteps";
import blockStats from "./blocks/blockStats";
import blockTestimonial from "./blocks/blockTestimonial";
import blockFaq from "./blocks/blockFaq";
import blockCta from "./blocks/blockCta";

import {
  pageSchemas,
  breadcrumbSchema,
  faqPageSchema,
  articleSchema,
  serviceSchema,
  reviewSchema,
  howToSchema,
  localBusinessSchema,
  rawJsonLdSchema,
} from "./objects/pageSchemas";

import {
  htmlEmbed,
  faqBlock,
  howToBlock,
  reviewBlock,
  ctaBlock,
} from "./objects/bodyBlocks";

export const schemaTypes = [
  blogPost,
  testimonial,
  teamMember,
  servicePage,
  homePage,
  faq,
  pricingPlan,
  promoBanner,
  caseStudy,
  siteSettings,
  landingPage,
  knowledgeTopic,
  knowledgeArticle,
  knowledgeArticleFeedback,
  navigation,
  redirect,
  // page builder
  flexiblePage,
  blockHero,
  blockRichText,
  blockFeatures,
  blockCards,
  blockSteps,
  blockStats,
  blockTestimonial,
  blockFaq,
  blockCta,
  // structured-data objects
  pageSchemas,
  breadcrumbSchema,
  faqPageSchema,
  articleSchema,
  serviceSchema,
  reviewSchema,
  howToSchema,
  localBusinessSchema,
  rawJsonLdSchema,
  // body blocks
  htmlEmbed,
  faqBlock,
  howToBlock,
  reviewBlock,
  ctaBlock,
];
