import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      // Pravatar — placeholder avatar faces for portal-redesign previews under
      // /portal/preview/*. Mocked accountant photos. Remove once we wire the
      // real Salesforce User.FullPhotoUrl through to the portal.
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      // Salesforce User photos — populated for portal display once Stage 1
      // sync wires User.FullPhotoUrl into portal.users (see security plan).
      {
        protocol: "https",
        hostname: "*.salesforce.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
