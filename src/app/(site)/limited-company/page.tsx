import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import { servicePages } from "@/lib/service-page-data";
import { getSiteSettings, getPricingPlans } from "@/sanity/queries";
import { promoBadgeForPage } from "@/lib/promo";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute, workwellServiceMetadata } from "@/components/service/ServiceRoute";

const data = servicePages["limited-company"];

const breadcrumb = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/our-services" },
  { name: "Limited Company Accounting", url: "/limited-company" },
];

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  if (brand.id === "workwell") return workwellServiceMetadata("limited-company");
  return { title: data.title, description: data.metaDescription };
}

export const revalidate = 60;

export default async function LimitedCompanyPage() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return <WorkwellServiceRoute slug="limited-company" breadcrumb={breadcrumb} />;
  }

  let promoBadge: string | null = null;
  try {
    const [settings, plans] = await Promise.all([getSiteSettings(), getPricingPlans()]);
    promoBadge = promoBadgeForPage(plans, "/limited-company", settings?.promo) || null;
  } catch { /* use null */ }

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumb} />
      <ServicePageTemplate data={data} promoBadge={promoBadge} />
    </>
  );
}
