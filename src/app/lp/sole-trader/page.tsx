import type { Metadata } from "next";
import LandingPageLayout from "@/components/ui/LandingPageLayout";
import type { WhyUsItem, PainPointItem, HowItWorksStep, Testimonial, FAQItem } from "@/components/ui/LandingPageLayout";
import { FileText, Calculator, ShieldCheck, MessageSquare, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sole Trader Accountant — From £32.50/mo | Clever Accounts",
  description:
    "Expert sole trader accounting from just £32.50/month. Your own dedicated accountant handles self assessment, tax planning, and HMRC — so you can focus on your business. No setup fees. No contract.",
  robots: { index: true, follow: true },
};

const whyUs: WhyUsItem[] = [
  {
    title: "20+ Years Sole Trader Expertise",
    description:
      "We've helped thousands of sole traders and self-employed professionals with their tax and accounting. We know exactly what HMRC expects — and how to keep more money in your pocket.",
  },
  {
    title: "Your Own Dedicated Accountant",
    description:
      "You get a real person who knows your business, not a chatbot or a call centre. Call or email them anytime — unlimited advice is included in your monthly fee.",
  },
  {
    title: "Average £1,200 Tax Saving",
    description:
      "Our accountants proactively identify expenses you're missing, plan your tax position ahead of deadlines, and make sure you never overpay HMRC.",
  },
  {
    title: "MTD-Ready & Future-Proof",
    description:
      "Making Tax Digital for Income Tax is coming. We include FreeAgent accounting software free of charge and we'll handle the MTD transition for you.",
  },
];

const painPoints: PainPointItem[] = [
  {
    title: "Self Assessment Stress",
    description:
      "Missing the January 31st deadline means an automatic £100 fine from HMRC — and more penalties the longer it's left. We file yours on time, every time.",
  },
  {
    title: "Missing Expense Claims",
    description:
      "Most sole traders underestimate their allowable expenses. Home office costs, mileage, equipment, subscriptions — we make sure you claim everything you're entitled to.",
  },
  {
    title: "HMRC Letters & Investigations",
    description:
      "A letter from HMRC can be daunting. We handle all correspondence on your behalf and act as your registered agent with HMRC.",
  },
];

const howItWorks: HowItWorksStep[] = [
  {
    title: "Sign Up Online",
    description: "Takes 2 minutes. Tell us about your business and we'll match you with a dedicated accountant.",
  },
  {
    title: "We Take Care of Everything",
    description: "Your accountant reviews your finances, sets up FreeAgent, and contacts HMRC on your behalf.",
  },
  {
    title: "Stay in Control",
    description: "Log in to FreeAgent anytime to see your tax position, invoices, and expenses — all in real time.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "I was drowning in receipts and dreading January. Clever Accounts took everything off my plate — I don't even think about tax any more. Best money I spend each month.",
    name: "Sarah T.",
    businessType: "Freelance Graphic Designer",
  },
  {
    quote:
      "My accountant spotted £2,400 of expenses I hadn't been claiming. The service pays for itself many times over.",
    name: "James W.",
    businessType: "Self-Employed Tradesperson",
  },
  {
    quote:
      "Switched from doing my own self assessment and the peace of mind is worth every penny. Really responsive team.",
    name: "Michelle K.",
    businessType: "Virtual Assistant",
  },
];

const faq: FAQItem[] = [
  {
    question: "Do I need an accountant as a sole trader?",
    answer:
      "Legally, no — but it's rarely worth doing it alone. An accountant ensures your self assessment is filed correctly, you claim every allowable expense, and you don't pay a penny more tax than necessary. Most of our clients save more in tax than the service costs.",
  },
  {
    question: "What is self assessment and do you handle it?",
    answer:
      "Self assessment is the HMRC system for reporting income and paying tax if you're self-employed. Yes — we prepare and file your self assessment tax return for you, every year, as part of your monthly fee.",
  },
  {
    question: "What expenses can I claim as a sole trader?",
    answer:
      "Common claims include: home office costs, mileage, equipment and tools, professional subscriptions, phone and internet (business proportion), marketing costs, accountancy fees, and travel. Your dedicated accountant will review your specific situation.",
  },
  {
    question: "What is Making Tax Digital (MTD) and does it affect me?",
    answer:
      "MTD for Income Tax requires self-employed people to submit quarterly digital updates to HMRC. We include FreeAgent software free of charge — it's MTD-compatible and we'll handle the full transition when it applies to you.",
  },
  {
    question: "What's included in the monthly fee?",
    answer:
      "Everything: your dedicated accountant, annual self assessment tax return, unlimited phone and email advice, free FreeAgent software, expense tracking, HMRC registration, and all correspondence with HMRC. No hidden extras.",
  },
];

const statsSection = (
  <section className="bg-dark py-14">
    <div className="max-w-5xl mx-auto px-4">
      <p className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">The numbers speak for themselves</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "£1,200", label: "Average annual tax saving per client", colour: "from-primary to-blue-400" },
          { value: "4,000+", label: "Sole traders and freelancers served", colour: "from-secondary to-emerald-400" },
          { value: "20+", label: "Years specialising in self-employed tax", colour: "from-amber-500 to-yellow-400" },
          { value: "100%", label: "Returns filed before the HMRC deadline", colour: "from-purple-500 to-pink-400" },
        ].map((s) => (
          <div key={s.value} className={`rounded-2xl bg-gradient-to-br ${s.colour} p-px`}>
            <div className="rounded-2xl bg-dark h-full p-5 text-center">
              <div className={`text-4xl font-black bg-gradient-to-br ${s.colour} bg-clip-text text-transparent mb-2`}>{s.value}</div>
              <p className="text-xs text-slate-400 leading-snug">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const servicesGrid = (
  <section className="bg-white py-14 border-t border-border">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-dark mb-3">Everything Off Your Plate</h2>
        <p className="text-text-light max-w-xl mx-auto">Here&apos;s the full picture of what your dedicated accountant handles every month, every quarter, every year.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { Icon: FileText, title: "Self Assessment", items: ["Annual tax return prepared & filed", "Income & expense reconciliation", "Tax calculation & review", "Filed before 31st January"] },
          { Icon: Calculator, title: "Tax Planning", items: ["Year-round tax forecasting", "Expense optimisation", "National Insurance advice", "MTD Income Tax preparation"] },
          { Icon: ShieldCheck, title: "HMRC & Compliance", items: ["Registered agent with HMRC", "All HMRC correspondence handled", "CIS registration if applicable", "VAT registration advice"] },
          { Icon: MessageSquare, title: "Unlimited Support", items: ["Dedicated accountant by name", "Unlimited calls & emails", "FreeAgent software included free", "Expense & mileage tracking"] },
        ].map((cat) => (
          <div key={cat.title} className="bg-white rounded-2xl border border-border shadow-sm card-hover p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <cat.Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-dark">{cat.title}</h3>
            </div>
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-text-light">
                  <CheckCircle2 size={13} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function SoleTraderLP() {
  return (
    <LandingPageLayout
      headline="Sole Trader Accounting From £32.50/month"
      subheadline="Stop worrying about self assessment, expenses, and HMRC. Your own dedicated accountant handles everything — so you can focus on running your business."
      price="32.50"
      targetAudience="For Sole Traders & Self-Employed"
      urgencyText="Join 4,000+ sole traders who switched this year"
      features={[
        "Your own dedicated accountant",
        "Self assessment tax return filed for you",
        "Unlimited phone & email advice",
        "Free FreeAgent accounting software",
        "Expense tracking & mileage claims",
        "MTD for Income Tax compliant",
        "Tax efficiency advice (save £1,000+)",
        "HMRC correspondence handled",
      ]}
      whyUs={whyUs}
      painPoints={painPoints}
      howItWorks={howItWorks}
      testimonials={testimonials}
      faq={faq}
    >
      {statsSection}
      {servicesGrid}
    </LandingPageLayout>
  );
}
