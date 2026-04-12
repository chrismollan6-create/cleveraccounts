import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VAT Returns — Handled Every Quarter | Clever Accounts",
  description:
    "Stress-free VAT compliance for UK businesses. Clever Accounts prepares and submits your quarterly VAT returns, handles MTD for VAT via FreeAgent, and advises on the right VAT scheme for your business. From £32.50/month.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
