import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Tax Deadlines 2025/26 — Key Dates for Your Diary | Clever Accounts",
  description:
    "Complete guide to UK tax deadlines for 2025/26: Self Assessment, Corporation Tax, VAT, PAYE, Companies House, and MTD. Never miss an HMRC deadline again — Clever Accounts handles it all.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
