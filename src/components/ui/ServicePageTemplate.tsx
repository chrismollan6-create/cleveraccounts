import Link from "next/link";
import { CheckCircle2, ArrowRight, Star, HelpCircle, Phone } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import type { ServicePageData } from "@/lib/service-page-data";

export default function ServicePageTemplate({ data }: { data: ServicePageData }) {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {data.headline}
            </h1>
            <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-2xl">
              {data.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg"
              >
                Get Started — £{data.price}/mo <ArrowRight size={20} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
              >
                View All Pricing
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary-light" /> No setup fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary-light" /> No minimum contract
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary-light" /> Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-dark mb-4">What&apos;s Included</h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Everything you need for £{data.price}/month — no hidden costs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {data.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-surface">
                <CheckCircle2 size={20} className="text-success shrink-0" />
                <span className="text-text font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-dark mb-4">Why Choose Clever Accounts?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-dark mb-2">{benefit.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="gradient-cta rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{data.title}</h2>
            <div className="text-5xl font-bold text-white my-4">
              £{data.price}<span className="text-xl text-white/70">/month</span>
            </div>
            <p className="text-white/80 mb-6">No setup fees. No minimum contract. Cancel anytime.</p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg"
            >
              Get Started Today <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-xl text-dark leading-relaxed mb-4 italic">
            &ldquo;{data.testimonial.quote}&rdquo;
          </blockquote>
          <p className="font-semibold text-dark">{data.testimonial.name}</p>
          <p className="text-sm text-text-light">{data.testimonial.role}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl p-6">
                <h3 className="flex items-start gap-3 text-base font-semibold text-dark mb-2">
                  <HelpCircle size={20} className="text-primary shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-sm text-text-light leading-relaxed ml-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8">
            Join 10,000+ UK businesses who trust Clever Accounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary-light hover:text-primary-dark transition-all shadow-lg"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
            >
              <Phone size={20} />
              Call Free: {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
