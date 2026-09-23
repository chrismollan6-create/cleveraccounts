import { headers } from "next/headers";
import { brandIdFromHost } from "@/lib/brand-host";

/**
 * Google Search Console verification for workwellaccountancy.com.
 *
 * This is a route handler rather than a file in `public/` because both brand
 * domains are aliases on the SAME Vercel deployment and therefore share one
 * `public/` folder. A static file would also answer on cleveraccounts.com,
 * which would let whoever owns this token verify Clever in Search Console too.
 * Serving it only on the Workwell host keeps the two properties separate.
 */
const TOKEN = "google-site-verification: googledbdc5071e8609304.html";

export async function GET() {
  const host = (await headers()).get("host") ?? "";
  if (brandIdFromHost(host) !== "workwell") {
    return new Response("Not found", { status: 404 });
  }
  return new Response(TOKEN, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Verification is re-checked periodically; let Google cache it briefly
      // but not so long that a token swap takes hours to propagate.
      "cache-control": "public, max-age=300",
    },
  });
}
