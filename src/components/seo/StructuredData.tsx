import { COMPANY } from "@/lib/constants";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: "Clever Accounts",
    alternateName: "Clever Accounts Ltd",
    url: "https://cleveraccounts.com",
    logo: "https://cleveraccounts.com/images/logo.png",
    description:
      "Expert online accountancy services for sole traders, limited companies, contractors and freelancers. Dedicated accountant, unlimited advice, free software.",
    telephone: COMPANY.freephone,
    email: COMPANY.email,
    foundingDate: "2006",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 10, maxValue: 50 },
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Leeds",
        addressRegion: "West Yorkshire",
        addressCountry: "GB",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Watford",
        addressRegion: "Hertfordshire",
        addressCountry: "GB",
      },
    ],
    areaServed: { "@type": "Country", name: "United Kingdom" },
    priceRange: "£32.50 - £104.50 per month",
    sameAs: [
      COMPANY.social.facebook,
      COMPANY.social.twitter,
      COMPANY.social.linkedin,
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "10000",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Accounting Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sole Trader Accounting",
            description: "Complete accounting for sole traders including self assessment, unlimited advice, and free software.",
          },
          price: "32.50",
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
            description: "Specialist contractor accounting with IR35 support, contract reviews, and Clever FLEX umbrella solution.",
          },
          price: "104.50",
          priceCurrency: "GBP",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
        },
      ],
    },
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

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://cleveraccounts.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
