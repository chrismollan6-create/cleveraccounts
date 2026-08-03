"use client";
import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";
import { useBrand } from "@/lib/useBrand";

/**
 * Lightweight referral promo panel. Drives to /refer-a-friend, where the client
 * gets their personal link + one-tap WhatsApp / Text / Share buttons.
 * Brand-aware (uses the active brand name). `tone="cis"` for the punchier CIS line.
 */
export default function ReferralCta({ tone = "calm" }: { tone?: "calm" | "cis" }) {
  const brand = useBrand();
  const cis = tone === "cis";

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-border bg-surface p-7 md:p-9 flex flex-col md:flex-row md:items-center gap-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary-dark flex items-center justify-center shrink-0 mx-auto md:mx-0">
            <Gift size={26} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black text-dark mb-1.5 leading-tight">
              {cis ? "Know a mate who's overpaying? Refer them." : "Know someone who'd benefit? Refer them."}
            </h2>
            <p className="text-text-light leading-relaxed">
              Refer a mate to {brand.name} and earn <strong className="text-dark">£75</strong> when they join — grab your link and share it in a tap.
            </p>
          </div>
          <Link
            href="/refer-a-friend"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-secondary/90 transition-all shrink-0"
          >
            Get your link <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
