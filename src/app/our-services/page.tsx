import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, User, Building2, Briefcase, Laptop, Home, Rocket, CheckCircle2 } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Online accounting services for sole traders, limited companies, contractors, freelancers, landlords & startups. Dedicated accountant, free software, from £32.50/month.",
};

const iconMap: Record<string, React.ReactNode> = {
  User: <User size={28} />,
  Building2: <Building2 size={28} />,
  Briefcase: <Briefcase size={28} />,
  Laptop: <Laptop size={28} />,
  Home: <Home size={28} />,
  Rocket: <Rocket size={28} />,
};

export default function ServicesPage() {
  return (
    <>
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Our Services</h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Tailored online accounting packages for every type of UK business. One fixed fee, unlimited support, free software.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICE_CATEGORIES.map((service) => (
              <Link key={service.href} href={service.href} className="group bg-white border border-border rounded-2xl p-8 card-hover">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  {iconMap[service.icon]}
                </div>
                <h2 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">{service.title}</h2>
                <p className="text-text-light text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-light">From <span className="text-lg font-bold text-primary">£{service.price}</span>/mo</span>
                  <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Learn more <ChevronRight size={16} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Every Package Includes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {["Dedicated accountant", "Unlimited advice", "Free FreeAgent software", "No setup fees", "No minimum contract", "Real-time dashboard", "Tax efficiency advice", "All filings & submissions", "Open banking (25+ banks)"].map((f) => (
              <div key={f} className="flex items-center gap-3 bg-white rounded-xl p-4">
                <CheckCircle2 size={20} className="text-success shrink-0" />
                <span className="text-text font-medium text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-4xl mx-auto">
            {[
              { title: "Accounting Software", desc: "Free FreeAgent accounting software included with every package.", href: "/our-services/accounting-software" },
              { title: "Switch Accountant", desc: "Switching to us is quick, easy and hassle-free. We handle everything.", href: "/our-services/accountant-switch" },
              { title: "IR35 Specialist", desc: "End-to-end IR35 support with contract reviews and Clever FLEX.", href: "/contractor-accountants/ir35" },
            ].map((s) => (
              <Link key={s.href} href={s.href} className="group border border-border rounded-2xl p-6 hover:border-primary transition-colors">
                <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-sm text-text-light mb-3">{s.desc}</p>
                <span className="text-primary text-sm font-medium flex items-center gap-1">Learn more <ChevronRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">Join 10,000+ businesses. No setup fees, cancel anytime.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
            Get Started Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
