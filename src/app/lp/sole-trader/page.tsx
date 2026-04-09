import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";

export const metadata: Metadata = {
  title: "Sole Trader Accountant — From £32.50/mo | Clever Accounts",
  description: "Expert sole trader accounting. Self assessment, unlimited advice, free software. No setup fees. No contract. From £32.50/month.",
  robots: { index: false, follow: false }, // Don't index PPC pages
};

export default function SoleTraderLP() {
  return (
    <LandingPageLayout
      headline="Sole Trader Accounting From £32.50/month"
      subheadline="Your own dedicated accountant handles your self assessment, tax planning, and bookkeeping. Unlimited advice, free software, zero hassle."
      price="32.50"
      targetAudience="For Sole Traders & Self-Employed"
      urgencyText="Join 4,000+ sole traders who switched this year"
      features={[
        "Your own dedicated accountant",
        "Self assessment tax return filed for you",
        "Unlimited phone & email advice",
        "Free FreeAgent accounting software",
        "Expense tracking & mileage claims",
        "MTD for Income Tax compliant",
        "Tax efficiency advice (save £1,000+)",
        "HMRC correspondence handled",
      ]}
    />
  );
}
