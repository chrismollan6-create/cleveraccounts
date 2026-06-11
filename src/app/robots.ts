import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { BRANDS } from "@/lib/constants";
import { brandIdFromHost } from "@/lib/brand-host";

const PROD_DOMAINS = ["cleveraccounts.com", "workwellaccountancy.com"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Middleware is excluded from /robots.txt, so derive the brand from the host.
  const host = ((await headers()).get("host") || "").toLowerCase().split(":")[0];
  const brand = BRANDS[brandIdFromHost(host)];
  const isProd = PROD_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));

  // Preview / non-production hosts (e.g. *.vercel.app, localhost) must stay out
  // of search — otherwise branch deploys create duplicate content.
  if (!isProd) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/log-in", "/new-account"] }],
    sitemap: `https://${brand.domain}/sitemap.xml`,
    host: `https://${brand.domain}`,
  };
}
