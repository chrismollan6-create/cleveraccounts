import ServiceRoute, { serviceMetadata } from "@/components/service/ServiceRoute";

export const generateMetadata = () => serviceMetadata("freelancer-accountancy");

export default function FreelancerAccountancyPage() {
  return (
    <ServiceRoute
      slug="freelancer-accountancy"
      breadcrumb={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/our-services" },
        { name: "Freelancer Accountancy", url: "/freelancer-accountancy" },
      ]}
    />
  );
}
