import type { Metadata } from "next";
import HomePageClient, { type CmsHomePage } from "./HomePageClient";
import { FAQPageJsonLd, PricingJsonLd } from "@/components/seo/StructuredData";
import { getSiteSettings, getHomePage, getPricingPlans } from "@/sanity/queries";
import { promoBadgesByPlanName } from "@/lib/promo";
import { getBrand } from "@/lib/brand";

const DEFAULT_TITLE = "Clever Accounts | Expert Online Accountants UK — From £42.50/month";
const DEFAULT_DESC =
  "Your own dedicated UK accountant, unlimited advice, and free FreeAgent software for one fixed monthly fee. Sole traders, limited companies, contractors & freelancers. Rated 4.7 on Trustpilot — 10,000+ businesses served.";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  const fallback =
    brand.id === "clever"
      ? { title: DEFAULT_TITLE, description: DEFAULT_DESC }
      : {
          title: `${brand.name} | Accountants for Sole Traders, Limited Companies & Contractors`,
          description:
            brand.tagline ||
            `${brand.name} — your own dedicated UK accountant, unlimited advice and free software for one fixed monthly fee.`,
        };
  let title = fallback.title;
  let description = fallback.description;
  try {
    const home = await getHomePage(brand.id);
    if (home?.metaTitle) title = home.metaTitle;
    if (home?.metaDescription) description = home.metaDescription;
  } catch { /* use defaults */ }

  return {
    title,
    description,
    alternates: { canonical: `https://${brand.domain}/` },
  };
}

const buildHomeFaqs = (freephone: string, email: string) => [
  {
    q: "Is there a minimum contract or cancellation fee?",
    a: "No. There's no minimum term and no exit fees — you can cancel at any time with 30 days' notice. Your data and records stay yours.",
  },
  {
    q: "Do I need to switch away from my current accountant?",
    a: "We handle the whole switch for you, free of charge. We'll write to your existing accountant, obtain your records, and make sure nothing falls through the cracks.",
  },
  {
    q: "How quickly can I get set up?",
    a: "Most clients are fully onboarded within 2 business days. Sign up online in 2 minutes and your dedicated accountant will be in touch the same day.",
  },
  {
    q: "What's actually included in the monthly fee?",
    a: "Your dedicated accountant, all statutory filings (year-end accounts, corporation tax, VAT, payroll, self assessment where applicable), unlimited phone and email advice, proactive tax planning, and free FreeAgent software. No hidden extras.",
  },
  {
    q: "Do you handle IR35 for contractors?",
    a: "Yes. We review every contract, assess your IR35 status, and offer our Clever FLEX umbrella solution for inside-IR35 engagements — switch between PSC and umbrella seamlessly in a single account.",
  },
  {
    q: "Are you qualified and regulated?",
    a: "Yes — we're FCSA accredited for our umbrella service and a FreeAgent Platinum Partner. Your accounts are in qualified, professionally accountable hands.",
  },
  {
    q: "Can I speak to a real person before signing up?",
    a: `Absolutely. Call us on ${freephone}, request a callback via the chat bubble, or email ${email} — a qualified accountant will walk you through everything.`,
  },
];

// Workwell-specific FAQs — no Clever-specific claims (FreeAgent Platinum,
// Clever FLEX, FCSA), brand-neutral software/umbrella wording.
const buildWorkwellFaqs = (freephone: string, email: string) => [
  {
    q: "Is there a minimum contract or cancellation fee?",
    a: "No. There's no minimum term and no exit fees — cancel any time with 30 days' notice. Your data and records stay yours.",
  },
  {
    q: "Do I need to switch away from my current accountant?",
    a: "No — we handle the whole switch for you, free of charge. We'll write to your existing accountant, obtain your records, and make sure nothing falls through the cracks.",
  },
  {
    q: "How quickly can I get set up?",
    a: "Most clients are fully onboarded within a couple of business days. Sign up online in minutes and your dedicated accountant will be in touch.",
  },
  {
    q: "What's included in the monthly fee?",
    a: "Your dedicated accountant, all your statutory filings (year-end accounts, corporation tax, VAT, payroll and self assessment where applicable), unlimited phone and email advice, proactive tax planning, and free accounting software. No hidden extras.",
  },
  {
    q: "Do you help contractors with IR35?",
    a: "Yes. We review your contracts, assess your IR35 status and keep you compliant and tax-efficient — inside or outside IR35.",
  },
  {
    q: "Are you qualified and regulated?",
    a: "Yes — your accounts are handled by qualified, professionally accountable accountants.",
  },
  {
    q: "Can I speak to a real person before signing up?",
    a: `Absolutely. Call us on ${freephone}, request a callback, or email ${email} — a qualified accountant will walk you through everything.`,
  },
];

export default async function HomePage() {
  const brand = await getBrand();
  let promoBadges: Record<string, string> = {};
  let freephone = brand.freephone;
  let email = brand.email;
  try {
    const settings = await getSiteSettings();
    // siteSettings is a shared (Clever) singleton — only use its contact
    // details for Clever; other brands keep their registry values.
    if (brand.id === "clever") {
      if (settings?.freephone) freephone = settings.freephone;
      if (settings?.email) email = settings.email;
    }
    promoBadges = promoBadgesByPlanName(settings?.promo);
  } catch { /* use defaults */ }

  let pricingPlans: any[] = [];
  try {
    pricingPlans = (await getPricingPlans()) || [];
  } catch { /* fallback to hardcoded */ }

  // Packages are shared, but feature copy can name Clever-specific products
  // (e.g. "Clever FLEX"). Strip them for Workwell at the source so they don't
  // even appear in serialized data.
  if (brand.id === "workwell") {
    pricingPlans = pricingPlans.map((p) =>
      Array.isArray(p?.features)
        ? {
            ...p,
            features: p.features.map((f: string) =>
              typeof f === "string"
                ? f.replace(/Clever FLEX umbrella solution/gi, "Umbrella solution").replace(/\bClever FLEX\b/gi, "umbrella")
                : f,
            ),
          }
        : p,
    );
  }

  let home: CmsHomePage | null = null;
  try {
    home = await getHomePage(brand.id);
  } catch { /* HomePageClient falls back to hardcoded hero copy */ }

  const homeFaqs =
    brand.id === "workwell" ? buildWorkwellFaqs(freephone, email) : buildHomeFaqs(freephone, email);

  return (
    <>
      <FAQPageJsonLd faqs={homeFaqs} />
      <PricingJsonLd />
      <HomePageClient faqs={homeFaqs} promoBadges={promoBadges} pricingPlans={pricingPlans} freephone={freephone} home={home} />
    </>
  );
}
