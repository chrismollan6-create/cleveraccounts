import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import { servicePages } from "@/lib/service-page-data";

const data = servicePages["landlord-accounting"];

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
};

export default function LandlordAccountingPage() {
  return <ServicePageTemplate data={data} />;
}
