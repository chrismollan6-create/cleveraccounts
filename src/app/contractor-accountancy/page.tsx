import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ui/ServicePageTemplate";
import ContractorCalculator from "@/components/ui/ContractorCalculator";
import { servicePages } from "@/lib/service-page-data";

const data = servicePages["contractor-accountancy"];

export const metadata: Metadata = {
  title: "Contractor Accountant & IR35 Support — From £104.50/mo | Clever Accounts",
  description: data.metaDescription,
};

export default function ContractorAccountancyPage() {
  return (
    <ServicePageTemplate data={data}>
      <ContractorCalculator />
    </ServicePageTemplate>
  );
}
