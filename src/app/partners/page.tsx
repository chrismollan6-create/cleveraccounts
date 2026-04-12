import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, CheckCircle2, Star, Shield, PoundSterling, TrendingUp, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Partner Services — Business Banking, Insurance & Financial Planning | Clever Accounts",
  description:
    "Our recommended partners for UK business banking, professional insurance, and financial planning. Exclusive offers for Clever Accounts clients — including £75 cashback with Tide.",
};

const partners = [
  {
    name: "Tide",
    category: "Business Banking",
    categoryColour: "bg-blue-500/10 text-blue-600",
    tagline: "The UK's most-loved business bank account",
    description: "Tide is purpose-built for small businesses and sole traders. Open a business current account in minutes — no high street branch required. Send invoices, track spending, and manage your money on the go.",
    offer: {
      headline: "£75 cashback for Clever Accounts clients",
      detail: "Sign up through our link and deposit £100 or more. Clever Accounts clients receive £75 cashback automatically. No catches.",
      badge: "Exclusive Offer",
    },
    features: [
      "Free business current account",
      "Open in under 10 minutes",
      "Free invoicing built in",
      "Integrates directly with FreeAgent",
      "Expense categorisation",
      "24/7 in-app support",
    ],
    cta: "Get £75 Cashback",
    href: "https://tide.co",
    colour: "border-blue-200 hover:border-blue-400",
    iconBg: "bg-[#00D2FF]",
    initial: "T",
  },
  {
    name: "Kingsbridge",
    category: "Business Insurance",
    categoryColour: "bg-green-500/10 text-green-600",
    tagline: "Professional insurance built for contractors & SMEs",
    description: "Kingsbridge specialise in insurance for contractors, freelancers and small businesses. They make it easy to get the cover you need — Professional Indemnity, Public Liability and Employers Liability — without the complexity.",
    offer: {
      headline: "Cover from one of the UK's leading specialist insurers",
      detail: "Kingsbridge have insured over 100,000 contractors and SMEs. Get a quote in minutes and be covered the same day.",
      badge: "Recommended Partner",
    },
    features: [
      "Professional Indemnity Insurance",
      "Public Liability Insurance",
      "Employers Liability Insurance",
      "Tailored for contractors & SMEs",
      "Instant online quotes",
      "Same-day cover available",
    ],
    cta: "Get a Quote",
    href: "https://www.kingsbridge.co.uk",
    colour: "border-green-200 hover:border-green-400",
    iconBg: "bg-green-600",
    initial: "K",
  },
  {
    name: "Prospera Wealth",
    category: "Financial Planning",
    categoryColour: "bg-purple-500/10 text-purple-600",
    tagline: "Independent financial advice for business owners",
    description: "Prospera Wealth are our recommended independent financial advisers. Whether you're planning for retirement, protecting your income, or thinking about investments — they provide clear, jargon-free advice tailored to business owners.",
    offer: {
      headline: "Independent advice, aligned to your goals",
      detail: "As a Clever Accounts client, you can be introduced directly to the Prospera Wealth team for a no-obligation initial conversation.",
      badge: "Recommended Partner",
    },
    features: [
      "Pension & retirement planning",
      "Income protection",
      "Life & critical illness cover",
      "Investment planning",
      "Director-specific financial planning",
      "Independent, whole of market advice",
    ],
    cta: "Visit Prospera Wealth",
    href: "https://www.prosperawealth.co.uk/",
    colour: "border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-600",
    initial: "P",
  },
];

export default function PartnersPage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-4">Trusted Partners</p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Services We<br />
            <span className="text-gradient">Recommend to Clients</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We only recommend businesses we'd use ourselves. These partners have been chosen because they're genuinely good at what they do — and they make life easier for our clients.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── PARTNERS ─────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          {partners.map((p, i) => (
            <div
              key={p.name}
              className={`border-2 rounded-3xl p-8 md:p-10 transition-colors ${p.colour}`}
            >
              <div className="flex flex-col md:flex-row gap-8">

                {/* Left col */}
                <div className="md:w-72 shrink-0">
                  {/* Logo placeholder */}
                  <div className={`w-16 h-16 rounded-2xl ${p.iconBg} flex items-center justify-center text-white text-2xl font-black mb-4`}>
                    {p.initial}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.categoryColour} mb-3 inline-block`}>
                    {p.category}
                  </span>
                  <h2 className="text-2xl font-black text-dark mb-1">{p.name}</h2>
                  <p className="text-text-light text-sm mb-6">{p.tagline}</p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-text">
                        <CheckCircle2 size={15} className="text-success shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right col */}
                <div className="flex-1 flex flex-col">
                  <p className="text-text leading-relaxed mb-6">{p.description}</p>

                  {/* Offer box */}
                  <div className="bg-surface border border-border rounded-2xl p-6 mb-6 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        {i === 0 ? <PoundSterling size={16} /> : i === 2 ? <TrendingUp size={16} /> : <Shield size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-dark text-base">{p.offer.headline}</p>
                          <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">{p.offer.badge}</span>
                        </div>
                        <p className="text-text-light text-sm leading-relaxed">{p.offer.detail}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-dark hover:bg-dark/90 text-white font-bold px-6 py-3.5 rounded-xl transition-colors self-start"
                  >
                    {p.cta} <ExternalLink size={16} />
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────── */}
      <section className="bg-surface py-10 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-text-light text-xs leading-relaxed">
            Clever Accounts may receive a referral fee from some of these partners. This does not affect the advice we give our clients or the price you pay. We only recommend services we genuinely believe will benefit your business. Prospera Wealth is an independent financial adviser — financial advice is regulated by the FCA.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16">
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Already a Clever Accounts Client?</h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Talk to your accountant about any of these services — they can make the introduction directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Get in Touch <ArrowRight size={20} />
            </Link>
            <a href="tel:01135188800" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              <Phone size={20} />
              0113 518 8800
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
