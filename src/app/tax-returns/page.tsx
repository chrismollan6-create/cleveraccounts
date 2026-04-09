import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tax Return Service",
  description: "Online self assessment tax return service. We prepare and file your tax return to HMRC on time. Dedicated accountant, unlimited advice. From £32.50/month.",
};

export default function TaxReturnsPage() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" /></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Self Assessment<br /><span className="text-primary-light">Tax Returns</span>
            </h1>
            <p className="text-lg text-white/85 leading-relaxed mb-8">
              We prepare and file your self assessment tax return to HMRC — on time, every time. No more tax deadline stress. Your dedicated accountant handles everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
                Get Started <ArrowRight size={20} />
              </Link>
              <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">
                <Phone size={20} /> {COMPANY.freephone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark mb-8 text-center">What&apos;s Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Self assessment tax return preparation", "Filing to HMRC before deadline", "Tax liability calculation", "Payment on account advice", "Tax efficiency planning", "Expense review & optimisation", "HMRC correspondence handling", "Unlimited tax advice year-round"].map((f) => (
              <div key={f} className="flex items-center gap-3 p-4 rounded-xl bg-surface">
                <CheckCircle2 size={20} className="text-success shrink-0" />
                <span className="text-text font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Tax Returns Sorted</h2>
          <p className="text-white/80 mb-8">Included in all packages from just £32.50/month.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
            Get Started Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
