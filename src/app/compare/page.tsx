import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Clever Accounts",
  description: "Compare Clever Accounts vs local accountants vs DIY accounting. See why 10,000+ businesses choose Clever Accounts.",
};

const rows = [
  { feature: "Dedicated named accountant", clever: true, local: true, diy: false },
  { feature: "Unlimited advice included", clever: true, local: false, diy: false },
  { feature: "Free accounting software", clever: true, local: false, diy: false },
  { feature: "Real-time financial dashboard", clever: true, local: false, diy: true },
  { feature: "All tax returns & filings", clever: true, local: true, diy: false },
  { feature: "Open banking (25+ banks)", clever: true, local: false, diy: true },
  { feature: "No setup fees", clever: true, local: false, diy: true },
  { feature: "No minimum contract", clever: true, local: false, diy: true },
  { feature: "IR35 support & contract reviews", clever: true, local: false, diy: false },
  { feature: "Mobile app access", clever: true, local: false, diy: true },
  { feature: "Invoice creation & tracking", clever: true, local: false, diy: true },
  { feature: "MTD compliant", clever: true, local: true, diy: false },
  { feature: "Proactive tax planning", clever: true, local: "Varies", diy: false },
  { feature: "Payroll included", clever: true, local: "Extra cost", diy: false },
  { feature: "Average monthly cost", clever: "From £32.50", local: "£100-300+", diy: "£15-50 (software only)" },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle2 size={20} className="text-success mx-auto" />;
  if (value === false) return <X size={20} className="text-red-400 mx-auto" />;
  return <span className="text-sm text-text">{value}</span>;
}

export default function ComparePage() {
  return (
    <>
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Why Choose Clever Accounts?</h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            See how we compare to traditional accountants and DIY software.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-text-light w-1/3">Feature</th>
                  <th className="p-4 text-center w-[22%]">
                    <div className="bg-primary/10 rounded-xl p-3">
                      <div className="font-bold text-primary text-sm">Clever Accounts</div>
                    </div>
                  </th>
                  <th className="p-4 text-center w-[22%]">
                    <div className="bg-surface rounded-xl p-3">
                      <div className="font-bold text-text text-sm">Local Accountant</div>
                    </div>
                  </th>
                  <th className="p-4 text-center w-[22%]">
                    <div className="bg-surface rounded-xl p-3">
                      <div className="font-bold text-text text-sm">DIY Software</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-surface/50" : ""}>
                    <td className="p-4 text-sm font-medium text-dark">{row.feature}</td>
                    <td className="p-4 text-center"><Cell value={row.clever} /></td>
                    <td className="p-4 text-center"><Cell value={row.local} /></td>
                    <td className="p-4 text-center"><Cell value={row.diy} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">The Choice Is Clear</h2>
          <p className="text-white/80 mb-8">Join 10,000+ businesses who chose Clever Accounts.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
            Get Started Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
