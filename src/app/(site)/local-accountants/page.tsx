import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Online vs Local Accountant",
  description: "Why switch from your local accountant to Clever Accounts? Better service, lower costs, free software, unlimited support. Compare and switch today.",
};

export default function LocalAccountantsPage() {
  return (
    <>
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Why Switch from Your Local Accountant?</h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Get more for less. Online accounting with Clever Accounts gives you better service, lower costs, and modern software — all without leaving your desk.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {[
              { feature: "Average monthly cost", us: "From £42.50", them: "£100-300+" },
              { feature: "Dedicated named accountant", us: true, them: true },
              { feature: "Unlimited advice included", us: true, them: false },
              { feature: "Free accounting software", us: true, them: false },
              { feature: "Real-time financial dashboard", us: true, them: false },
              { feature: "Mobile app access", us: true, them: false },
              { feature: "Open banking", us: true, them: false },
              { feature: "No setup fees", us: true, them: false },
              { feature: "No minimum contract", us: true, them: false },
              { feature: "Available online — no travel needed", us: true, them: false },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface">
                <span className="flex-1 text-sm font-medium text-dark">{row.feature}</span>
                <div className="w-32 text-center">
                  {typeof row.us === "boolean" ? (
                    row.us ? <CheckCircle2 size={20} className="text-success mx-auto" /> : <X size={20} className="text-red-400 mx-auto" />
                  ) : (
                    <span className="text-sm font-bold text-primary">{row.us}</span>
                  )}
                </div>
                <div className="w-32 text-center">
                  {typeof row.them === "boolean" ? (
                    row.them ? <CheckCircle2 size={20} className="text-success mx-auto" /> : <X size={20} className="text-red-400 mx-auto" />
                  ) : (
                    <span className="text-sm text-text-light">{row.them}</span>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 p-2">
              <span className="flex-1" />
              <div className="w-32 text-center text-xs font-bold text-primary uppercase">Clever Accounts</div>
              <div className="w-32 text-center text-xs font-bold text-text-light uppercase">Local Accountant</div>
            </div>
          </div>
        </div>
      </section>

      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Make the Switch Today</h2>
          <p className="text-white/80 mb-8">Switching is free, fast and hassle-free. We handle everything.</p>
          <Link href="/our-services/accountant-switch" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
            Switch Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
