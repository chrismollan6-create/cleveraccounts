import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import { servicePages } from "@/lib/service-page-data";
import { getSiteSettings } from "@/sanity/queries";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

const data = servicePages["limited-company"];

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
};

export const revalidate = 60;

export default async function LimitedCompanyPage() {
  let promoBadge: string | null = null;
  try {
    const settings = await getSiteSettings();
    const p = settings?.promo;
    if (p?.enabled && p.appliesTo?.includes("Limited Company")) {
      promoBadge = p.badgeText ||
        `${p.discountPercent ? `${p.discountPercent}% off` : ""}${p.durationMonths ? ` for ${p.durationMonths} months` : ""}`.trim() || null;
    }
  } catch { /* use null */ }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Limited Company Accounting", url: "/limited-company" },
        ]}
      />
      <ServicePageTemplate data={data} promoBadge={promoBadge} />
    </>
  );
}
