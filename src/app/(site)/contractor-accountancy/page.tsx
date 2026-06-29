import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import ContractorCalculator from "@/components/ui/ContractorCalculator";
import { servicePages } from "@/lib/service-page-data";
import { getSiteSettings, getPricingPlans } from "@/sanity/queries";
import { promoBadgeForPage } from "@/lib/promo";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute, workwellServiceMetadata } from "@/components/service/ServiceRoute";

const data = servicePages["contractor-accountancy"];

const breadcrumb = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/our-services" },
  { name: "Contractor Accountancy", url: "/contractor-accountancy" },
];

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  if (brand.id === "workwell") return workwellServiceMetadata("contractor-accountancy");
  return {
    title: "Contractor Accountant & IR35 Support — From £104.50/mo | Clever Accounts",
    description: data.metaDescription,
  };
}

export const revalidate = 60;

export default async function ContractorAccountancyPage() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return <WorkwellServiceRoute slug="contractor-accountancy" breadcrumb={breadcrumb} />;
  }

  let promoBadge: string | null = null;
  try {
    const [settings, plans] = await Promise.all([getSiteSettings(), getPricingPlans()]);
    promoBadge = promoBadgeForPage(plans, "/contractor-accountancy", settings?.promo) || null;
  } catch { /* use null */ }

  return (
    <>
      <BreadcrumbJsonLd
        items={breadcrumb}
      />
      <ServicePageTemplate data={data} promoBadge={promoBadge}>
        <ContractorCalculator />
      </ServicePageTemplate>
    </>
  );
}
