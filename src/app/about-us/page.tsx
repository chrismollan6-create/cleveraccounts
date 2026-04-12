import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Award,
  Heart,
  Zap,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  Monitor,
  TrendingDown,
  ShieldCheck,
  MessageCircle,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Clever Accounts — 20 Years of Online Accounting | Clever Accounts",
  description:
    "Clever Accounts has been helping UK sole traders, limited companies, and contractors for over 20 years. 10,000+ businesses served, 5-star rated, Leeds & Watford based.",
};

const values = [
  {
    icon: Users,
    title: "People First",
    description: "Every client gets a dedicated accountant who genuinely knows their business. You're never passed around a call centre or left waiting weeks for an answer.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We hold ourselves to the highest professional standards — from the quality of our tax advice to the software we include with every package.",
  },
  {
    icon: Heart,
    title: "Transparency",
    description: "One fixed monthly fee, no hidden extras, no jargon. You always know exactly what you're paying and exactly what you're getting.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We were early adopters of cloud accounting and MTD. We keep investing in technology so our clients always have the best tools at their fingertips.",
  },
];

const whyUs = [
  "Dedicated accountant who knows your business",
  "Unlimited phone and email support",
  "Free FreeAgent accounting software (Platinum Partner)",
  "No setup fees, no minimum contract",
  "Proactive tax efficiency advice",
  "All HMRC filings and returns handled",
  "Specialist IR35 and contractor support",
  "MTD-compliant from day one",
  "Open banking with 25+ UK banks",
  "Real-time financial dashboard on any device",
  "Leeds and Watford offices",
  "20+ years UK accounting experience",
];

const timeline = [
  { year: "2004", event: "Founded in Leeds with a simple mission: make accounting accessible and affordable for every UK business." },
  { year: "2010", event: "Expanded to Watford, extending our reach across the UK with local expertise in two key business centres." },
  { year: "2015", event: "Became an early adopter of cloud accounting, partnering with FreeAgent to give clients real-time visibility of their finances." },
  { year: "2019", event: "Achieved FreeAgent Platinum Partner status — the highest tier — reflecting our depth of expertise and client volume." },
  { year: "2022", event: "Passed 10,000 active business clients. Led our clients through the MTD for VAT rollout with zero disruption." },
  { year: "2026", event: "Preparing our clients for MTD for Income Tax with proactive onboarding and FreeAgent setup well ahead of the April deadline." },
];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-4">Our Story</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                20 Years of Making<br />
                <span className="text-gradient">Accounting Clever</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-5">
                We started with a simple idea: that every UK business deserves an expert accountant, brilliant software, and a fixed price they can rely on.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Over 20 years and 10,000+ businesses later, that idea hasn't changed. What has changed is the technology — and our ability to deliver it better than ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg">
                  Get Started <ArrowRight size={20} />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/15 transition-all border border-white/20">
                  <Phone size={20} /> Contact Us
                </Link>
              </div>
            </div>

            {/* Stats panel */}
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { value: "20+", label: "Years experience", colour: "text-primary-light", bg: "bg-primary/20" },
                  { value: "10,000+", label: "Businesses served", colour: "text-secondary", bg: "bg-secondary/20" },
                  { value: "5★", label: "Customer rating", colour: "text-green-400", bg: "bg-green-500/20" },
                  { value: "£0", label: "Setup fees", colour: "text-purple-400", bg: "bg-purple-500/20" },
                ].map(({ value, label, colour, bg }) => (
                  <div key={label} className={`${bg} rounded-2xl p-5 text-center`}>
                    <div className={`text-3xl font-black ${colour} mb-1`}>{value}</div>
                    <div className="text-white/60 text-xs">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-white/40 shrink-0" />
                  <div>
                    <div className="text-white/70 text-sm font-semibold">Leeds & Watford</div>
                    <div className="text-white/40 text-xs">Serving businesses across the UK</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-black text-dark mb-5 leading-tight">
                Built for the Way<br />Modern Businesses Work
              </h2>
              <div className="space-y-4 text-text-light leading-relaxed">
                <p>
                  Clever Accounts was founded in Leeds in 2004 with a straightforward mission: make professional accounting accessible, affordable, and genuinely useful for small UK businesses.
                </p>
                <p>
                  We saw that too many sole traders, contractors, and limited companies were either overpaying for traditional firms that barely communicated, or underserved by budget online services that left them without real support.
                </p>
                <p>
                  So we built something in between — and better. Expert, dedicated accountants. Powerful cloud software included free. A fixed monthly price with no surprises.
                </p>
                <p>
                  Today we serve over 10,000 businesses across the UK from our offices in Leeds and Watford. We're specialists in sole trader, limited company, contractor, and landlord accounting — and we've been preparing our clients for Making Tax Digital long before it became mandatory.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-5">Our Journey</p>
              <div className="relative">
                <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-border" />
                <div className="space-y-5">
                  {timeline.map(({ year, event }) => (
                    <div key={year} className="flex gap-5 items-start">
                      <div className="w-10 h-10 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 relative z-10">
                        {year.slice(2)}
                      </div>
                      <div className="bg-surface border border-border rounded-xl p-4 flex-1">
                        <div className="text-primary font-bold text-sm mb-1">{year}</div>
                        <div className="text-text-light text-sm leading-relaxed">{event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">What Drives Us</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">Our Values</h2>
            <p className="text-text-light max-w-xl mx-auto">The principles that guide every decision we make and every client relationship we build.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-7 shadow-sm card-hover text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-black text-dark mb-3">{title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">Why Clever Accounts</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Everything You'd Expect.<br />
              <span className="text-gradient">And Quite a Bit More.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {whyUs.map((item) => (
              <div key={item} className="bg-white/[0.06] border border-white/10 rounded-xl p-4 flex items-start gap-3 card-hover">
                <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface, 248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── OFFICES ──────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Where We Are</p>
            <h2 className="text-3xl font-black text-dark mb-4">Our Offices</h2>
            <p className="text-text-light max-w-xl mx-auto">Based in Yorkshire and the Home Counties, serving businesses across the whole of the UK.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {COMPANY.offices.map((office) => (
              <div key={office.city} className="bg-white border border-border rounded-2xl p-7 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Building2 size={24} />
                </div>
                <h3 className="font-black text-dark text-xl mb-1">{office.city}</h3>
                <p className="text-text-light text-sm flex items-center gap-2">
                  <MapPin size={14} className="shrink-0" /> {office.address}
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-primary font-semibold text-sm flex items-center gap-2 hover:text-primary/80 transition-colors">
                    <Phone size={14} /> {COMPANY.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-secondary fill-secondary" />)}
          </div>
          <blockquote className="text-xl font-semibold text-dark leading-relaxed italic mb-6">
            "I've been with Clever Accounts for seven years. My accountant knows my business inside out — they've saved me thousands in tax and I never have to worry about deadlines. It's the best business decision I've made."
          </blockquote>
          <div className="text-text-light text-sm">
            <span className="font-bold text-dark">David Thompson</span> — Startup Founder & Limited Company Director
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Join 10,000+<br />Happy Businesses?
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Get started in minutes. Dedicated accountant, free software, all-inclusive pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
