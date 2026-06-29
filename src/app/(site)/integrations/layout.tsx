import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { workwellServiceMetadata } from "@/components/service/ServiceRoute";

const cleverMetadata: Metadata = {
  title: "Accounting Software & Integrations — FreeAgent Platinum Partner | Clever Accounts",
  description:
    "Clever Accounts is a FreeAgent Platinum Partner. Get FreeAgent free with every package — open banking, MTD-ready, invoicing, expenses, and payroll. We also support Xero, QuickBooks, and Sage.",
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return brand.id === "workwell" ? workwellServiceMetadata("integrations") : cleverMetadata;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
