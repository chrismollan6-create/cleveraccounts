import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/log-in", "/new-account"],
      },
    ],
    sitemap: "https://cleveraccounts.com/sitemap.xml",
  };
}
