import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounting Software & Integrations — FreeAgent Platinum Partner | Clever Accounts",
  description:
    "Clever Accounts is a FreeAgent Platinum Partner. Get FreeAgent free with every package — open banking, MTD-ready, invoicing, expenses, and payroll. We also support Xero, QuickBooks, and Sage.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
