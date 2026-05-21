/**
 * Multi-tenant brand registry.
 *
 * Each brand is keyed by a short id ('clever' | 'workwell'). The host header
 * (resolved in src/middleware.ts → src/lib/brand.ts) decides which brand a
 * request is rendered for. Components should NOT reach into BRANDS directly:
 *
 *   - Server components / route handlers: `import { getBrand } from '@/lib/brand'`
 *   - Client components: `import { useBrand } from '@/lib/useBrand'`
 *
 */

export type BrandId = 'clever' | 'workwell';

/**
 * Possessive form of a brand name for natural-sounding copy. Handles the
 * apostrophe-only suffix when the name ends in 's' (e.g. "Clever Accounts'")
 * and the full "'s" otherwise (e.g. "Workwell Accountancy's").
 */
export function brandPossessive(brand: { name: string }): string {
  return brand.name.endsWith('s') ? `${brand.name}'` : `${brand.name}'s`;
}

export interface BrandConfig {
  /** Short id used everywhere internally. */
  id: BrandId;
  /** Public display name (footer, emails, page titles). */
  name: string;
  /** Companies House registered name (legal/footer). */
  legalName: string;
  /** Marketing tagline shown in hero/meta. */
  tagline: string;
  /** Apex domain — used for canonical URLs, sitemap, robots. */
  domain: string;
  /** Where the multi-tenant Next app is reachable for this brand. */
  appDomain: string;
  /**
   * Hostname for the client portal (no scheme). Middleware uses this to detect
   * portal requests and rewrite paths into the `/portal/*` route segment.
   */
  portalDomain: string;
  /** Customer portal URL (login link, used by marketing CTAs). */
  portalUrl: string;
  /** Primary phone number shown on marketing surfaces. */
  phone: string;
  /** Freephone / sales number for funnel CTAs. */
  freephone: string;
  /** Public-facing inbox. */
  email: string;
  /** Sender domain / domain for transactional email From address. */
  senderEmail: string;
  /** Support inbox shown in legal documents (engagement letter §13). */
  supportEmail: string;
  /** Full postal address shown in legal documents (engagement letter complaints C1). */
  postalAddress: string;
  /**
   * Salesforce Lead.Branding__c value (long form). Sent on signup payloads.
   * Apex `LeadConversionService` translates this to the short Account form.
   */
  salesforceLeadValue: string;
  /** Salesforce Account.Branding__c / Contact.Branding__c value (short form). */
  salesforceAccountValue: string;
  /** Logo + asset paths under /public/brand/{id}/. */
  assets: {
    logo: string;
    logoWhite: string;
    /**
     * Favicon set — shaped to drop straight into Next.js `Metadata.icons`.
     * `icon` is the standard favicon(s) (any number of sizes); `apple` is
     * the iOS home-screen touch icon.
     */
    favicon?: {
      icon: { url: string; sizes?: string; type?: string }[];
      apple?: string;
    };
    ogImage?: string;
  };
  /** Tailwind v4 token overrides (applied via [data-brand="{id}"] in globals.css). */
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    primary50: string;
    secondary: string;
    secondaryDark: string;
    secondaryLight: string;
    accent: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textLight: string;
  };
  /** Google Font family name + weights (loaded by layout). */
  font: {
    family: string;
    weights: string;
  };
  /** Office locations shown on contact/about pages. */
  offices: { city: string; address: string }[];
  /** At-a-glance stats for hero / about pages. */
  stats: {
    years: number;
    businesses: number;
    setupFee: number;
    rating: number;
  };
  /** Public social profiles. */
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  /** GA4 / GTM ids per brand (TODO populate WW values once GA property exists). */
  analytics?: {
    gtmId?: string;
    ga4Id?: string;
  };
  /**
   * Trustpilot profile — score shown in funnel/marketing trust pills, url for
   * the "read our reviews" link. Optional: omit for a brand with no Trustpilot
   * presence and the trust-pill segment is hidden rather than showing a score.
   */
  trustpilot?: {
    /** Display score as a string, e.g. "4.7" — string keeps formatting exact. */
    rating: string;
    /** Public Trustpilot profile URL. */
    url: string;
    /** Optional review-count blurb, e.g. "700+". */
    reviewCount?: string;
  };
  /**
   * Legal page URLs shown in footers. Use relative paths ("/terms") for pages
   * the brand's own Next site serves, or absolute URLs for externally-hosted
   * pages (e.g. Workwell's live on its WordPress marketing site).
   */
  legal: {
    privacyUrl: string;
    /** Optional — some brands have no standalone terms page. */
    termsUrl?: string;
  };
}

export const BRANDS = {
  clever: {
    id: 'clever',
    name: 'Clever Accounts',
    legalName: 'Clever Accounts Ltd',
    tagline: 'Online Accounting Made Clever',
    domain: 'cleveraccounts.com',
    appDomain: 'cleveraccounts.com',
    portalDomain: 'my.cleveraccounts.com',
    portalUrl: 'https://my.cleveraccounts.com',
    phone: '0113 518 8800',
    freephone: '0113 515 8800',
    email: 'info@cleveraccounts.com',
    // senderEmail = the Resend-verified domain used as From. Must be on a
    // domain we've verified DKIM/SPF for in Resend (currently mail.cleveraccounts.com).
    // supportEmail = the human-monitored inbox where replies go (Reply-To).
    senderEmail: 'support@mail.cleveraccounts.com',
    supportEmail: 'support@cleveraccounts.com',
    postalAddress: 'Brookfield Court, Selby Road, Leeds, LS25 1NB',
    salesforceLeadValue: 'Clever Accounts Ltd',
    salesforceAccountValue: 'Clever Accounts',
    assets: {
      logo: '/brand/clever/logo.png',
      logoWhite: '/brand/clever/logo-white.jpg',
      favicon: { icon: [{ url: '/brand/clever/favicon.ico' }] },
    },
    colors: {
      primary: '#1A7A9B',
      primaryDark: '#136280',
      primaryLight: '#3BA7C4',
      primary50: '#F0F9FF',
      secondary: '#F97316',
      secondaryDark: '#EA580C',
      secondaryLight: '#FDBA74',
      accent: '#8B5CF6',
      surface: '#F0F9FF',
      surfaceAlt: '#E0F2FE',
      text: '#1E293B',
      textLight: '#64748B',
    },
    font: {
      family: 'Inter',
      weights: '400;500;600;700;800;900',
    },
    offices: [
      { city: 'Leeds', address: 'Leeds, West Yorkshire, UK' },
    ],
    stats: { years: 20, businesses: 10000, setupFee: 0, rating: 5 },
    social: {
      facebook: 'https://www.facebook.com/cleveraccounts',
      twitter: 'https://twitter.com/cleveraccounts',
      linkedin: 'https://www.linkedin.com/company/clever-accounts',
    },
    trustpilot: {
      rating: '4.7',
      url: 'https://uk.trustpilot.com/review/cleveraccounts.com',
      reviewCount: '700+',
    },
    legal: {
      privacyUrl: '/privacy',
      termsUrl: '/terms',
    },
  },
  workwell: {
    id: 'workwell',
    name: 'Workwell Accountancy',
    legalName: 'Workwell Accountancy',
    tagline: 'Accountancy Service Experts',
    domain: 'workwellaccountancy.com',
    // Funnel/app surfaces (sign-up, engagement letter) are served from the
    // portal subdomain — a single domain hosts both the authenticated portal
    // and the public funnel passthrough. There is no separate app.* subdomain.
    appDomain: 'my.workwellaccountancy.com',
    portalDomain: 'my.workwellaccountancy.com',
    portalUrl: 'https://my.workwellaccountancy.com',
    phone: '01923 257 300',
    freephone: '01923 257 300',
    email: 'clientsupport@workwellsolutions.com',
    senderEmail: 'clientsupport@workwellsolutions.com',
    supportEmail: 'clientsupport@workwellsolutions.com',
    postalAddress: 'Radius House, 51 Clarendon Road, Watford, Hertfordshire, WD17 1HP',
    salesforceLeadValue: 'Workwell Accountancy Solutions',
    salesforceAccountValue: 'Workwell',
    assets: {
      logo: '/brand/workwell/logo.png',
      logoWhite: '/brand/workwell/logo-white.png',
      favicon: {
        icon: [
          { url: '/brand/workwell/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { url: '/brand/workwell/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: '/brand/workwell/apple-touch-icon.png',
      },
    },
    // Canonical palette extracted from workwellaccountancy.com theme CSS (2026-05-09).
    // Apex StripeService.cls (#2C5F8A) and LeadSignupService.cls (#0d9488) are
    // both wrong — should be reconciled to #32535a in a follow-up.
    colors: {
      primary: '#32535a',
      primaryDark: '#233a40',
      primaryLight: '#4d7079',
      primary50: '#f6f9f0',
      secondary: '#9cbf50',
      secondaryDark: '#6f8052',
      secondaryLight: '#bdd289',
      accent: '#71c5d6',
      surface: '#edf3e0',
      surfaceAlt: '#fafbec',
      text: '#32535a',
      textLight: '#6a7b82',
    },
    font: {
      family: 'Montserrat Alternates',
      weights: '400;700',
    },
    offices: [
      {
        city: 'Watford',
        address: 'Radius House, 51 Clarendon Road, Watford, Hertfordshire, WD17 1HP',
      },
    ],
    stats: { years: 20, businesses: 10000, setupFee: 0, rating: 5 },
    social: {},
    // TODO: add Workwell's Trustpilot score + review count once confirmed —
    // Trustpilot blocks automated lookup. Profile URL is known; fill in the
    // rating and the funnel trust pill will show the Trustpilot segment.
    trustpilot: {
      rating: '4.6',
      url: 'https://uk.trustpilot.com/review/workwellsolutions.com',
    },
    legal: {
      // Workwell's legal pages live on its WordPress marketing site.
      privacyUrl: 'https://workwellaccountancy.com/privacy-data-cookie-policy/',
      // No standalone Workwell terms page exists — termsUrl intentionally
      // omitted, so the footer renders Privacy only for Workwell.
    },
  },
} as const satisfies Record<BrandId, BrandConfig>;

export const NAV_LINKS = [
  {
    label: "Services",
    href: "/our-services",
    sections: [
      {
        heading: "Who We Help",
        items: [
          { label: "Sole Trader", href: "/sole-trader" },
          { label: "Limited Company", href: "/limited-company" },
          { label: "Contractor", href: "/contractor-accountancy" },
          { label: "Freelancer", href: "/freelancer-accountancy" },
          { label: "Landlord", href: "/landlord-accounting" },
          { label: "Startups", href: "/accounting-for-startups" },
          { label: "CIS / Construction", href: "/cis-accounting" },
          { label: "Ecommerce", href: "/ecommerce-accounting" },
        ],
      },
      {
        heading: "Specialist Services",
        items: [
          { label: "IR35 Specialist", href: "/contractor-accountants/ir35" },
          { label: "Self Assessment", href: "/self-assessment" },
          { label: "VAT Returns", href: "/vat-returns" },
          { label: "Making Tax Digital", href: "/making-tax-digital" },
          { label: "Take Home Calculator", href: "/take-home-calculator" },
          { label: "Integrations", href: "/integrations" },
          { label: "Switch Accountant", href: "/our-services/accountant-switch" },
          { label: "Partner Services", href: "/partners" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const SERVICE_CATEGORIES = [
  {
    title: "Sole Trader",
    description: "Straightforward, hassle-free online accounting designed exclusively for sole traders.",
    href: "/sole-trader",
    icon: "User",
    price: "42.50",
  },
  {
    title: "Limited Company",
    description: "Complete accounting service and software for your limited company, all in one monthly fee.",
    href: "/limited-company",
    icon: "Building2",
    price: "104.50",
  },
  {
    title: "Contractor",
    description: "Specialist contractor accounting with end-to-end IR35 support and Clever FLEX.",
    href: "/contractor-accountancy",
    icon: "Briefcase",
    price: "104.50",
  },
  {
    title: "Landlord",
    description: "Comprehensive accounting for property investors and landlords. Peace of mind included.",
    href: "/landlord-accounting",
    icon: "Home",
    price: "42.50",
  },
  {
    title: "Startup",
    description: "Get your new business off to the best start with expert accounting from day one.",
    href: "/accounting-for-startups",
    icon: "Rocket",
    price: "42.50",
  },
];

export const FEATURES = [
  {
    title: "Dedicated Accountant",
    description: "Your own dedicated accountant who knows your business inside out.",
    icon: "UserCheck",
  },
  {
    title: "Unlimited Advice",
    description: "Call or email as often as you need — no extra charges, ever.",
    icon: "MessageCircle",
  },
  {
    title: "Free Accounting Software",
    description: "FreeAgent accounting software included free with every package.",
    icon: "Monitor",
  },
  {
    title: "No Setup Fees",
    description: "Get started immediately with zero upfront costs.",
    icon: "BadgePoundSterling",
  },
  {
    title: "No Minimum Contract",
    description: "Stay because you want to, not because you have to. Cancel anytime.",
    icon: "ShieldCheck",
  },
  {
    title: "Tax Efficiency Advice",
    description: "Proactive advice to ensure you're as tax-efficient as possible.",
    icon: "TrendingDown",
  },
  {
    title: "Year-End Accounts",
    description: "All accounts prepared and submitted to Companies House and HMRC.",
    icon: "FileCheck",
  },
  {
    title: "Real-Time Dashboard",
    description: "Track your finances anytime on computer, tablet or phone.",
    icon: "BarChart3",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Sole Trader",
    quote: "Clever Accounts has been fantastic for my business. My dedicated accountant is always available and has saved me thousands in tax. Switching was the best decision I ever made.",
    rating: 5,
  },
  {
    name: "James Cooper",
    role: "IT Contractor",
    quote: "The IR35 support alone is worth every penny. They handle everything — contracts, assessments, and switching between umbrella and PSC seamlessly with Clever FLEX.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Limited Company Director",
    quote: "I used to dread tax season. Now everything is handled for me. The software is easy to use and my accountant is just a phone call away. Highly recommend!",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Startup Founder",
    quote: "As a new business owner, having Clever Accounts on my side gave me confidence from day one. Their advice has been invaluable and the price is unbeatable.",
    rating: 5,
  },
];

/**
 * Backward-compat alias.
 *
 * The codebase moved from a singleton COMPANY object to the BRANDS registry
 * for multi-tenancy. A couple of pages (/compare, /faq) still import COMPANY.
 * This shim keeps them compiling while we migrate; new code should use
 * `getBrand()` (server) or `useBrand()` (client) instead.
 */
export const COMPANY = {
  name: BRANDS.clever.name,
  tagline: BRANDS.clever.tagline,
  phone: BRANDS.clever.phone,
  freephone: BRANDS.clever.freephone,
  email: BRANDS.clever.email,
  website: `https://${BRANDS.clever.domain}`,
  portalUrl: BRANDS.clever.portalUrl,
  offices: BRANDS.clever.offices,
};
