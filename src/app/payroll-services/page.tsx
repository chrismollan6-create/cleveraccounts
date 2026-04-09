import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Payroll Services",
  description: "Online payroll service for UK businesses. Monthly payroll processing, RTI submissions, payslips for directors & staff. Included in our Limited Company package.",
};

export default function PayrollServicesPage() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" /></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Payroll<br /><span className="text-primary-light">Services</span>
            </h1>
            <p className="text-lg text-white/85 leading-relaxed mb-8">
              Monthly payroll processing for directors and staff. RTI submissions, payslips, P60s and pension auto-enrolment — all handled by your dedicated accountant.
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
            {["Monthly payroll processing", "RTI submissions to HMRC", "Payslips for directors & staff", "P60 end-of-year certificates", "P11D benefits reporting", "Pension auto-enrolment", "PAYE & NI calculations", "Unlimited payroll advice"].map((f) => (
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
          <h2 className="text-3xl font-bold text-white mb-4">Payroll Sorted</h2>
          <p className="text-white/80 mb-8">Included in our Limited Company package from £104.50/month.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
            Get Started Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
