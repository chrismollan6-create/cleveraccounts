import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import CisView from "./CisView";

// Edgy CIS-only page — linked from CIS client SMS/email. Kept out of search.
export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: `CIS & Making Tax Digital — protect your refund | ${brand.name}`,
    description: `Making Tax Digital hits CIS subcontractors from April 2027. Here's what it means for your tax refund — and how we keep it flowing.`,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <CisView />;
}
