import { getBrand } from "@/lib/brand";

export async function OrganizationJsonLd() {
  const brand = await getBrand();
  const base = `https://${brand.domain}`;
  const logoUrl = `${base}${brand.assets.logo}`;
  const office = brand.offices[0];
  const sameAs = [brand.social.facebook, brand.social.twitter, brand.social.linkedin].filter(Boolean);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["AccountingService", "ProfessionalService", "LocalBusiness"],
    name: brand.name,
    alternateName: brand.legalName,
    url: base,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 200,
      height: 60,
    },
    image: logoUrl,
    description:
      "Expert online accountancy services for sole traders, limited companies and contractors across the UK. Dedicated accountant, unlimited advice and free accounting software from £42.50/month.",
    telephone: brand.freephone,
    email: brand.email,
    currenciesAccepted: "GBP",
    paymentAccepted: "Credit Card, Direct Debit",
    address: {
      "@type": "PostalAddress",
      ...(office?.city ? { addressLocality: office.city } : {}),
      addressCountry: "GB",
    },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    priceRange: "££",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:30",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Accounting Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sole Trader Accounting",
            description: "Complete accounting for sole traders including self assessment, unlimited advice, and free accounting software.",
          },
          price: "42.50",
          priceCurrency: "GBP",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Limited Company Accounting",
            description: "Full service accounting for limited companies including year-end accounts, corporation tax, VAT, and payroll.",
          },
          price: "104.50",
          priceCurrency: "GBP",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Contractor Accounting",
            description: "Specialist contractor accounting with IR35 support, contract reviews, and umbrella solution.",
          },
          price: "104.50",
          priceCurrency: "GBP",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
        },
      ],
    },
  };

  if (sameAs.length) data.sameAs = sameAs;

  // Clever-only specifics — omitted for brands we don't have verified figures for.
  if (brand.id === "clever") {
    data.foundingDate = "2006";
    data.numberOfEmployees = { "@type": "QuantitativeValue", minValue: 10, maxValue: 50 };
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "746",
      bestRating: "5",
      worstRating: "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export async function PricingJsonLd() {
  const brand = await getBrand();
  const base = `https://${brand.domain}`;
  const seller = { "@type": "Organization", name: brand.name };
  const brandRef = { "@type": "Brand", name: brand.name };

  const product = (
    position: number,
    name: string,
    description: string,
    path: string,
    price: string,
  ) => ({
    "@type": "ListItem",
    position,
    item: {
      "@type": "Product",
      name,
      description,
      url: `${base}${path}`,
      brand: brandRef,
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "GBP",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price,
          priceCurrency: "GBP",
          billingDuration: "P1M",
          unitText: "month",
        },
        availability: "https://schema.org/InStock",
        url: `${base}${path}`,
        seller,
      },
    },
  });

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${brand.name} Pricing Plans`,
    description: "Online accounting packages for sole traders, limited companies, and contractors across the UK.",
    url: `${base}/#pricing`,
    itemListElement: [
      product(1, "Sole Trader Accounting", "Dedicated sole trader accountant, self assessment tax return, unlimited advice, free accounting software, expense tracking, MTD compliant.", "/sole-trader", "42.50"),
      product(2, "Limited Company Accounting", "Year-end accounts, corporation tax, VAT returns, payroll, Companies House filings, tax planning, free accounting software.", "/limited-company", "104.50"),
      product(3, "Contractor Accounting", "End-to-end IR35 support, contract reviews, umbrella solution, full limited company accounting, bespoke contracting advice.", "/contractor-accountancy", "104.50"),
      product(4, "Landlord Accounting", "Comprehensive accounting for property investors and landlords including self assessment, rental income, and tax efficiency advice.", "/landlord-accounting", "42.50"),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQPageJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BlogPostingProps {
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName: string;
  url: string;
  imageUrl?: string;
}

export async function BlogPostingJsonLd({
  title,
  description,
  publishedAt,
  modifiedAt,
  authorName,
  url,
  imageUrl,
}: BlogPostingProps) {
  const brand = await getBrand();
  const base = `https://${brand.domain}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: brand.name,
      logo: {
        "@type": "ImageObject",
        url: `${base}${brand.assets.logo}`,
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedAt ?? publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${base}${url}`,
    },
    ...(imageUrl ? { image: imageUrl } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ServiceJsonLdProps {
  name: string;
  description?: string;
  price?: string;
  priceCurrency?: string;
  billingInterval?: string;
  areaServed?: string;
  serviceUrl?: string;
}

export async function ServiceJsonLd({
  name,
  description,
  price,
  priceCurrency = "GBP",
  billingInterval = "month",
  areaServed = "United Kingdom",
  serviceUrl,
}: ServiceJsonLdProps) {
  const brand = await getBrand();
  const base = `https://${brand.domain}`;
  const billingDuration =
    billingInterval === "year" ? "P1Y" : billingInterval === "one-off" ? undefined : "P1M";
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    ...(description ? { description } : {}),
    provider: { "@type": "Organization", name: brand.name, url: base },
    areaServed: { "@type": "Country", name: areaServed },
    ...(serviceUrl ? { url: `${base}${serviceUrl}` } : {}),
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency,
            ...(billingDuration
              ? {
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price,
                    priceCurrency,
                    billingDuration,
                    unitText: billingInterval,
                  },
                }
              : {}),
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: brand.name },
          },
        }
      : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

interface ReviewJsonLdProps {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished?: string;
  itemReviewed?: string;
  /** Org name for the default itemReviewed (client callers pass the active brand). */
  orgName?: string;
}

export function ReviewJsonLd({ author, rating, reviewBody, datePublished, itemReviewed, orgName }: ReviewJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: author },
    reviewRating: { "@type": "Rating", ratingValue: rating, bestRating: 5, worstRating: 1 },
    reviewBody,
    ...(datePublished ? { datePublished } : {}),
    ...(itemReviewed
      ? { itemReviewed: { "@type": "Service", name: itemReviewed } }
      : { itemReviewed: { "@type": "Organization", name: orgName ?? "Clever Accounts" } }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

interface HowToJsonLdProps {
  name: string;
  description?: string;
  steps: { name?: string; text: string }[];
}

export function HowToJsonLd({ name, description, steps }: HowToJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    ...(description ? { description } : {}),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      ...(s.name ? { name: s.name } : {}),
      text: s.text,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

interface LocalBusinessJsonLdProps {
  name?: string;
  telephone?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export async function LocalBusinessJsonLd({
  name,
  telephone,
  addressLocality,
  addressRegion,
  postalCode,
  addressCountry = "GB",
}: LocalBusinessJsonLdProps) {
  const brand = await getBrand();
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: name ?? brand.name,
    ...(telephone ? { telephone } : {}),
    address: {
      "@type": "PostalAddress",
      ...(addressLocality ? { addressLocality } : {}),
      ...(addressRegion ? { addressRegion } : {}),
      ...(postalCode ? { postalCode } : {}),
      addressCountry,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function RawJsonLd({ json }: { json: string }) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(parsed).replace(/<\/script>/gi, "<\\/script>") }}
    />
  );
}

export async function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const brand = await getBrand();
  const base = `https://${brand.domain}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
