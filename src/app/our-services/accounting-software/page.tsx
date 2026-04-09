import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Smartphone, BarChart3, FileText, CreditCard, Building, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Accounting Software",
  description: "Free FreeAgent accounting software included with every Clever Accounts package. Invoicing, expenses, banking, real-time dashboard — on any device.",
};

export default function AccountingSoftwarePage() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Free Accounting<br /><span className="text-primary-light">Software Included</span>
            </h1>
            <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-2xl">
              Every Clever Accounts package includes free FreeAgent accounting software. Create invoices, track expenses, connect your bank, and view real-time reports — all from your phone, tablet or computer.
            </p>
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
              Get Started with Free Software <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-dark mb-4">Powerful Features, Simple to Use</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FileText size={28} />, title: "Invoicing", desc: "Create and send professional invoices in seconds. Track payments and send automatic reminders." },
              { icon: <CreditCard size={28} />, title: "Expense Tracking", desc: "Snap receipts, log expenses, and track mileage on the go. Never miss a deduction." },
              { icon: <Building size={28} />, title: "Open Banking", desc: "Connect with 25+ UK banks for automatic transaction imports and reconciliation." },
              { icon: <BarChart3 size={28} />, title: "Real-Time Reports", desc: "See your profit, tax liability, and cash flow in real-time on a beautiful dashboard." },
              { icon: <Smartphone size={28} />, title: "Mobile App", desc: "Access everything on the go. Send invoices, log expenses, and check your finances from anywhere." },
              { icon: <Zap size={28} />, title: "MTD Compliant", desc: "Fully compliant with Making Tax Digital requirements. Submit VAT returns directly." },
            ].map((f) => (
              <div key={f.title} className="bg-surface rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Software + Accountant = Sorted</h2>
          <p className="text-white/80 mb-8">Get powerful software and a dedicated accountant from just £32.50/month.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
            Get Started <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
