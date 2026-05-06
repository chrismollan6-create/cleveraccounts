import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import { servicePages } from "@/lib/service-page-data";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

const data = servicePages["freelancer-accountancy"];

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
};

export default function FreelancerAccountancyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Freelancer Accountancy", url: "/freelancer-accountancy" },
        ]}
      />
      <ServicePageTemplate data={data} />
    </>
  );
}
