import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import ContractorCalculator from "@/components/ui/ContractorCalculator";
import { servicePages } from "@/lib/service-page-data";
import { getSiteSettings, getPricingPlans } from "@/sanity/queries";
import { promoBadgeForPage } from "@/lib/promo";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getBrand } from "@/lib/brand";

const data = servicePages["contractor-accountancy"];

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: `Contractor Accountant & IR35 Support — From £104.50/mo + VAT | ${brand.name}`,
    description: data.metaDescription,
  };
}

export const revalidate = 60;

export default async function ContractorAccountancyPage() {
  let promoBadge: string | null = null;
  try {
    const [settings, plans] = await Promise.all([getSiteSettings(), getPricingPlans()]);
    promoBadge = promoBadgeForPage(plans, "/contractor-accountancy", settings?.promo) || null;
  } catch { /* use null */ }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Contractor Accountancy", url: "/contractor-accountancy" },
        ]}
      />
      <ServicePageTemplate data={data} promoBadge={promoBadge}>
        <ContractorCalculator />
      </ServicePageTemplate>
    </>
  );
}
