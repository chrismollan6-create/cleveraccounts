import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ecommerce Accounting — Online Seller Accountants | Clever Accounts",
  description:
    "Specialist accounting for ecommerce businesses and online sellers. Amazon, eBay, Etsy, Shopify and WooCommerce experts. International VAT (OSS/IOSS), inventory accounting, platform fee reconciliation. FreeAgent included free.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
