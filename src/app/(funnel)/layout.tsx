import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, ShieldCheck, Star, Lock } from "lucide-react";
import { getSiteSettings } from "@/sanity/queries";
import { OrganizationJsonLd } from "@/components/seo/StructuredData";
import { GoogleTagManagerHead, GoogleTagManagerBody } from "@/components/seo/GoogleTagManager";
import UTMCapture from "@/components/seo/UTMCapture";
import CookieConsent from "@/components/ui/CookieConsent";
import BrandProvider from "@/components/brand/BrandProvider";
import { VercelMonitoring } from "@/components/VercelMonitoring";
import { getBrand } from "@/lib/brand";
import "../globals.css";

/**
 * Funnel-layout metadata. Brand-aware so Workwell sign-up gets a Workwell
 * page title / OG / canonical even though this is a noindex flow.
 */
export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    metadataBase: new URL(`https://${brand.appDomain}`),
    title: {
      default: `Sign Up | ${brand.name}`,
      template: `%s | ${brand.name}`,
    },
    description: `Set up your ${brand.name} service in minutes. One monthly fee, unlimited support, dedicated UK accountant.`,
    robots: { index: false, follow: true },
    formatDetection: { email: false, address: false, telephone: false },
    icons: brand.assets.favicon ? { icon: brand.assets.favicon } : undefined,
  };
}

export default async function FunnelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const brand = await getBrand();
  const settings = await getSiteSettings().catch(() => null);
  // Sanity settings only apply to Clever — fall back to brand-specific value for WW
  const freephone = (brand.id === 'clever' && settings?.freephone) || brand.freephone;
  const freephoneTel = freephone.replace(/\s/g, "");

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
      <body className="min-h-full flex flex-col font-sans antialiased bg-gradient-to-b from-gray-50 to-white">
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        <UTMCapture />
        <BrandProvider brandId={brand.id}>
          {/* ── Funnel header — clean, focused, no nav distractions ── */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
              <Link href="/" aria-label={`${brand.name} — back to home`} className="flex items-center shrink-0">
                <Image
                  src={brand.assets.logo}
                  alt={brand.name}
                  width={160}
                  height={40}
                  priority
                  className="h-9 w-auto"
                />
              </Link>

              {/* Inline trust pill — desktop only */}
              <div className="hidden md:flex items-center gap-4 text-xs text-text-light">
                <span className="inline-flex items-center gap-1.5">
                  <Lock size={13} className="text-primary" />
                  Secure sign-up
                </span>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-primary" />
                  FCSA accredited
                </span>
                {brand.trustpilot?.rating && (
                  <>
                    <span className="text-gray-300">·</span>
                    <a
                      href={brand.trustpilot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {brand.trustpilot.rating} on Trustpilot
                    </a>
                  </>
                )}
              </div>

              {/* Help phone — always visible */}
              <a
                href={`tel:${freephoneTel}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                <Phone size={15} />
                <span className="hidden sm:inline">{freephone}</span>
                <span className="sm:hidden">Call us</span>
              </a>
            </div>
          </header>

          {/* ── Main funnel content ── */}
          <main className="flex-1">{children}</main>

          {/* ── Trim sign-off footer — minimal, trustworthy, no exit ramps ── */}
          <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-light">
              <div className="flex items-center gap-4">
                <span>© {new Date().getFullYear()} {brand.legalName}</span>
                <span className="text-gray-300">·</span>
                {/* Legal links are <a> not <Link>: a brand's pages may be
                    externally hosted (e.g. Workwell's on WordPress). */}
                <a href={brand.legal.privacyUrl} className="hover:text-primary transition-colors">Privacy</a>
                {brand.legal.termsUrl && (
                  <>
                    <span className="text-gray-300">·</span>
                    <a href={brand.legal.termsUrl} className="hover:text-primary transition-colors">Terms</a>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Lock size={12} className="text-primary" />
                  256-bit SSL secured
                </span>
                <span className="text-gray-300">·</span>
                <a
                  href={`mailto:${brand.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {brand.email}
                </a>
              </div>
            </div>
          </footer>

          <CookieConsent />
        </BrandProvider>
        <VercelMonitoring />
      </body>
    </html>
  );
}
