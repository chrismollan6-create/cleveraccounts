import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute, workwellServiceMetadata } from "@/components/service/ServiceRoute";
import CleverPage, { metadata as cleverMetadata } from "./CleverPage";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return brand.id === "workwell" ? workwellServiceMetadata("tax-returns") : cleverMetadata;
}

export default async function Page() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return (
      <WorkwellServiceRoute
        slug="tax-returns"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Tax Returns", url: "/tax-returns" },
        ]}
      />
    );
  }
  return <CleverPage />;
}
