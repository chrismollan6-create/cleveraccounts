import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import { getBrand } from "@/lib/brand";

/**
 * Lighter header for the Learning Centre.
 *
 * Reading mode, not browsing mode — keeps the brand identity (logo, phone,
 * primary CTA) but drops the full Services dropdown, Blog, About etc. The
 * main `(site)` Header is too dominant for editorial content.
 *
 * On Workwell hosts this also reduces the "wait, this is a different site"
 * feeling — visitors arriving from workwellaccountancy.com get a focused
 * guide experience rather than what looks like a separate marketing site.
 */
export default async function LearnHeader() {
  const brand = await getBrand();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2.5">
          <Image
            src={brand.assets.logo}
            alt={brand.name}
            width={160}
            height={48}
            className="h-9 md:h-10 w-auto rounded-lg"
            priority
          />
        </Link>

        {/* Slim nav + CTAs */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/learn"
            className="hidden sm:inline-flex text-sm font-medium text-text hover:text-primary transition-colors px-3 py-2"
          >
            Learning Centre
          </Link>
          <Link
            href="/pricing"
            className="hidden sm:inline-flex text-sm font-medium text-text hover:text-primary transition-colors px-3 py-2"
          >
            Pricing
          </Link>
          <a
            href={`tel:${brand.freephone.replace(/\s/g, "")}`}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-text-light hover:text-primary transition-colors"
          >
            <Phone size={14} /> {brand.freephone}
          </a>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary-dark text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
