"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Info,
  Calculator,
  Star,
  Briefcase,
  User,
  RefreshCw,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

// ── 2025/26 Tax constants ─────────────────────────────────────
const TAX = {
  personalAllowance: 12570,
  basicRateLimit: 50270,
  higherRateLimit: 125140,
  basicRate: 0.20,
  higherRate: 0.40,
  additionalRate: 0.45,
  // NI Class 4 (sole trader)
  class4Lower: 12570,
  class4Upper: 50270,
  class4Rate: 0.06,
  class4UpperRate: 0.02,
  class2Weekly: 3.45,
  class2Threshold: 12570,
  // NI Class 1 (employee / Ltd salary)
  class1Lower: 12570,
  class1Upper: 50270,
  class1Rate: 0.08,
  class1UpperRate: 0.02,
  // Employer NI
  employerNIThreshold: 9100,
  employerNIRate: 0.138,
  // Corporation tax
  ctSmallProfitRate: 0.19,
  ctSmallProfitLimit: 50000,
  ctMainRate: 0.25,
  ctMarginalRelief: 250000,
  // Dividends
  dividendAllowance: 500,
  dividendBasicRate: 0.0875,
  dividendHigherRate: 0.3375,
  dividendAdditionalRate: 0.3935,
};

function calcIncomeTax(income: number): number {
  if (income <= TAX.personalAllowance) return 0;
  // Taper personal allowance above £100k
  const pa = income > 100000
    ? Math.max(0, TAX.personalAllowance - (income - 100000) / 2)
    : TAX.personalAllowance;
  const taxable = income - pa;
  if (taxable <= 0) return 0;
  const basic = Math.min(taxable, TAX.basicRateLimit - pa) * TAX.basicRate;
  const higher = income > TAX.basicRateLimit
    ? Math.min(taxable - (TAX.basicRateLimit - pa), TAX.higherRateLimit - TAX.basicRateLimit) * TAX.higherRate
    : 0;
  const additional = income > TAX.higherRateLimit
    ? (taxable - (TAX.higherRateLimit - pa)) * TAX.additionalRate
    : 0;
  return Math.max(0, basic + higher + additional);
}

function calcSoleTrader(grossIncome: number, expenses: number) {
  const profit = Math.max(0, grossIncome - expenses);
  // Class 2
  const class2 = profit > TAX.class2Threshold ? TAX.class2Weekly * 52 : 0;
  // Class 4
  const class4Base = Math.max(0, Math.min(profit, TAX.class4Upper) - TAX.class4Lower) * TAX.class4Rate;
  const class4Upper = profit > TAX.class4Upper ? (profit - TAX.class4Upper) * TAX.class4UpperRate : 0;
  const totalNI = class2 + class4Base + class4Upper;
  const incomeTax = calcIncomeTax(profit);
  const totalTax = incomeTax + totalNI;
  const takeHome = profit - totalTax;
  const effectiveRate = profit > 0 ? (totalTax / profit) * 100 : 0;
  return { profit, incomeTax, class2, class4: class4Base + class4Upper, totalNI, totalTax, takeHome, effectiveRate };
}

function calcCorporationTax(profit: number): number {
  if (profit <= 0) return 0;
  if (profit <= TAX.ctSmallProfitLimit) return profit * TAX.ctSmallProfitRate;
  if (profit >= TAX.ctMarginalRelief) return profit * TAX.ctMainRate;
  // Marginal relief
  const fullRate = profit * TAX.ctMainRate;
  const marginalRelief = (TAX.ctMarginalRelief - profit) * ((TAX.ctMainRate - TAX.ctSmallProfitRate) / (TAX.ctMarginalRelief - TAX.ctSmallProfitLimit)) * profit / TAX.ctMarginalRelief * 3;
  return Math.max(0, fullRate - marginalRelief);
}

function calcLtd(grossIncome: number, expenses: number) {
  // Optimal salary: £12,570 (use full personal allowance, employer NI kicks in above £9,100)
  // For simplicity use £12,570 salary — director can claim employment allowance in some cases
  const salary = Math.min(grossIncome, 12570);
  const companyRevenue = grossIncome - expenses;
  // Employer NI on salary above £9,100
  const employerNI = Math.max(0, salary - TAX.employerNIThreshold) * TAX.employerNIRate;
  // Company profit after salary + employer NI
  const companyProfit = Math.max(0, companyRevenue - salary - employerNI);
  const corpTax = calcCorporationTax(companyProfit);
  const postTaxProfit = companyProfit - corpTax;
  // Dividends = all post-tax profit distributed
  const dividends = postTaxProfit;
  // Employee NI on salary
  const employeeNI = Math.max(0, Math.min(salary, TAX.class1Upper) - TAX.class1Lower) * TAX.class1Rate;
  // Income tax on salary (personal allowance covers £12,570 salary = no income tax)
  const salaryIncomeTax = calcIncomeTax(salary);
  // Dividend tax
  const taxableDiv = Math.max(0, dividends - TAX.dividendAllowance);
  // Remaining personal allowance after salary
  const remainingPA = Math.max(0, TAX.personalAllowance - salary);
  const divAbovePA = Math.max(0, taxableDiv - remainingPA);
  let dividendTax = 0;
  const totalIncome = salary + dividends;
  if (divAbovePA > 0) {
    const basicBand = Math.max(0, TAX.basicRateLimit - salary);
    const divInBasic = Math.min(divAbovePA, basicBand);
    const divInHigher = Math.max(0, divAbovePA - basicBand);
    dividendTax = divInBasic * TAX.dividendBasicRate + divInHigher * TAX.dividendHigherRate;
  }
  const personalTax = salaryIncomeTax + employeeNI + dividendTax;
  const totalTaxBurden = employerNI + corpTax + personalTax;
  const takeHome = salary + dividends - personalTax;
  const effectiveRate = companyRevenue > 0 ? (totalTaxBurden / companyRevenue) * 100 : 0;
  return {
    salary, companyRevenue, employerNI, companyProfit, corpTax, postTaxProfit,
    dividends, salaryIncomeTax, employeeNI, dividendTax, personalTax,
    totalTaxBurden, takeHome, effectiveRate, totalIncome,
  };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

const faqs = [
  { q: "How accurate is this calculator?", a: "This calculator uses the 2025/26 UK tax rates and thresholds including income tax bands, National Insurance rates, dividend tax, and corporation tax. It assumes the optimal director salary strategy for limited companies. It's a guide — your actual position may differ based on pension contributions, other income sources, allowances, and specific circumstances." },
  { q: "Why is take-home usually higher through a limited company?", a: "A limited company allows you to pay yourself a combination of salary and dividends. Dividends are taxed at lower rates than income tax and don't attract National Insurance. The company also pays corporation tax (19–25%) on profits before they're distributed, but the combined tax burden is typically lower than sole trader National Insurance + income tax." },
  { q: "What expenses can I deduct?", a: "Allowable expenses reduce your taxable profit. For sole traders and limited companies, these include office costs, travel, equipment, professional fees, software subscriptions, marketing costs, and more. Your dedicated accountant will ensure you claim everything you're entitled to." },
  { q: "What is the optimal salary for a limited company director?", a: "For 2025/26, most directors pay themselves £12,570 — covering the full personal allowance. This means no income tax on the salary, minimal employee NI, and the salary is a deductible expense for the company. The remainder is taken as dividends." },
  { q: "Does this include VAT?", a: "No — this calculator shows income tax, National Insurance, and corporation tax only. VAT is separate and depends on whether you're VAT-registered and which scheme you use." },
  { q: "Should I be a sole trader or limited company?", a: "It depends on your income level, risk appetite, IR35 status (for contractors), and long-term plans. Generally, limited company becomes more tax-efficient above around £30,000 profit, but there's more admin involved. Speak to your dedicated accountant for personalised advice." },
  { q: "Are pension contributions included?", a: "Not in this basic calculator. Pension contributions can significantly reduce your tax bill — both employer contributions (company) and personal contributions. Talk to your accountant about the most tax-efficient pension strategy." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-white">{q}</span>
        {open ? <ChevronUp size={20} className="text-primary-light shrink-0" /> : <ChevronDown size={20} className="text-white/50 shrink-0" />}
      </button>
      {open && <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/10 pt-4">{a}</div>}
    </div>
  );
}

export default function TakeHomeCalculatorPage() {
  const [income, setIncome] = useState(60000);
  const [expenses, setExpenses] = useState(5000);
  const [activeTab, setActiveTab] = useState<"comparison" | "soletrader" | "ltd">("comparison");

  const st = useMemo(() => calcSoleTrader(income, expenses), [income, expenses]);
  const ltd = useMemo(() => calcLtd(income, expenses), [income, expenses]);
  const saving = ltd.takeHome - st.takeHome;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Calculator size={15} className="text-secondary" />
            2025/26 Tax Year
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Take Home Pay<br />
            <span className="text-gradient">Calculator</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            See your estimated take-home pay as a sole trader vs a limited company director. Compare side-by-side using 2025/26 UK tax rates.
          </p>
          <p className="text-white/40 text-sm">Includes income tax, National Insurance, corporation tax & dividend tax</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="rgb(var(--color-surface,248 250 252))" />
          </svg>
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">

          {/* Inputs */}
          <div className="bg-white border border-border rounded-3xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-black text-dark mb-6">Enter Your Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-dark mb-2">
                  Annual Income / Revenue
                  <span className="text-text-light font-normal ml-2">— your total invoiced income</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark font-bold">£</span>
                  <input
                    type="number"
                    min={0}
                    max={500000}
                    step={1000}
                    value={income}
                    onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-3.5 border border-border rounded-xl text-dark font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={200000}
                  step={1000}
                  value={Math.min(income, 200000)}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full mt-3 accent-primary"
                />
                <div className="flex justify-between text-xs text-text-light mt-1">
                  <span>£0</span><span>£100k</span><span>£200k</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-dark mb-2">
                  Annual Business Expenses
                  <span className="text-text-light font-normal ml-2">— allowable deductions</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark font-bold">£</span>
                  <input
                    type="number"
                    min={0}
                    max={income}
                    step={500}
                    value={expenses}
                    onChange={(e) => setExpenses(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-3.5 border border-border rounded-xl text-dark font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.min(income, 50000)}
                  step={500}
                  value={Math.min(expenses, 50000)}
                  onChange={(e) => setExpenses(Number(e.target.value))}
                  className="w-full mt-3 accent-primary"
                />
                <div className="flex justify-between text-xs text-text-light mt-1">
                  <span>£0</span><span>£25k</span><span>£50k+</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-text-light">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>Calculations use 2025/26 rates. Limited company assumes optimal director salary of £12,570 with remaining profit taken as dividends. This is for guidance only — speak to your accountant for personalised advice.</span>
            </div>
          </div>

          {/* Saving banner */}
          {saving > 0 && (
            <div className="bg-gradient-to-r from-secondary/10 to-orange-500/10 border border-secondary/30 rounded-2xl p-5 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="font-black text-dark text-lg">You could take home <span className="text-secondary">{fmt(saving)} more</span> per year as a limited company</div>
                <div className="text-text-light text-sm">Based on the figures entered above using 2025/26 tax rates</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["comparison", "soletrader", "ltd"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? "bg-dark text-white" : "bg-white border border-border text-text-light hover:text-dark"}`}
              >
                {tab === "comparison" ? "Side by Side" : tab === "soletrader" ? "Sole Trader" : "Limited Company"}
              </button>
            ))}
          </div>

          {/* ── Side by side ── */}
          {activeTab === "comparison" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sole Trader */}
              <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center gap-3">
                  <User size={20} className="text-primary" />
                  <div>
                    <div className="font-black text-dark">Sole Trader</div>
                    <div className="text-xs text-text-light">Self-employed</div>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <Row label="Gross Income" value={fmt(income)} />
                  <Row label="Expenses" value={`− ${fmt(expenses)}`} dim />
                  <Row label="Taxable Profit" value={fmt(st.profit)} border />
                  <Row label="Income Tax" value={`− ${fmt(st.incomeTax)}`} red />
                  <Row label="Class 2 NI" value={`− ${fmt(st.class2)}`} red />
                  <Row label="Class 4 NI" value={`− ${fmt(st.class4)}`} red />
                  <Row label="Total Tax & NI" value={`− ${fmt(st.totalTax)}`} red border />
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-dark text-lg">Take Home</span>
                      <span className="font-black text-primary text-2xl">{fmt(st.takeHome)}</span>
                    </div>
                    <div className="text-xs text-text-light mt-1">Effective tax rate: {pct(st.effectiveRate)}</div>
                  </div>
                </div>
              </div>

              {/* Ltd */}
              <div className="bg-dark rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-white/10 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                  <Briefcase size={20} className="text-secondary" />
                  <div>
                    <div className="font-black text-white">Limited Company</div>
                    <div className="text-xs text-white/50">Optimal salary + dividends</div>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <DarkRow label="Company Revenue" value={fmt(ltd.companyRevenue)} />
                  <DarkRow label="Director Salary" value={`− ${fmt(ltd.salary)}`} dim />
                  <DarkRow label="Employer NI" value={`− ${fmt(ltd.employerNI)}`} dim />
                  <DarkRow label="Company Profit" value={fmt(ltd.companyProfit)} border />
                  <DarkRow label="Corporation Tax" value={`− ${fmt(ltd.corpTax)}`} red />
                  <DarkRow label="Dividends Available" value={fmt(ltd.dividends)} border />
                  <DarkRow label="Dividend Tax" value={`− ${fmt(ltd.dividendTax)}`} red />
                  <DarkRow label="Employee NI" value={`− ${fmt(ltd.employeeNI)}`} red />
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-white text-lg">Take Home</span>
                      <span className="font-black text-secondary text-2xl">{fmt(ltd.takeHome)}</span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">Effective tax rate: {pct(ltd.effectiveRate)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Sole trader detail ── */}
          {activeTab === "soletrader" && (
            <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <User size={24} className="text-primary" />
                <h3 className="font-black text-dark text-xl">Sole Trader Breakdown</h3>
              </div>
              <div className="space-y-3 max-w-md">
                <Row label="Gross Income" value={fmt(income)} />
                <Row label="Allowable Expenses" value={`− ${fmt(expenses)}`} dim />
                <Row label="Taxable Profit" value={fmt(st.profit)} border />
                <Row label="Personal Allowance" value={`− ${fmt(Math.min(st.profit, TAX.personalAllowance))}`} dim />
                <Row label="Income Tax" value={`− ${fmt(st.incomeTax)}`} red />
                <Row label="Class 2 NI (£3.45/wk)" value={`− ${fmt(st.class2)}`} red />
                <Row label="Class 4 NI" value={`− ${fmt(st.class4)}`} red />
                <Row label="Total Deductions" value={`− ${fmt(st.totalTax)}`} red border />
                <div className="bg-primary/5 rounded-xl p-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-black text-dark text-lg">Annual Take Home</span>
                    <span className="font-black text-primary text-2xl">{fmt(st.takeHome)}</span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-text-light">
                    <span>Monthly take home</span>
                    <span className="font-semibold text-dark">{fmt(st.takeHome / 12)}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-text-light">
                    <span>Effective tax rate</span>
                    <span className="font-semibold text-dark">{pct(st.effectiveRate)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Ltd detail ── */}
          {activeTab === "ltd" && (
            <div className="bg-dark rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={24} className="text-secondary" />
                <h3 className="font-black text-white text-xl">Limited Company Breakdown</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Company Level</p>
                  <DarkRow label="Company Revenue" value={fmt(ltd.companyRevenue)} />
                  <DarkRow label="Director Salary" value={`− ${fmt(ltd.salary)}`} dim />
                  <DarkRow label="Employer NI" value={`− ${fmt(ltd.employerNI)}`} dim />
                  <DarkRow label="Taxable Company Profit" value={fmt(ltd.companyProfit)} border />
                  <DarkRow label="Corporation Tax" value={`− ${fmt(ltd.corpTax)}`} red />
                  <DarkRow label="Available for Dividends" value={fmt(ltd.dividends)} border />
                </div>
                <div className="space-y-3">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Personal Level</p>
                  <DarkRow label="Director Salary" value={fmt(ltd.salary)} />
                  <DarkRow label="Income Tax on Salary" value={`− ${fmt(ltd.salaryIncomeTax)}`} red />
                  <DarkRow label="Employee NI" value={`− ${fmt(ltd.employeeNI)}`} red />
                  <DarkRow label="Dividends Received" value={fmt(ltd.dividends)} border />
                  <DarkRow label="Dividend Tax" value={`− ${fmt(ltd.dividendTax)}`} red />
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-white text-lg">Take Home</span>
                      <span className="font-black text-secondary text-2xl">{fmt(ltd.takeHome)}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-white/50">
                      <span>Monthly take home</span>
                      <span className="text-white/70 font-semibold">{fmt(ltd.takeHome / 12)}</span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-white/50">
                      <span>Total tax burden</span>
                      <span className="text-white/70 font-semibold">{fmt(ltd.totalTaxBurden)} ({pct(ltd.effectiveRate)})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA below calculator */}
          <div className="mt-8 bg-white border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-5">
            <div className="flex-1">
              <div className="font-black text-dark mb-1">Want a personalised tax plan?</div>
              <p className="text-text-light text-sm">Your dedicated Clever Accounts accountant will review your actual figures, factor in expenses, pension contributions, and help you structure your income for maximum take-home.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all whitespace-nowrap">
                Get Started <ArrowRight size={18} />
              </Link>
              <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-dark font-semibold px-6 py-3 rounded-xl hover:bg-surface/80 transition-all whitespace-nowrap">
                <Phone size={18} /> {COMPANY.freephone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT AFFECTS TAKE HOME ───────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Tax Planning</p>
            <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">What Can Improve Your Take-Home</h2>
            <p className="text-text-light max-w-xl mx-auto">The calculator gives you a baseline — a good accountant can improve on it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingDown, title: "Claim All Allowable Expenses", desc: "Most businesses underclaim on expenses. Equipment, software, travel, home office, professional development, phone — your accountant ensures you claim everything legitimately." },
              { icon: RefreshCw, title: "Optimal Salary/Dividend Split", desc: "For limited company directors, the split between salary and dividends significantly affects your tax. We model the optimal structure for your specific income level." },
              { icon: Star, title: "Pension Contributions", desc: "Employer pension contributions are a tax-free company expense. Contributing through the company reduces corporation tax and doesn't attract NI — potentially saving thousands." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{desc}</p>
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
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Stop leaving money on the table.
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            A dedicated Clever Accounts accountant will build a personalised tax plan around your actual income, expenses, and goals. From £42.50/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-xl">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/30">
              <Phone size={20} /> {COMPANY.freephone}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            {["No setup fee", "Dedicated accountant", "Free FreeAgent software", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-white/60" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-3">FAQ</p>
            <h2 className="text-3xl font-black text-white mb-4">Calculator Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-dark mb-4">Ready to maximise your take-home?</h2>
          <p className="text-text-light mb-8 max-w-xl mx-auto">Join 10,000+ UK businesses with a dedicated accountant handling their tax.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-primary/90 transition-all shadow-lg">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-white text-dark font-semibold px-8 py-4 rounded-xl text-lg border border-border shadow-sm hover:bg-surface transition-all">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Helper row components ─────────────────────────────────────
function Row({ label, value, dim, red, border }: { label: string; value: string; dim?: boolean; red?: boolean; border?: boolean }) {
  return (
    <div className={`flex justify-between items-center text-sm py-1 ${border ? "border-t border-border pt-3 mt-1" : ""}`}>
      <span className={dim ? "text-text-light" : "text-text"}>{label}</span>
      <span className={`font-semibold ${red ? "text-red-500" : dim ? "text-text-light" : "text-dark"}`}>{value}</span>
    </div>
  );
}

function DarkRow({ label, value, dim, red, border }: { label: string; value: string; dim?: boolean; red?: boolean; border?: boolean }) {
  return (
    <div className={`flex justify-between items-center text-sm py-1 ${border ? "border-t border-white/10 pt-3 mt-1" : ""}`}>
      <span className={dim ? "text-white/40" : "text-white/70"}>{label}</span>
      <span className={`font-semibold ${red ? "text-red-400" : dim ? "text-white/40" : "text-white"}`}>{value}</span>
    </div>
  );
}
