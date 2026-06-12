import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute } from "@/components/service/ServiceRoute";
import CleverPage from "./CleverPage";

export default async function Page() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return (
      <WorkwellServiceRoute
        slug="switching-accountants"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "Switching Accountants", url: "/switching-accountants" },
        ]}
      />
    );
  }
  return <CleverPage />;
}
