import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, Award, Heart, Zap, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Clever Accounts has been providing expert online accountancy services for over 20 years, supporting 10,000+ UK businesses with dedicated accountants and free software.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              About Clever Accounts
            </h1>
            <p className="text-lg text-text-light leading-relaxed">
              For nearly 20 years, we&apos;ve been helping UK businesses take the stress out of accounting.
              Over 10,000 sole traders, limited companies, contractors, and freelancers trust us to handle their finances so they can focus on what they do best.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Our Story</h2>
              <div className="space-y-4 text-text leading-relaxed">
                <p>
                  Clever Accounts was founded with a simple mission: make professional accounting accessible, affordable, and hassle-free for every UK business.
                </p>
                <p>
                  We saw that too many small businesses were overpaying for accountancy services that didn&apos;t meet their needs. So we built something better — combining expert accountants with powerful software, all for one transparent monthly fee.
                </p>
                <p>
                  Today, we&apos;re proud to support over 10,000 businesses across the UK. From sole traders just starting out to established contractors navigating IR35, we provide tailored accounting support that grows with your business.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "20+", label: "Years of Experience", color: "bg-primary/10 text-primary" },
                { value: "10,000+", label: "Businesses Served", color: "bg-secondary/10 text-secondary" },
                { value: "£0", label: "Setup Fees", color: "bg-success/10 text-success" },
                { value: "5★", label: "Customer Rating", color: "bg-accent/10 text-accent-dark" },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.color} rounded-2xl p-6 text-center`}>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm font-medium opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-dark mb-4">Our Values</h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              The principles that guide everything we do at Clever Accounts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users size={28} />,
                title: "People First",
                description: "Every client gets a dedicated accountant who truly understands their business. You're never just a number.",
              },
              {
                icon: <Award size={28} />,
                title: "Excellence",
                description: "We maintain the highest professional standards in everything we do, from tax advice to software quality.",
              },
              {
                icon: <Heart size={28} />,
                title: "Transparency",
                description: "No hidden fees, no jargon, no surprises. We believe in honest, straightforward communication.",
              },
              {
                icon: <Zap size={28} />,
                title: "Innovation",
                description: "We continuously improve our technology and services to give our clients the best possible experience.",
              },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{value.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl font-bold text-dark mb-4">Why Choose Clever Accounts?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "Dedicated accountant who knows your business",
              "Unlimited phone and email support",
              "Free FreeAgent accounting software",
              "No setup fees or minimum contracts",
              "Tax efficiency advice to save you money",
              "All filings and returns handled for you",
              "Specialist IR35 and contractor support",
              "MTD compliant from day one",
              "Open banking with 25+ banks",
              "Real-time financial dashboard on any device",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl hover:bg-surface transition-colors">
                <CheckCircle2 size={20} className="text-success shrink-0" />
                <span className="text-text font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join 10,000+ Happy Businesses?
          </h2>
          <p className="text-white/80 mb-8">
            Get started in minutes. No setup fees, cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
