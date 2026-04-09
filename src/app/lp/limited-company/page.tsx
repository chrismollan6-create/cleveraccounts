import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";

export const metadata: Metadata = {
  title: "Limited Company Accountant — From £104.50/mo | Clever Accounts",
  description: "Complete limited company accounting. Year-end accounts, CT600, VAT, payroll, free software. No setup fees. From £104.50/month.",
  robots: { index: false, follow: false },
};

export default function LimitedCompanyLP() {
  return (
    <LandingPageLayout
      headline="Limited Company Accounting — Everything Included"
      subheadline="Year-end accounts, corporation tax, VAT returns, payroll, and a dedicated accountant who knows your business. One fee, no surprises."
      price="104.50"
      targetAudience="For Limited Company Directors"
      urgencyText="3,000+ directors switched to us this year"
      features={[
        "Dedicated limited company accountant",
        "Year-end accounts & CT600 filed",
        "Quarterly VAT returns",
        "Payroll for directors & staff",
        "Companies House annual filings",
        "Corporation tax planning & advice",
        "Free FreeAgent accounting software",
        "Unlimited phone & email support",
      ]}
    />
  );
}
