import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import ClientView from "./ClientView";

// Client-only reassurance page — linked from client emails / portal, kept out
// of search. Distinct from the public /making-tax-digital acquisition page.
export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: `Making Tax Digital — you're covered | ${brand.name}`,
    description: `What Making Tax Digital means for ${brand.name} clients, and how we handle it for you.`,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <ClientView />;
}
