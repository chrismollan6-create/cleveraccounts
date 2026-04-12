import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free FreeAgent Accounting Software — Platinum Partner | Clever Accounts",
  description: "Every Clever Accounts package includes free FreeAgent accounting software (worth £29/mo). We're a FreeAgent Platinum Partner. MTD compliant, open banking, invoicing and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
