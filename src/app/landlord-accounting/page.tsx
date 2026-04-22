import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import { servicePages } from "@/lib/service-page-data";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

const data = servicePages["landlord-accounting"];

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
};

export default function LandlordAccountingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Landlord Accounting", url: "/landlord-accounting" },
        ]}
      />
      <ServicePageTemplate data={data} />
    </>
  );
}
