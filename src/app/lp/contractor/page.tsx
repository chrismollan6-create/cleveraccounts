import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";

export const metadata: Metadata = {
  title: "Contractor Accountant + IR35 Support — From £104.50/mo | Clever Accounts",
  description: "Specialist contractor accounting with end-to-end IR35 support, contract reviews & Clever FLEX. No setup fees. From £104.50/month.",
  robots: { index: false, follow: false },
};

export default function ContractorLP() {
  return (
    <LandingPageLayout
      headline="Contractor Accounting With Full IR35 Support"
      subheadline="End-to-end IR35 support, contract reviews, and our unique Clever FLEX solution. Switch between PSC and umbrella seamlessly."
      price="104.50"
      targetAudience="For Contractors & Freelancers"
      urgencyText="2,000+ contractors trust us with their IR35"
      features={[
        "Specialist contractor accountant",
        "End-to-end IR35 support",
        "Contract reviews & assessments",
        "Clever FLEX umbrella solution",
        "Seamless PSC/Umbrella switching",
        "Full limited company accounting",
        "Free FreeAgent accounting software",
        "Unlimited advice & support",
      ]}
    />
  );
}
