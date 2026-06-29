import ServiceRoute, { serviceMetadata } from "@/components/service/ServiceRoute";

export const generateMetadata = () => serviceMetadata("sole-trader");

export default function SoleTraderPage() {
  return (
    <ServiceRoute
      slug="sole-trader"
      breadcrumb={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/our-services" },
        { name: "Sole Trader Accounting", url: "/sole-trader" },
      ]}
    />
  );
}
