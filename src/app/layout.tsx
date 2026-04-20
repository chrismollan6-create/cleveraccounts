import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import { getSiteSettings } from "@/sanity/queries";
import TrustBar from "@/components/layout/TrustBar";
import Footer from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/components/seo/StructuredData";
import { GoogleTagManagerHead, GoogleTagManagerBody } from "@/components/seo/GoogleTagManager";
import UTMCapture from "@/components/seo/UTMCapture";
import CookieConsent from "@/components/ui/CookieConsent";
import ChatButton from "@/components/ui/ChatButton";
import RequestCallback from "@/components/ui/RequestCallback";
import PromoBanner from "@/components/layout/PromoBanner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cleveraccounts.com"),
  title: {
    default: "Clever Accounts | Expert Online Accounting Services UK",
    template: "%s | Clever Accounts",
  },
  description:
    "Online accountancy services for sole traders, limited companies, contractors & freelancers. 20+ years experience, 10,000+ businesses served. From £42.50/month.",
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
    "online accounting services",
    "accounting for contractors",
    "self assessment tax return",
    "MTD accounting",
  ],
  authors: [{ name: "Clever Accounts Ltd" }],
  creator: "Clever Accounts Ltd",
  publisher: "Clever Accounts Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Clever Accounts",
    title: "Clever Accounts | Expert Online Accounting Services UK",
    description:
      "Online accountancy services for sole traders, limited companies, contractors & freelancers. 20+ years experience, 10,000+ businesses served.",
    url: "https://cleveraccounts.com",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clever Accounts - Expert Online Accounting Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clever Accounts | Expert Online Accounting Services UK",
    description:
      "Online accountancy services for sole traders, limited companies, contractors & freelancers. From £42.50/month.",
    images: ["/images/og-image.png"],
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
  alternates: {
    canonical: "https://cleveraccounts.com",
  },
  verification: {
    // Add your verification codes here:
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings from Sanity; falls back to constants in Header if null
  const siteSettings = await getSiteSettings().catch(() => null);

  return (
    <html lang="en" className="h-full">
      <head>
        <OrganizationJsonLd />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        <UTMCapture />
        <PromoBanner />
        <Header
          phone={siteSettings?.phone ?? undefined}
          freephone={siteSettings?.freephone ?? undefined}
        />
        <TrustBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatButton />
        <CookieConsent />
      </body>
    </html>
  );
}
