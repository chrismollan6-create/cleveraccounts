import { getBrand } from "@/lib/brand";
import { getSiteSettings } from "@/sanity/queries";
import SignUpDetailsClient from "./SignUpDetailsClient";

export const revalidate = 60;

export default async function SignUpDetailsPage() {
  const brand = await getBrand();
  let freephone = brand.freephone;
  // siteSettings is the shared (Clever) singleton — only let it override the
  // phone for Clever, else it leaks Clever's number onto other brands.
  if (brand.id === "clever") {
    try {
      const settings = await getSiteSettings();
      if (settings?.freephone) freephone = settings.freephone;
    } catch {
      /* keep default */
    }
  }

  return <SignUpDetailsClient freephone={freephone} />;
}
