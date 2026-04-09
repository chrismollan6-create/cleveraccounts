import { client } from "./client";

// Blog posts
export async function getBlogPosts() {
  return client.fetch(`*[_type == "blogPost"] | order(publishedAt desc) {
    _id, title, slug, excerpt, featuredImage, category, author, publishedAt
  }`);
}

export async function getBlogPost(slug: string) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      _id, title, slug, excerpt, featuredImage, category, author, publishedAt,
      body, metaTitle, metaDescription
    }`,
    { slug }
  );
}

export async function getBlogSlugs() {
  return client.fetch(`*[_type == "blogPost"].slug.current`);
}

// Testimonials
export async function getTestimonials(featured?: boolean) {
  const filter = featured ? ` && featured == true` : "";
  return client.fetch(`*[_type == "testimonial"${filter}] | order(_createdAt desc) {
    _id, name, role, quote, rating, photo, featured
  }`);
}

// Team members
export async function getTeamMembers() {
  return client.fetch(`*[_type == "teamMember"] | order(order asc) {
    _id, name, role, speciality, experience, bio, photo, specialities
  }`);
}

// Service pages
export async function getServicePage(slug: string) {
  return client.fetch(
    `*[_type == "servicePage" && slug.current == $slug][0]`,
    { slug }
  );
}

// Home page content
export async function getHomePage() {
  return client.fetch(`*[_type == "homePage"][0]`);
}

// FAQs
export async function getFAQs(category?: string) {
  const filter = category ? ` && category == "${category}"` : "";
  return client.fetch(`*[_type == "faq"${filter}] | order(category asc, order asc) {
    _id, question, answer, category, order, featured
  }`);
}

export async function getFeaturedFAQs() {
  return client.fetch(`*[_type == "faq" && featured == true] | order(order asc) {
    _id, question, answer, category
  }`);
}

// Pricing plans
export async function getPricingPlans() {
  return client.fetch(`*[_type == "pricingPlan"] | order(order asc) {
    _id, name, subtitle, price, priceNote, popular, features, ctaText, ctaLink, order
  }`);
}

// Promo banner
export async function getActivePromoBanner() {
  const now = new Date().toISOString();
  return client.fetch(`*[_type == "promoBanner" && active == true &&
    (startDate == null || startDate <= $now) &&
    (endDate == null || endDate >= $now)
  ] | order(_createdAt desc)[0] {
    _id, text, linkText, linkUrl, backgroundColor
  }`, { now });
}

// Case studies
export async function getCaseStudies() {
  return client.fetch(`*[_type == "caseStudy"] | order(publishedAt desc) {
    _id, clientName, slug, businessType, industry, photo, headline, summary, metrics, featured
  }`);
}

export async function getCaseStudy(slug: string) {
  return client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0]`,
    { slug }
  );
}

export async function getFeaturedCaseStudy() {
  return client.fetch(`*[_type == "caseStudy" && featured == true] | order(publishedAt desc)[0] {
    _id, clientName, slug, businessType, industry, photo, headline, summary,
    challenge, solution, results, quote, metrics
  }`);
}
