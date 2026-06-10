import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title:
      `FreeAgent Accountants — Sole Trader & Limited Company | ${brand.name}`,
    description:
      `${brand.name} is a FreeAgent Platinum Partner and a member of FreeAgent's Co-Pilot panel — one of the longest-serving accountancy partners FreeAgent works with, trusted by 5,000+ FreeAgent businesses. All-inclusive accounting for sole traders from £42.50+VAT and limited companies from £84.50+VAT a month.`,
    alternates: { canonical: "/freeagent" },
    openGraph: {
      title: "FreeAgent Accountants — Sole Trader & Limited Company",
      description:
        "FreeAgent Platinum Partner and Co-Pilot panel member. All-inclusive accounting for sole traders from £42.50+VAT and limited companies from £84.50+VAT a month — keep your FreeAgent data, switch in minutes.",
      url: "/freeagent",
      type: "website",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
