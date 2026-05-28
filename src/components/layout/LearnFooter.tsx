import Link from "next/link";
import Image from "next/image";
import { Phone, ShieldCheck, RefreshCw } from "lucide-react";
import { getBrand } from "@/lib/brand";

/**
 * Slim footer for the Learning Centre.
 *
 * Replaces the full marketing footer (4-column "Who we help / Specialist
 * services / Guides / Company") with a focused close: trust signals + key
 * legal links + brand. The full marketing chrome lives back on the main
 * marketing site — this is reading mode.
 */
export default async function LearnFooter() {
  const brand = await getBrand();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Trust signals row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/15 ring-1 ring-green-500/20 flex items-center justify-center">
              <ShieldCheck className="text-green-400" size={18} />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Reviewed by qualified accountants</p>
              <p className="text-xs text-white/60 leading-snug mt-0.5">Every guide carries a last-reviewed date.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/15 ring-1 ring-blue-500/20 flex items-center justify-center">
              <RefreshCw className="text-blue-400" size={18} />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Updated when the rules change</p>
              <p className="text-xs text-white/60 leading-snug mt-0.5">HMRC and Companies House change yearly — so do these guides.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/15 ring-1 ring-secondary/20 flex items-center justify-center">
              <Phone className="text-secondary" size={18} />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Talk to an accountant</p>
              <a
                href={`tel:${brand.freephone.replace(/\s/g, "")}`}
                className="text-xs text-white/60 hover:text-white leading-snug mt-0.5 block"
              >
                Call free: {brand.freephone}
              </a>
            </div>
          </div>
        </div>

        {/* Brand row */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link href="/" className="inline-flex items-center gap-2">
            {/* Use the regular PNG (has transparency) + CSS filter to render as pure white silhouette.
                The "_white" variant is a JPG with a solid white background which doesn't work on dark. */}
            <Image
              src={brand.assets.logo}
              alt={brand.name}
              width={140}
              height={40}
              className="h-8 w-auto brightness-0 invert opacity-90"
            />
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
            <Link href="/learn" className="hover:text-white transition-colors">Learning Centre</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>

          <p className="text-xs text-white/50">
            © {year} {brand.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
