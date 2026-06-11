import ServiceRoute, { serviceMetadata } from "@/components/service/ServiceRoute";

export const generateMetadata = () => serviceMetadata("accounting-for-startups");

export default function StartupsPage() {
  return (
    <ServiceRoute
      slug="accounting-for-startups"
      breadcrumb={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/our-services" },
        { name: "Accounting for Startups", url: "/accounting-for-startups" },
      ]}
    />
  );
}
