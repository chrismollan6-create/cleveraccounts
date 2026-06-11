import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";

const cleverMetadata: Metadata = {
  title: "Accounting Software & Integrations — FreeAgent Platinum Partner | Clever Accounts",
  description:
    "Clever Accounts is a FreeAgent Platinum Partner. Get FreeAgent free with every package — open banking, MTD-ready, invoicing, expenses, and payroll. We also support Xero, QuickBooks, and Sage.",
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  if (brand.id !== "workwell") return cleverMetadata;
  return {
    title: `Accounting Software & Integrations — FreeAgent Included Free | ${brand.name}`,
    description:
      `${brand.name} includes FreeAgent free with every package — open banking, MTD-ready, invoicing, expenses, and payroll. We also support Xero, QuickBooks, and Sage.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
