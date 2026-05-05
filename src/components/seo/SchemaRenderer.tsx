import {
  BreadcrumbJsonLd,
  FAQPageJsonLd,
  BlogPostingJsonLd,
  ServiceJsonLd,
  ReviewJsonLd,
  HowToJsonLd,
  LocalBusinessJsonLd,
  RawJsonLd,
} from "./StructuredData";

export type PageSchemaItem =
  | { _type: "breadcrumbSchema"; items: { name: string; url: string }[] }
  | { _type: "faqPageSchema"; faqs: { q: string; a: string }[] }
  | {
      _type: "articleSchema";
      headline: string;
      description?: string;
      author?: string;
      datePublished?: string;
      dateModified?: string;
      imageUrl?: string;
    }
  | {
      _type: "serviceSchema";
      name: string;
      description?: string;
      price?: string;
      priceCurrency?: string;
      billingInterval?: string;
      areaServed?: string;
      serviceUrl?: string;
    }
  | {
      _type: "reviewSchema";
      author: string;
      rating: number;
      reviewBody: string;
      datePublished?: string;
      itemReviewed?: string;
    }
  | {
      _type: "howToSchema";
      name: string;
      description?: string;
      steps: { name?: string; text: string }[];
    }
  | {
      _type: "localBusinessSchema";
      name?: string;
      telephone?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    }
  | { _type: "rawJsonLdSchema"; label?: string; json: string };

export function SchemaRenderer({
  schemas,
  fallbackUrl,
}: {
  schemas?: PageSchemaItem[] | null;
  fallbackUrl?: string;
}) {
  if (!schemas?.length) return null;

  return (
    <>
      {schemas.map((s, i) => {
        switch (s._type) {
          case "breadcrumbSchema":
            return <BreadcrumbJsonLd key={i} items={s.items ?? []} />;

          case "faqPageSchema":
            return <FAQPageJsonLd key={i} faqs={s.faqs ?? []} />;

          case "articleSchema":
            return (
              <BlogPostingJsonLd
                key={i}
                title={s.headline}
                description={s.description ?? ""}
                publishedAt={s.datePublished ?? new Date().toISOString()}
                modifiedAt={s.dateModified}
                authorName={s.author ?? "Clever Accounts"}
                url={fallbackUrl ?? ""}
                imageUrl={s.imageUrl}
              />
            );

          case "serviceSchema":
            return (
              <ServiceJsonLd
                key={i}
                name={s.name}
                description={s.description}
                price={s.price}
                priceCurrency={s.priceCurrency}
                billingInterval={s.billingInterval}
                areaServed={s.areaServed}
                serviceUrl={s.serviceUrl}
              />
            );

          case "reviewSchema":
            return (
              <ReviewJsonLd
                key={i}
                author={s.author}
                rating={s.rating}
                reviewBody={s.reviewBody}
                datePublished={s.datePublished}
                itemReviewed={s.itemReviewed}
              />
            );

          case "howToSchema":
            return (
              <HowToJsonLd
                key={i}
                name={s.name}
                description={s.description}
                steps={s.steps ?? []}
              />
            );

          case "localBusinessSchema":
            return (
              <LocalBusinessJsonLd
                key={i}
                name={s.name}
                telephone={s.telephone}
                addressLocality={s.addressLocality}
                addressRegion={s.addressRegion}
                postalCode={s.postalCode}
                addressCountry={s.addressCountry}
              />
            );

          case "rawJsonLdSchema":
            return <RawJsonLd key={i} json={s.json} />;

          default:
            return null;
        }
      })}
    </>
  );
}
