import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UserPlus, Users, PartyPopper, CheckCircle2, Phone } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Getting started with Clever Accounts is easy. Sign up, get matched with a dedicated accountant, and focus on your business. Three simple steps.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">How It Works</h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Getting started with Clever Accounts takes just minutes. Here&apos;s how simple it is.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-16">
            {[
              {
                step: "1",
                icon: <UserPlus size={32} />,
                title: "Sign Up & Choose Your Plan",
                description: "Pick the package that suits your business — Sole Trader, Limited Company, or Contractor. Sign up online in just a few minutes. No setup fees, no minimum contract, and you can cancel anytime.",
                points: ["Choose from transparent, fixed-fee plans", "No paperwork or lengthy forms", "Instant access to your account"],
              },
              {
                step: "2",
                icon: <Users size={32} />,
                title: "Get Your Dedicated Accountant",
                description: "You'll be matched with a dedicated accountant who specialises in your type of business. They'll get to know your situation and become your trusted financial partner.",
                points: ["Specialist in your business type", "Available by phone and email", "Proactive advice, not just number-crunching"],
              },
              {
                step: "3",
                icon: <PartyPopper size={32} />,
                title: "Focus on Your Business",
                description: "Relax knowing your accounts, tax returns, VAT and compliance are all taken care of. Track your finances in real-time with free FreeAgent software and reach out to your accountant whenever you need.",
                points: ["All filings handled and submitted on time", "Real-time dashboard on any device", "Unlimited advice whenever you need it"],
              },
            ].map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="w-16 h-16 rounded-full gradient-cta text-white text-2xl font-bold flex items-center justify-center shadow-lg">
                    {item.step}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                </div>
                <div className="md:col-span-6">
                  <h2 className="text-2xl font-bold text-dark mb-3">{item.title}</h2>
                  <p className="text-text-light leading-relaxed mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-text">
                        <CheckCircle2 size={16} className="text-success" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">Join 10,000+ UK businesses in just 3 simple steps.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg">
              Get Started Today <ArrowRight size={20} />
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
