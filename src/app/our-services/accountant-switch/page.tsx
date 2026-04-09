import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone, Clock, ShieldCheck, Smile } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Switch Accountant",
  description: "Switching to Clever Accounts is quick, easy and free. We handle everything — contact your old accountant, transfer your records, and get you set up.",
};

export default function SwitchAccountantPage() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" /></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Switching Accountants?<br /><span className="text-primary-light">We Make It Easy</span>
            </h1>
            <p className="text-lg text-white/85 leading-relaxed mb-8">
              Unhappy with your current accountant? Switching to Clever Accounts is quick, seamless and completely free. We handle everything so you don&apos;t have to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
                Switch Now <ArrowRight size={20} />
              </Link>
              <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">
                <Phone size={20} /> Talk to Us First
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-dark mb-4">How Switching Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <Smile size={28} />, title: "1. Sign Up", desc: "Complete our simple sign-up form. It takes just a few minutes." },
              { icon: <ShieldCheck size={28} />, title: "2. We Contact Them", desc: "We handle all communication with your previous accountant." },
              { icon: <Clock size={28} />, title: "3. Seamless Transfer", desc: "Records transferred and your new account set up — typically within 2-4 weeks." },
              { icon: <CheckCircle2 size={28} />, title: "4. You're Sorted", desc: "Your dedicated accountant takes over. No disruption, no gaps." },
            ].map((s) => (
              <div key={s.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold text-dark mb-2">{s.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Switch?</h2>
          <p className="text-white/80 mb-8">No hassle, no fees, no disruption. Just better accounting.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
            Switch to Clever Accounts <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
