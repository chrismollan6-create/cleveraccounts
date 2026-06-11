import ServiceRoute, { serviceMetadata } from "@/components/service/ServiceRoute";

export const generateMetadata = () => serviceMetadata("landlord-accounting");

export default function LandlordAccountingPage() {
  return (
    <ServiceRoute
      slug="landlord-accounting"
      breadcrumb={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/our-services" },
        { name: "Landlord Accounting", url: "/landlord-accounting" },
      ]}
    />
  );
}
