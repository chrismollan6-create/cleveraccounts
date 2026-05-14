import { getBrand } from "@/lib/brand";
import { getSiteSettings } from "@/sanity/queries";
import SignUpDetailsClient from "./SignUpDetailsClient";

export const revalidate = 60;

export default async function SignUpDetailsPage() {
  const brand = await getBrand();
  let freephone = brand.freephone;
  try {
    const settings = await getSiteSettings();
    if (settings?.freephone) freephone = settings.freephone;
  } catch {
    /* keep default */
  }

  return <SignUpDetailsClient freephone={freephone} />;
}
