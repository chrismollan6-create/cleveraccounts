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
