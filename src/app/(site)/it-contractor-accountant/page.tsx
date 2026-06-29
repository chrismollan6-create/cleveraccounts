import { getBrand } from "@/lib/brand";
import { WorkwellServiceRoute } from "@/components/service/ServiceRoute";
import CleverPage from "./CleverPage";

export default async function Page() {
  const brand = await getBrand();
  if (brand.id === "workwell") {
    return (
      <WorkwellServiceRoute
        slug="it-contractor-accountant"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/our-services" },
          { name: "IT Contractor Accountants", url: "/it-contractor-accountant" },
        ]}
      />
    );
  }
  return <CleverPage />;
}
