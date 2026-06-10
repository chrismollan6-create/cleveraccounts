import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: `Accounting Software & Integrations — FreeAgent Platinum Partner | ${brand.name}`,
    description:
      `${brand.name} is a FreeAgent Platinum Partner. Get FreeAgent free with every package — open banking, MTD-ready, invoicing, expenses, and payroll. We also support Xero, QuickBooks, and Sage.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
