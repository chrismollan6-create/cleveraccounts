import { COMPANY } from "@/lib/constants";
import { getSiteSettings } from "@/sanity/queries";
import SignUpDetailsClient from "./SignUpDetailsClient";

export const revalidate = 60;

export default async function SignUpDetailsPage() {
  let freephone = COMPANY.freephone;
  try {
    const settings = await getSiteSettings();
    if (settings?.freephone) freephone = settings.freephone;
  } catch {
    /* keep default */
  }

  return <SignUpDetailsClient freephone={freephone} />;
}
