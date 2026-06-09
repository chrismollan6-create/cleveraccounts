import type { Metadata } from "next";
import { headers } from "next/headers";
import Header from "@/components/layout/Header";
import { getSiteSettings } from "@/sanity/queries";
import TrustBar from "@/components/layout/TrustBar";
import Footer from "@/components/layout/Footer";
import LearnHeader from "@/components/layout/LearnHeader";
import LearnFooter from "@/components/layout/LearnFooter";
import { OrganizationJsonLd } from "@/components/seo/StructuredData";
import { GoogleTagManagerHead, GoogleTagManagerBody } from "@/components/seo/GoogleTagManager";
import UTMCapture from "@/components/seo/UTMCapture";
import CookieConsent from "@/components/ui/CookieConsent";
import PromoBanner from "@/components/layout/PromoBanner";
import BrandProvider from "@/components/brand/BrandProvider";
import { VercelMonitoring } from "@/components/VercelMonitoring";
import { getBrand } from "@/lib/brand";
import "../globals.css";

/**
 * Brand-aware metadata. Resolved per-request from the host header so the
 * Workwell domain serves Workwell title/OG/canonical, and Clever serves Clever.
 */
export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  const isWorkwell = brand.id === 'workwell';

  const titleDefault = isWorkwell
    ? `${brand.name} | Award-Winning Accountancy for Contractors & Small Business`
    : `${brand.name} | Expert Online Accounting Services UK`;

  const description = isWorkwell
    ? "Award-winning accountancy services perfect for contractors & small business owners. Dedicated accountant, unlimited support, Making Tax Digital experts."
    : "Online accountancy services for sole traders, limited companies, contractors & freelancers. 20+ years experience, 10,000+ businesses served. From £42.50/month.";

  return {
    metadataBase: new URL(`https://${brand.domain}`),
    title: { default: titleDefault, template: `%s | ${brand.name}` },
    description,
    keywords: [
      "online accountant",
      "online accounting",
      "UK accountant",
      "sole trader accountant",
      "limited company accountant",
      "contractor accountant",
      "freelancer accountant",
      "IR35",
      "tax returns",
      "VAT returns",
      "payroll",
      "self assessment tax return",
      "MTD accounting",
    ],
    authors: [{ name: brand.legalName }],
    creator: brand.legalName,
    publisher: brand.legalName,
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: brand.name,
      title: titleDefault,
      description,
      url: `https://${brand.domain}`,
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: { canonical: `https://${brand.domain}` },
    icons: brand.assets.favicon,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brand = await getBrand();
  // Fetch site settings from Sanity; falls back to constants in Header if null
  const siteSettings = await getSiteSettings().catch(() => null);

  // Reading-mode chrome for /learn/* — see LearnHeader / LearnFooter for the
  // rationale. Detection via the `x-pathname` header that middleware stamps
  // on every request.
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";
  const useLightChrome = pathname === "/learn" || pathname.startsWith("/learn/");

  // Build the Google Fonts URL once per brand. Inter is the default and is
  // already imported in globals.css; loading the WW font conditionally here
  // (rather than always-on) keeps the Clever bundle unchanged.
  const fontFamilyParam = brand.font.family.replace(/\s+/g, '+');
  const fontHref =
    brand.id === 'workwell'
      ? `https://fonts.googleapis.com/css2?family=${fontFamilyParam}:wght@${brand.font.weights}&display=swap`
      : null;

  return (
    <html lang="en" className="h-full" data-brand={brand.id}>
      <head>
        {fontHref && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={fontHref} />
          </>
        )}
        <OrganizationJsonLd />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        <UTMCapture />
        <BrandProvider brandId={brand.id}>
          {useLightChrome ? (
            <LearnHeader />
          ) : (
            <>
              <PromoBanner />
              {/* siteSettings is a shared (Clever) singleton — only use it for
                  Clever. Other brands fall back to their registry contact info. */}
              <Header
                phone={brand.id === "clever" ? (siteSettings?.phone ?? undefined) : undefined}
                freephone={brand.id === "clever" ? (siteSettings?.freephone ?? undefined) : undefined}
              />
              <TrustBar brand={brand} />
            </>
          )}
          <main className="flex-1">{children}</main>
          {useLightChrome ? <LearnFooter /> : <Footer brand={brand} />}
          <CookieConsent />
        </BrandProvider>
        <VercelMonitoring />
      </body>
    </html>
  );
}
