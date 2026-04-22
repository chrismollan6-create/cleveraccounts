import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import { servicePages } from "@/lib/service-page-data";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

const data = servicePages["sole-trader"];

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
};

export default function SoleTraderPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Sole Trader Accounting", url: "/sole-trader" },
        ]}
      />
      <ServicePageTemplate data={data} />
    </>
  );
}
