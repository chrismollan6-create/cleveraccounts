import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute } from "@/components/service/ServiceRoute";
import CleverPage from "./CleverPage";

export default async function Page() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return (
      <WorkwellServiceRoute
        slug="integrations"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Integrations", url: "/integrations" },
        ]}
      />
    );
  }
  return <CleverPage />;
}
