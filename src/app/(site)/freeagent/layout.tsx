import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "FreeAgent Accountants — Exclusive Co-Pilot Offer from £84.50+VAT | Clever Accounts",
  description:
    "Clever Accounts is a FreeAgent Platinum Partner and a member of FreeAgent's Co-Pilot panel — one of the longest-serving accountancy partners FreeAgent works with, trusted by 5,000+ FreeAgent businesses. Exclusive limited company accounting from £84.50+VAT a month for FreeAgent users.",
  alternates: { canonical: "/freeagent" },
  openGraph: {
    title:
      "FreeAgent Accountants — Exclusive Co-Pilot Offer from £84.50+VAT",
    description:
      "FreeAgent Platinum Partner and Co-Pilot panel member. All-inclusive limited company accounting from £84.50+VAT a month for FreeAgent users — keep your FreeAgent data, switch in minutes.",
    url: "/freeagent",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
