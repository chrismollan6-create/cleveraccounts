import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  X,
  UserCheck,
  MessageCircle,
  Zap,
  BarChart2,
  FileText,
  Building2,
  BadgeCheck,
  ShieldCheck,
  Shield,
  Smartphone,
  Receipt,
  TrendingUp,
  Users,
  Phone,
  Sparkles,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { getBrand } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: `Compare ${brand.name} vs Local Accountants vs DIY Software | ${brand.name}`,
    description:
      brand.id === "workwell"
        ? `See how ${brand.name} measures up against a traditional local accountant and DIY accounting software — on service, software, pricing and compliance. Find out why 10,000+ UK businesses picked us.`
        : `How ${brand.name} compares to a traditional local accountant and DIY accounting software — across service, software, pricing, and compliance. See why 10,000+ UK businesses chose us.`,
  };
}

type CellValue = boolean | string;

interface Row {
  feature: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  clever: CellValue;
  local: CellValue;
  diy: CellValue;
}

const featureRows: Row[] = [
  { feature: "Dedicated named accountant",       icon: UserCheck,    clever: true, local: true,         diy: false },
  { feature: "Unlimited advice included",        icon: MessageCircle, clever: true, local: false,        diy: false },
  { feature: "FreeAgent included free",          icon: Zap,          clever: true, local: false,        diy: false },
  { feature: "Real-time financial dashboard",    icon: BarChart2,    clever: true, local: false,        diy: true },
  { feature: "All tax returns & filings",        icon: FileText,     clever: true, local: true,         diy: false },
  { feature: "Open banking (25+ UK banks)",      icon: Building2,    clever: true, local: false,        diy: true },
  { feature: "No setup fees",                    icon: BadgeCheck,   clever: true, local: false,        diy: true },
  { feature: "No minimum contract",              icon: ShieldCheck,  clever: true, local: false,        diy: true },
  { feature: "IR35 support & contract reviews",  icon: Shield,       clever: true, local: false,        diy: false },
  { feature: "Mobile app access",                icon: Smartphone,   clever: true, local: false,        diy: true },
  { feature: "Invoice creation & tracking",      icon: Receipt,      clever: true, local: false,        diy: true },
  { feature: "MTD compliant",                    icon: CheckCircle2, clever: true, local: true,         diy: false },
  { feature: "Proactive tax planning",           icon: TrendingUp,   clever: true, local: "Varies",     diy: false },
  { feature: "Payroll included",                 icon: Users,        clever: true, local: "Extra cost", diy: false },
];

const pricing = {
  clever: "From £42.50/mo",
  local: "£100–£300+/mo",
  diy: "£15–£50/mo (software only)",
};

// Differentiator content shown under the table — turns checkmarks into a story
const differentiators = [
  {
    title: "A named accountant — not a portal",
    icon: UserCheck,
    desc: "When you call us, you reach your dedicated accountant who already knows your business — not a generic call centre or a chatbot triaging a ticket queue. Local high-street firms offer this too, but typically at 2–3× the cost. DIY software doesn't offer it at all.",
  },
  {
    title: "Unlimited advice — not pay-per-call",
    icon: MessageCircle,
    desc: "Ring as often as you need. Email a question at 11am, get a reply by lunch. There's no meter ticking, no surprise invoice for a quick chat. Traditional firms often bill by the hour and DIY software has no advice channel at all.",
  },
  {
    title: "FreeAgent included free — £19/mo saved",
    icon: Zap,
    desc: "FreeAgent retail is £19/month. We bundle it. You get HMRC-recognised MTD-compliant software with full bank feeds, invoicing, expenses, and your accountant working in the same system — no separate logins, no monthly software bill.",
  },
  {
    title: "One flat fee — no surprises",
    icon: BadgeCheck,
    desc: "What you pay is what's on the pricing page. Tax returns, payroll, VAT, IR35 reviews, mortgage reference letters — all included. No setup fees, no per-call charges, no &ldquo;you-went-over-your-allowance&rdquo; invoices in February.",
  },
];

// Workwell-voiced version of the same four differentiators. Reworded prose only —
// every factual claim (£19/mo FreeAgent, 2–3× local cost, what's included) matches.
const differentiatorsWorkwell = [
  {
    title: "Your own accountant — not a portal",
    icon: UserCheck,
    desc: "Call us and you'll speak to your dedicated accountant, who already understands your business — not a faceless call centre or a bot working through a ticket queue. High-street firms can offer the same, but usually at 2–3× the price, and DIY software doesn't offer it at all.",
  },
  {
    title: "Advice without limits — not pay-per-call",
    icon: MessageCircle,
    desc: "Phone whenever you need to. Send a question mid-morning and have an answer by lunchtime. Nothing's metered and no surprise bill lands for a quick chat. Traditional firms tend to charge by the hour, and DIY software gives you no one to ask.",
  },
  {
    title: "FreeAgent free — that's £19/mo you keep",
    icon: Zap,
    desc: "FreeAgent retails at £19/month and we include it. You get HMRC-recognised, MTD-compliant software with full bank feeds, invoicing and expenses, and your accountant working in the very same system — no separate logins and no monthly software bill.",
  },
  {
    title: "A single flat fee — nothing hidden",
    icon: BadgeCheck,
    desc: "You pay what the pricing page says, full stop. Tax returns, payroll, VAT, IR35 reviews and mortgage reference letters are all part of it. No setup fees, no charge per call, and no &ldquo;you-went-over-your-allowance&rdquo; invoice arriving in February.",
  },
];

function Cell({ value, highlight = false }: { value: CellValue; highlight?: boolean }) {
  if (value === true)
    return <CheckCircle2 size={22} className={`mx-auto ${highlight ? "text-primary" : "text-success"}`} />;
  if (value === false) return <X size={22} className="text-red-400 mx-auto" />;
  return <span className="text-sm font-semibold text-text">{value}</span>;
}

export default async function ComparePage() {
  const brand = await getBrand();
  const isWorkwell = brand.id === "workwell";
  const diffs = isWorkwell ? differentiatorsWorkwell : differentiators;
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Sparkles size={15} />
            {isWorkwell
              ? `Why 10,000+ UK businesses picked ${brand.name}`
              : `Why 10,000+ UK businesses chose ${brand.name}`}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            {isWorkwell ? (
              <>
                Weigh it up. <span className="text-gradient">Choose well.</span>
              </>
            ) : (
              <>
                Compare. <span className="text-gradient">Don&apos;t settle.</span>
              </>
            )}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            {isWorkwell
              ? "See how we measure up to the traditional high-street accountant and DIY accounting software — on the things that genuinely count when you're running a UK business."
              : "How we stack up against the traditional local accountant and DIY accounting software — across the things that actually matter when you're running a UK business."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg"
            >
              Get Started — From £42.50/mo <ArrowRight size={20} />
            </Link>
            <a
              href="#comparison"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
            >
              {isWorkwell ? "View the comparison" : "See the comparison"}
            </a>
          </div>
        </div>

        {/* Wave divider — dark to white */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 md:h-16 block"
          >
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────── */}
      <section id="comparison" className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              {isWorkwell ? "Compared Directly" : "Side-by-Side"}
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              {isWorkwell
                ? "Three approaches to your accounting — only one brings it all together"
                : "Three ways to handle your accounting — only one keeps everything in one place"}
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              {isWorkwell
                ? "Engage a high-street firm, keep your own books in DIY software, or come to us. Here's how each one shapes up."
                : "You can hire a local high-street firm, you can run your own books in DIY software, or you can use us. Here's what each looks like."}
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl overflow-hidden border border-border shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-surface">
                  <th className="text-left px-6 py-5 text-sm font-bold text-text-light w-[34%]">Feature</th>
                  <th className="px-4 py-5 w-[22%]">
                    <div className="bg-primary text-white rounded-xl py-3 px-3 shadow-sm relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                        Recommended
                      </div>
                      <div className="font-black text-base mt-1">{brand.name}</div>
                      <div className="text-white/80 text-xs mt-0.5">From £42.50/mo</div>
                    </div>
                  </th>
                  <th className="px-4 py-5 w-[22%]">
                    <div className="bg-white border border-border rounded-xl py-3 px-3">
                      <div className="font-bold text-dark text-base">Local Accountant</div>
                      <div className="text-text-light text-xs mt-0.5">£100–£300+/mo</div>
                    </div>
                  </th>
                  <th className="px-4 py-5 w-[22%]">
                    <div className="bg-white border border-border rounded-xl py-3 px-3">
                      <div className="font-bold text-dark text-base">DIY Software</div>
                      <div className="text-text-light text-xs mt-0.5">£15–£50/mo (software only)</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {featureRows.map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-surface/40" : "bg-white"}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Icon size={16} />
                          </div>
                          <span className="text-sm font-semibold text-dark">{row.feature}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center bg-primary/[0.04]"><Cell value={row.clever} highlight /></td>
                      <td className="px-4 py-4 text-center"><Cell value={row.local} /></td>
                      <td className="px-4 py-4 text-center"><Cell value={row.diy} /></td>
                    </tr>
                  );
                })}
                {/* Pricing row — special treatment */}
                <tr className="bg-dark">
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold uppercase tracking-wider text-white/70">Average monthly cost</span>
                  </td>
                  <td className="px-4 py-5 text-center bg-primary">
                    <div className="text-white font-black text-lg">{pricing.clever}</div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="text-white font-bold text-sm">{pricing.local}</div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="text-white font-bold text-sm">{pricing.diy}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-4">
            {/* Our highlighted card */}
            <div className="bg-primary text-white rounded-2xl p-6 shadow-lg relative">
              <div className="absolute -top-3 left-6 bg-secondary text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                Recommended
              </div>
              <h3 className="font-black text-xl mb-1 mt-1">{brand.name}</h3>
              <p className="text-white/80 text-sm mb-5">
                {isWorkwell ? "From £42.50/month — all of it included" : "From £42.50/month — everything in"}
              </p>
              <ul className="space-y-2.5">
                {featureRows.map((row) => (
                  <li key={row.feature} className="flex items-center gap-2 text-sm">
                    {row.clever === true ? (
                      <CheckCircle2 size={16} className="text-white shrink-0" />
                    ) : row.clever === false ? (
                      <X size={16} className="text-white/40 shrink-0" />
                    ) : (
                      <span className="font-semibold text-white shrink-0">{row.clever}</span>
                    )}
                    <span className="text-white/90">{row.feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Local Accountant card */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-black text-xl text-dark mb-1">Local Accountant</h3>
              <p className="text-text-light text-sm mb-5">
                {isWorkwell ? "£100–£300+ /month, with extras on top" : "£100–£300+ /month, plus extras"}
              </p>
              <ul className="space-y-2.5">
                {featureRows.map((row) => (
                  <li key={row.feature} className="flex items-center gap-2 text-sm">
                    {row.local === true ? (
                      <CheckCircle2 size={16} className="text-success shrink-0" />
                    ) : row.local === false ? (
                      <X size={16} className="text-red-400 shrink-0" />
                    ) : (
                      <span className="font-semibold text-dark text-xs shrink-0">{row.local}</span>
                    )}
                    <span className="text-text">{row.feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DIY Software card */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-black text-xl text-dark mb-1">DIY Software</h3>
              <p className="text-text-light text-sm mb-5">
                {isWorkwell ? "£15–£50 /month — just the software, no accountant" : "£15–£50 /month — software only, no accountant"}
              </p>
              <ul className="space-y-2.5">
                {featureRows.map((row) => (
                  <li key={row.feature} className="flex items-center gap-2 text-sm">
                    {row.diy === true ? (
                      <CheckCircle2 size={16} className="text-success shrink-0" />
                    ) : row.diy === false ? (
                      <X size={16} className="text-red-400 shrink-0" />
                    ) : (
                      <span className="font-semibold text-dark text-xs shrink-0">{row.diy}</span>
                    )}
                    <span className="text-text">{row.feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-text-light text-xs mt-6 max-w-2xl mx-auto">
            {isWorkwell
              ? "This comparison is based on typical offerings across the UK market. Individual local accountants and software products will differ."
              : "Comparison reflects typical offerings in the UK market. Individual local accountants and software products vary."}
          </p>
        </div>
      </section>

      {/* ── WHY IT MATTERS ───────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              {isWorkwell ? "Why It Counts" : "Why It Matters"}
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
              {isWorkwell
                ? "A tick in a column is one thing — what it actually means day to day is another"
                : "A check in a column is one thing — what it means in practice is another"}
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              {isWorkwell
                ? `The gaps between the three options are real, not marginal. Here's what each row genuinely gives you with ${brand.name}.`
                : `The differences between the three options aren't small. Here's what each row actually buys you with ${brand.name}.`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {diffs.map(({ title, icon: Icon, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-dark mb-2">{title}</h3>
                    <p className="text-text-light text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-orange-600 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">
            {isWorkwell ? "The Sensible Choice" : "The Smart Choice"}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-5">
            {isWorkwell
              ? "All in one place. One flat fee. Nothing hidden."
              : "Everything in one place. One flat fee. No surprises."}
          </h2>
          <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {isWorkwell
              ? `Join the 10,000+ UK businesses who picked ${brand.name}. A dedicated accountant, FreeAgent included, no setup fees and no minimum contract — from £42.50/month.`
              : `Join 10,000+ UK businesses who chose ${brand.name}. Dedicated accountant, FreeAgent included, no setup fees, no minimum contract — from £42.50/month.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all shadow-lg"
            >
              Get Started Today <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/30"
            >
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
