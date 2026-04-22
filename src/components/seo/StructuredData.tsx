import { COMPANY } from "@/lib/constants";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["AccountingService", "ProfessionalService", "LocalBusiness"],
    name: "Clever Accounts",
    alternateName: "Clever Accounts Ltd",
    url: "https://cleveraccounts.com",
    logo: {
      "@type": "ImageObject",
      url: "https://cleveraccounts.com/images/logo.png",
      width: 200,
      height: 60,
    },
    image: "https://cleveraccounts.com/images/logo.png",
    description:
      "Expert online accountancy services for sole traders, limited companies, contractors and freelancers across the UK. Dedicated accountant, unlimited advice, free FreeAgent software from £42.50/month.",
    telephone: COMPANY.freephone,
    email: COMPANY.email,
    foundingDate: "2006",
    currenciesAccepted: "GBP",
    paymentAccepted: "Credit Card, Direct Debit",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 10, maxValue: 50 },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Leeds",
      addressRegion: "West Yorkshire",
      postalCode: "LS1",
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
    sameAs: [
      COMPANY.social.facebook,
      COMPANY.social.twitter,
      COMPANY.social.linkedin,
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "746",
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
            description: "Complete accounting for sole traders including self assessment, unlimited advice, and free FreeAgent software.",
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

export function PricingJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Clever Accounts Pricing Plans",
    description: "Online accounting packages for sole traders, limited companies, and contractors across the UK.",
    url: "https://cleveraccounts.com/#pricing",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Sole Trader Accounting",
          description: "Dedicated sole trader accountant, self assessment tax return, unlimited advice, free FreeAgent software, expense tracking, MTD compliant.",
          url: "https://cleveraccounts.com/sole-trader",
          brand: { "@type": "Brand", name: "Clever Accounts" },
          offers: {
            "@type": "Offer",
            price: "42.50",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "42.50",
              priceCurrency: "GBP",
              billingDuration: "P1M",
              unitText: "month",
            },
            availability: "https://schema.org/InStock",
            url: "https://cleveraccounts.com/sole-trader",
            seller: { "@type": "Organization", name: "Clever Accounts" },
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Limited Company Accounting",
          description: "Year-end accounts, corporation tax, VAT returns, payroll, Companies House filings, tax planning, free FreeAgent software.",
          url: "https://cleveraccounts.com/limited-company",
          brand: { "@type": "Brand", name: "Clever Accounts" },
          offers: {
            "@type": "Offer",
            price: "104.50",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "104.50",
              priceCurrency: "GBP",
              billingDuration: "P1M",
              unitText: "month",
            },
            availability: "https://schema.org/InStock",
            url: "https://cleveraccounts.com/limited-company",
            seller: { "@type": "Organization", name: "Clever Accounts" },
          },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "Contractor Accounting",
          description: "End-to-end IR35 support, contract reviews, Clever FLEX umbrella solution, full limited company accounting, bespoke contracting advice.",
          url: "https://cleveraccounts.com/contractor-accountancy",
          brand: { "@type": "Brand", name: "Clever Accounts" },
          offers: {
            "@type": "Offer",
            price: "104.50",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "104.50",
              priceCurrency: "GBP",
              billingDuration: "P1M",
              unitText: "month",
            },
            availability: "https://schema.org/InStock",
            url: "https://cleveraccounts.com/contractor-accountancy",
            seller: { "@type": "Organization", name: "Clever Accounts" },
          },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Product",
          name: "Landlord Accounting",
          description: "Comprehensive accounting for property investors and landlords including self assessment, rental income, and tax efficiency advice.",
          url: "https://cleveraccounts.com/landlord-accounting",
          brand: { "@type": "Brand", name: "Clever Accounts" },
          offers: {
            "@type": "Offer",
            price: "42.50",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "42.50",
              priceCurrency: "GBP",
              billingDuration: "P1M",
              unitText: "month",
            },
            availability: "https://schema.org/InStock",
            url: "https://cleveraccounts.com/landlord-accounting",
            seller: { "@type": "Organization", name: "Clever Accounts" },
          },
        },
      },
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

export function BlogPostingJsonLd({
  title,
  description,
  publishedAt,
  modifiedAt,
  authorName,
  url,
  imageUrl,
}: BlogPostingProps) {
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
      name: "Clever Accounts",
      logo: {
        "@type": "ImageObject",
        url: "https://cleveraccounts.com/images/logo.png",
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedAt ?? publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cleveraccounts.com${url}`,
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
