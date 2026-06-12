import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute, workwellServiceMetadata } from "@/components/service/ServiceRoute";
import CleverPage from "./CleverPage";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  if (brand.id === "workwell") return workwellServiceMetadata("local-accountants");
  return {
    title: "Online vs Local Accountant",
    description:
      "Why switch from your local accountant to Clever Accounts? Better service, lower costs, free software, unlimited support. Compare and switch today.",
  };
}

export default async function Page() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return (
      <WorkwellServiceRoute
        slug="local-accountants"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Local Accountants", url: "/local-accountants" },
        ]}
      />
    );
  }
  return <CleverPage />;
}
