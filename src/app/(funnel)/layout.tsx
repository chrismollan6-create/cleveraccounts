import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, ShieldCheck, Star, Lock } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { getSiteSettings } from "@/sanity/queries";
import { OrganizationJsonLd } from "@/components/seo/StructuredData";
import { GoogleTagManagerHead, GoogleTagManagerBody } from "@/components/seo/GoogleTagManager";
import UTMCapture from "@/components/seo/UTMCapture";
import CookieConsent from "@/components/ui/CookieConsent";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cleveraccounts.com"),
  title: {
    default: "Sign Up | Clever Accounts",
    template: "%s | Clever Accounts",
  },
  description:
    "Set up your Clever Accounts service in minutes. One monthly fee, unlimited support, dedicated UK accountant.",
  robots: {
    index: false,
    follow: true,
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export default async function FunnelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings().catch(() => null);
  const freephone = settings?.freephone ?? COMPANY.freephone;
  const freephoneTel = freephone.replace(/\s/g, "");

  return (
    <html lang="en" className="h-full">
      <head>
        <OrganizationJsonLd />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-gradient-to-b from-gray-50 to-white">
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        <UTMCapture />

        {/* ── Funnel header — clean, focused, no nav distractions ── */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link href="/" aria-label="Clever Accounts — back to home" className="flex items-center shrink-0">
              <Image
                src="/images/logo.png"
                alt="Clever Accounts"
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
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                4.7 on Trustpilot
              </span>
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
              <span>© {new Date().getFullYear()} Clever Accounts Ltd</span>
              <span className="text-gray-300">·</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <span className="text-gray-300">·</span>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Lock size={12} className="text-primary" />
                256-bit SSL secured
              </span>
              <span className="text-gray-300">·</span>
              <a
                href={`mailto:${COMPANY.email}`}
                className="hover:text-primary transition-colors"
              >
                {COMPANY.email}
              </a>
            </div>
          </div>
        </footer>

        <CookieConsent />
      </body>
    </html>
  );
}
