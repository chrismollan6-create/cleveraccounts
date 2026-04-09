import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import { servicePages } from "@/lib/service-page-data";

const data = servicePages["sole-trader"];

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
};

export default function SoleTraderPage() {
  return <ServicePageTemplate data={data} />;
}
