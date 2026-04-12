import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switch Accountant — Seamless Transfer, Benefits From Day One | Clever Accounts",
  description: "Switching accountants is easier than you think. We contact your old accountant, transfer your records, and you benefit immediately. No setup fee, no hassle.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
