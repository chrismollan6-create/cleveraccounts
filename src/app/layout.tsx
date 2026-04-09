import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clever Accounts | Expert Online Accounting Services UK",
    template: "%s | Clever Accounts",
  },
  description:
    "Online accountancy services for sole traders, limited companies, contractors & freelancers. 20+ years experience, 10,000+ businesses served. From £32.50/month.",
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
  ],
  authors: [{ name: "Clever Accounts Ltd" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Clever Accounts",
    title: "Clever Accounts | Expert Online Accounting Services UK",
    description:
      "Online accountancy services for sole traders, limited companies, contractors & freelancers. 20+ years experience, 10,000+ businesses served.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clever Accounts | Expert Online Accounting Services UK",
    description:
      "Online accountancy services for sole traders, limited companies, contractors & freelancers. From £32.50/month.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
