import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute, workwellServiceMetadata } from "@/components/service/ServiceRoute";
import CleverPage from "./CleverPage";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return brand.id === "workwell" ? workwellServiceMetadata("ir35") : {};
}

export default async function Page() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return (
      <WorkwellServiceRoute
        slug="ir35"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "IR35 Specialists", url: "/contractor-accountants/ir35" },
        ]}
      />
    );
  }
  return <CleverPage />;
}
