import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const envFile = join(ROOT, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const c = createClient({
  projectId: "sgaod5tg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const k = (() => { let n = 0; return () => `k${++n}`; })();

const doc = {
  _id: "flexiblePage-example",
  _type: "flexiblePage",
  brand: "shared",
  title: "Page builder — example",
  slug: { _type: "slug", current: "example" },
  noIndex: true,
  metaTitle: "Page builder example",
  metaDescription: "A reference page showing every page-builder block.",
  sections: [
    {
      _key: k(), _type: "block.hero",
      eyebrow: "Page builder",
      headline: "Build pages without code.",
      subheadline: "Stack pre-designed, on-brand blocks to create new pages in minutes — no developer needed.",
      primaryCtaLabel: "Get Started", primaryCtaHref: "/sign-up",
      secondaryCtaLabel: "Talk to us", secondaryCtaHref: "/contact",
      note: "Free to set up · Cancel anytime",
    },
    {
      _key: k(), _type: "block.features", tone: "tinted",
      eyebrow: "What's included", heading: "Everything you need",
      intro: "Each item is a simple line of text you can edit in Studio.",
      items: ["Dedicated accountant", "Unlimited advice", "Free software", "All tax returns filed", "Tax planning", "Switch in minutes"],
    },
    {
      _key: k(), _type: "block.cards", tone: "light",
      eyebrow: "Why us", heading: "The difference we make",
      cards: [
        { _key: k(), title: "A real person", text: "Not a call centre — a named accountant who knows you." },
        { _key: k(), title: "On time, every time", text: "Deadlines handled so you never get a penalty." },
        { _key: k(), title: "Keep more", text: "Proactive advice so you never overpay HMRC." },
      ],
    },
    {
      _key: k(), _type: "block.steps", tone: "dark",
      eyebrow: "Getting started", heading: "Up and running in minutes",
      steps: [
        { _key: k(), title: "Tell us about you", text: "Answer a few quick questions online." },
        { _key: k(), title: "Meet your accountant", text: "Matched with a dedicated expert." },
        { _key: k(), title: "Relax", text: "We handle the rest." },
      ],
    },
    {
      _key: k(), _type: "block.stats", tone: "dark",
      stats: [
        { _key: k(), value: "£0", label: "Setup fees" },
        { _key: k(), value: "Fixed", label: "Monthly fee" },
        { _key: k(), value: "Unlimited", label: "Advice" },
        { _key: k(), value: "Regulated", label: "Qualified firm" },
      ],
    },
    {
      _key: k(), _type: "block.testimonial", tone: "tinted",
      quote: "Honestly the easiest switch I've made — everything just gets done and I always know where I stand.",
      name: "A happy client", role: "Limited Company",
    },
    {
      _key: k(), _type: "block.faq", tone: "light",
      eyebrow: "Good to know", heading: "Questions, answered",
      items: [
        { _key: k(), question: "Is there a minimum contract?", answer: "No — cancel any time with 30 days' notice." },
        { _key: k(), question: "How quickly can I start?", answer: "Most clients are onboarded within a couple of days." },
      ],
    },
    {
      _key: k(), _type: "block.cta",
      heading: "Ready to get started?", text: "Set up in minutes. No setup fees, cancel anytime.",
      ctaLabel: "Get Started Free", ctaHref: "/sign-up",
    },
  ],
};

await c.createOrReplace(doc);
console.log("✓ seeded /p/example (flexiblePage-example) — noIndex, brand=shared");
