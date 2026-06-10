import Link from "next/link";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  Star,
  BadgeCheck,
  Users,
  Briefcase,
  Building2,
  ShieldCheck,
  Tag,
  Sparkles,
  HeartHandshake,
  Wallet,
  Cpu,
  MessagesSquare,
  Repeat,
  FileText,
} from "lucide-react";
import { type Promo, promoBadgeForPlanId } from "@/lib/promo";
import PricingFAQ from "@/components/ui/PricingFAQ";

type Plan = {
  _id: string;
  name: string;
  subtitle?: string;
  price: string;
  popular?: boolean;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
};

type Faq = { _id: string; question: string; answer: string };

interface WorkwellPricingProps {
  plans: Plan[];
  faqs: Faq[];
  promo: Promo;
  freephone: string;
  rating: string;
}

/** Per-card accent — mirrors WorkwellHome segment cards (lime / cyan / teal). */
const CARD_ACCENT = [
  {
    bar: "from-[#9cbf50] to-[#bdd289]",
    chip: "bg-[#9cbf50]/20 text-[#6f8052]",
    hover: "hover:border-[#9cbf50]",
    cta: "bg-[#6f8052] text-white hover:bg-[#5d7038]",
    check: "text-[#6f8052]",
  },
  {
    bar: "from-[#9cbf50] via-[#71c5d6] to-[#32535a]", // popular — full palette
    chip: "bg-white/15 text-white",
    hover: "",
    cta: "bg-white text-[#2c4a51] hover:bg-[#eef4e2]",
    check: "text-[#bdd289]",
  },
  {
    bar: "from-[#32535a] to-[#4d7079]",
    chip: "bg-[#32535a]/12 text-[#2c4a51]",
    hover: "hover:border-[#32535a]",
    cta: "bg-[#32535a] text-white hover:bg-[#2c4a51]",
    check: "text-[#2c6470]",
  },
];

/** Universal features — what every plan gets. Brand-neutral wording. */
const UNIVERSAL_FEATURES: { icon: typeof Users; label: string }[] = [
  { icon: Users, label: "Dedicated accountant" },
  { icon: MessagesSquare, label: "Unlimited advice" },
  { icon: Cpu, label: "Free accounting software" },
  { icon: BadgeCheck, label: "No setup fee" },
  { icon: ShieldCheck, label: "No minimum contract" },
  { icon: Wallet, label: "Tax efficiency advice" },
  { icon: FileText, label: "All HMRC filings" },
  { icon: Repeat, label: "Free switching service" },
];

function planIcon(name: string) {
  if (/sole/i.test(name)) return <Users size={22} />;
  if (/contractor/i.test(name)) return <Briefcase size={22} />;
  return <Building2 size={22} />;
}

export default function WorkwellPricing({
  plans,
  faqs,
  promo,
  freephone,
  rating,
}: WorkwellPricingProps) {
  const telHref = `tel:${freephone.replace(/\s/g, "")}`;

  return (
    <>
      {/* ── HERO — light, lime accent, B2C tone ──────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f7faf0] via-white to-white pt-20 md:pt-28 pb-16 md:pb-20">
        <div className="absolute -top-24 right-0 w-[420px] h-[420px] bg-[#9cbf50]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 -left-20 w-[360px] h-[360px] bg-[#71c5d6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white border border-[#e4ecd6] text-[#6f8052] rounded-full px-4 py-2 text-sm font-bold shadow-sm mb-6">
            <Sparkles size={15} /> No setup fee · No tie-ins · Cancel anytime
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#2c4a51] leading-tight tracking-tight mb-5">
            Simple, honest{" "}
            <span className="bg-gradient-to-r from-[#9cbf50] via-[#71c5d6] to-[#32535a] bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#5a6f74] max-w-2xl mx-auto mb-7">
            One fixed monthly fee. Everything included. No surprise invoices, no hourly billing, no hidden extras.
          </p>
          <div className="inline-flex items-center gap-2 text-[#5a6f74]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="font-bold text-[#2c4a51] ml-1">{rating}</span>
            <span className="text-sm">· loved by self-employed people across the UK</span>
          </div>
        </div>
      </section>

      {/* ── PRICING CARDS ────────────────────────────────────────────── */}
      <section className="bg-white pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
            {plans.map((plan, i) => {
              const a = CARD_ACCENT[i % CARD_ACCENT.length];
              const isPopular = !!plan.popular;
              const promoBadge = promoBadgeForPlanId(plan._id, promo);

              return (
                <div
                  key={plan._id}
                  className={`relative rounded-3xl overflow-hidden flex flex-col ${
                    isPopular
                      ? "bg-gradient-to-br from-[#243b40] via-[#2c4a51] to-[#32535a] shadow-2xl shadow-[#2c4a51]/20 md:-mt-4 md:mb-0"
                      : `bg-white border border-[#e4ecd6] ${a.hover} shadow-[0_10px_30px_-12px_rgba(44,74,81,0.18)] hover:shadow-[0_16px_40px_-12px_rgba(44,74,81,0.28)] hover:-translate-y-1 transition-all`
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9cbf50] to-[#bdd289] text-[#2c4a51] text-xs font-extrabold uppercase tracking-wider px-5 py-1.5 rounded-b-xl shadow-lg whitespace-nowrap">
                      Most popular
                    </div>
                  )}

                  <div className={`h-1.5 w-full bg-gradient-to-r ${a.bar}`} />

                  <div className="p-8 flex flex-col flex-1">
                    <span className={`w-12 h-12 rounded-2xl ${a.chip} flex items-center justify-center mb-5`}>
                      {planIcon(plan.name)}
                    </span>
                    <h3 className={`text-xl font-extrabold mb-1 ${isPopular ? "text-white" : "text-[#2c4a51]"}`}>
                      {plan.name}
                    </h3>
                    {plan.subtitle && (
                      <p className={`text-sm mb-6 ${isPopular ? "text-white/65" : "text-[#5a6f74]"}`}>
                        {plan.subtitle}
                      </p>
                    )}

                    <div className="mb-1">
                      <span className={`text-5xl font-extrabold ${isPopular ? "text-white" : "text-[#2c4a51]"}`}>
                        £{plan.price}
                      </span>
                      <span className={`text-base ml-1 ${isPopular ? "text-white/55" : "text-[#6a7b80]"}`}>
                        /mo + VAT
                      </span>
                    </div>
                    <p className={`text-xs mb-6 ${isPopular ? "text-white/45" : "text-[#7a8a8e]"}`}>
                      All-inclusive · no extras
                    </p>

                    {promoBadge && (
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold mb-6 ${
                          isPopular
                            ? "bg-white/15 border border-white/25 text-[#eaf3d0]"
                            : "bg-[#9cbf50]/15 border border-[#9cbf50]/30 text-[#5d7038]"
                        }`}
                      >
                        <Tag size={12} className="shrink-0" />
                        {promoBadge}
                        {promo?.endDate && (
                          <span className="font-normal opacity-75">
                            · ends{" "}
                            {new Date(promo.endDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                      </div>
                    )}

                    <Link
                      href={plan.ctaLink || "/sign-up"}
                      className={`block w-full text-center font-bold py-3.5 rounded-xl transition-all mb-7 ${a.cta} shadow-lg ${
                        isPopular ? "shadow-black/20" : "shadow-[#2c4a51]/15"
                      }`}
                    >
                      {plan.ctaText || "Get Started"}
                    </Link>

                    <ul className="space-y-3">
                      {(plan.features || []).map((feature) => (
                        <li
                          key={feature}
                          className={`flex items-start gap-2.5 text-sm ${
                            isPopular ? "text-white/85" : "text-[#3f565b]"
                          }`}
                        >
                          <CheckCircle2 size={17} className={`shrink-0 mt-0.5 ${a.check}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-12 text-sm text-[#5a6f74]">
            {["No setup fees", "No minimum contract", "Cancel anytime", "Free accounting software", "Dedicated accountant"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={16} className="text-[#6f8052]" /> {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED AS STANDARD ──────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-white to-[#f5f9ec] py-20 md:py-24 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-80 h-80 bg-[#9cbf50]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-[#6f8052] font-bold text-sm uppercase tracking-wider">
              <HeartHandshake size={16} /> Every plan
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2c4a51] mt-3">
              What&apos;s included as standard
            </h2>
            <p className="text-[#5a6f74] mt-4 text-lg">
              Whichever plan you pick, these are non-negotiables — included in your fixed monthly fee.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {UNIVERSAL_FEATURES.map(({ icon: Icon, label }, i) => {
              const tints = [
                "bg-[#9cbf50]/20 text-[#6f8052]",
                "bg-[#71c5d6]/25 text-[#2c6470]",
                "bg-[#32535a]/12 text-[#2c4a51]",
              ];
              const t = tints[i % tints.length];
              return (
                <div
                  key={label}
                  className="bg-white rounded-2xl p-5 text-center border border-[#e4ecd6] shadow-[0_10px_30px_-12px_rgba(44,74,81,0.15)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(44,74,81,0.25)] transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl ${t} flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={22} />
                  </div>
                  <p className="font-bold text-[#2c4a51] text-sm">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BESPOKE CTA — dark teal band, flows into FAQ below ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1a2426] to-[#243b40] py-20 md:py-24">
        <div className="absolute -top-20 right-0 w-96 h-96 bg-[#9cbf50]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 bg-[#71c5d6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-[#9cbf50] font-bold text-sm uppercase tracking-wider">Complex needs?</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-5">
            Need a bespoke package?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-9">
            Larger payrolls, multiple directors, international operations or group structures? We put together
            custom packages for businesses with more involved requirements — no obligation, just a chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl shadow-lg shadow-[#9cbf50]/25"
            >
              Get a custom quote <ArrowRight size={20} />
            </Link>
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/25 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
            >
              <Phone size={20} /> {freephone}
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ — vertical gradient starts at #243b40 so it joins the
          bespoke band above with no seam ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#243b40] via-[#2c4a51] to-[#32535a] py-20 md:py-24">
        <div className="absolute -top-20 -right-16 w-80 h-80 bg-[#71c5d6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-[#9cbf50]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#9cbf50] font-bold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
              Pricing questions, answered
            </h2>
          </div>
          <PricingFAQ faqs={faqs} />
        </div>
      </section>

      {/* ── BOTTOM CTA — warm close (matches WorkwellHome) ───────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-[#243b40] via-[#2c4a51] to-[#32535a] rounded-[2rem] p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#9cbf50]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-16 w-72 h-72 bg-[#71c5d6]/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                Ready to get started?
              </h2>
              <p className="text-white/75 text-lg mb-9 max-w-2xl mx-auto">
                Dedicated accountant, unlimited advice and free software — all for one simple monthly fee. Set up in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-4 rounded-xl shadow-lg shadow-[#9cbf50]/25"
                >
                  Get started today <ArrowRight size={20} />
                </Link>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/25 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
                >
                  <Phone size={20} /> {freephone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
