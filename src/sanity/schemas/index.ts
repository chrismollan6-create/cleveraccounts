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
