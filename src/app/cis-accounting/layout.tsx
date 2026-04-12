import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CIS Accounting — Construction Industry Scheme Specialists | Clever Accounts",
  description:
    "Expert CIS accounting for contractors and subcontractors. We handle CIS registration, monthly returns, subcontractor verification, year-end tax reclaims, and gross payment status applications. Fixed monthly fee, dedicated accountant.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
