import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Star, Phone, ShieldCheck, FileSearch, ArrowLeftRight, Scale } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "IR35 Specialist Accountants",
  description:
    "Expert IR35 accountants for contractors. End-to-end IR35 support, contract reviews, status determinations & Clever FLEX umbrella solution. From £104.50/month.",
};

export default function IR35Page() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm text-white/90 mb-6">
              <ShieldCheck size={14} /> Specialist IR35 Support
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              IR35 Specialist<br />
              <span className="text-primary-light">Accountants</span>
            </h1>
            <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-2xl">
              Navigate IR35 with confidence. End-to-end support including contract reviews, status determinations,
              and our unique Clever FLEX solution for seamless PSC/umbrella switching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
                Get IR35 Support <ArrowRight size={20} />
              </Link>
              <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">
                <Phone size={20} /> Speak to an Expert
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-dark mb-4">Complete IR35 Support</h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Everything you need to navigate IR35 with confidence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FileSearch size={28} />, title: "Contract Reviews", desc: "Every contract reviewed for IR35 status with detailed written assessment and recommendations." },
              { icon: <Scale size={28} />, title: "Status Determinations", desc: "Expert guidance on IR35 status with support for CEST assessments and client determinations." },
              { icon: <ArrowLeftRight size={28} />, title: "Clever FLEX", desc: "Switch seamlessly between PSC (outside IR35) and umbrella (inside IR35) as contracts change." },
              { icon: <ShieldCheck size={28} />, title: "Compliance", desc: "Stay fully compliant with all IR35 regulations. We keep you updated on every legislative change." },
            ].map((item) => (
              <div key={item.title} className="bg-surface rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="gradient-cta rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">IR35 Support Included</h2>
            <div className="text-5xl font-bold text-white my-4">£104.50<span className="text-xl text-white/70">/month</span></div>
            <p className="text-white/80 mb-6">Full contractor accounting + specialist IR35 support. No extras.</p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
              Get Started Today <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (<Star key={i} size={20} className="fill-amber-400 text-amber-400" />))}
          </div>
          <blockquote className="text-xl text-dark leading-relaxed mb-4 italic">
            &ldquo;The IR35 support alone is worth every penny. They handle everything — contracts, assessments, and switching between umbrella and PSC seamlessly with Clever FLEX.&rdquo;
          </blockquote>
          <p className="font-semibold text-dark">James Cooper</p>
          <p className="text-sm text-text-light">IT Contractor</p>
        </div>
      </section>

      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need IR35 Advice?</h2>
          <p className="text-white/80 mb-8">Speak to our specialist contractor team today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
              Get Started <ArrowRight size={20} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
