import type { Metadata } from "next";
import BrandProvider from "@/components/brand/BrandProvider";
import CookieConsent from "@/components/ui/CookieConsent";
import { GoogleTagManagerHead, GoogleTagManagerBody } from "@/components/seo/GoogleTagManager";
import UTMCapture from "@/components/seo/UTMCapture";
import { VercelMonitoring } from "@/components/VercelMonitoring";
import { getBrand } from "@/lib/brand";
import "../globals.css";

/**
 * Minimal layout for the e-sign engagement letter flow.
 *
 * Deliberately omits the site header / trust pills / footer that the
 * funnel layout adds — the engagement letter page renders its own
 * branded header inside the document card so the page chrome would
 * be a duplicated "double header" otherwise. Keeps brand-aware metadata,
 * cookie consent, GTM, and UTM capture for compliance + analytics parity
 * with the rest of the site.
 */
export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    metadataBase: new URL(`https://${brand.appDomain}`),
    title: {
      default: `Engagement Letter | ${brand.name}`,
      template: `%s | ${brand.name}`,
    },
    description: `Review and sign your engagement letter with ${brand.name}.`,
    robots: { index: false, follow: false },
    formatDetection: { email: false, address: false, telephone: false },
    icons: brand.assets.favicon ? { icon: brand.assets.favicon } : undefined,
  };
}

export default async function EsignLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const brand = await getBrand();

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
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-gradient-to-b from-gray-50 to-white">
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        <UTMCapture />
        <BrandProvider brandId={brand.id}>
          <main className="flex-1">{children}</main>
          <CookieConsent />
        </BrandProvider>
        <VercelMonitoring />
      </body>
    </html>
  );
}
