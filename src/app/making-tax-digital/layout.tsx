import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Making Tax Digital (MTD) — Are You Ready? | Clever Accounts",
  description:
    "Making Tax Digital is coming for sole traders, landlords, and CIS subcontractors. Find out what MTD means, who's affected, the key deadlines, and how Clever Accounts gets you ready — with free FreeAgent software included.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
