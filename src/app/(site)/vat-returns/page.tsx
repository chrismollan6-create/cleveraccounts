import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute } from "@/components/service/ServiceRoute";
import CleverPage from "./CleverPage";

export default async function Page() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return (
      <WorkwellServiceRoute
        slug="vat-returns"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "VAT Returns", url: "/vat-returns" },
        ]}
      />
    );
  }
  return <CleverPage />;
}
