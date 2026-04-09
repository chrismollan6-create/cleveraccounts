"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Calculator,
  PoundSterling,
  TrendingDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Info,
} from "lucide-react";

/* ────────────────────────────────────────
   UK Tax calculations (2025/26 rates)
   ──────────────────────────────────────── */
const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;
const NI_LOWER = 12570;
const NI_UPPER = 50270;

function calcSoleTraderTax(income: number, expenses: number) {
  const profit = Math.max(0, income - expenses);

  // Income tax
  let tax = 0;
  if (profit > HIGHER_RATE_LIMIT) {
    tax += (profit - HIGHER_RATE_LIMIT) * 0.45;
    tax += (HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT) * 0.4;
    tax += (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * 0.2;
  } else if (profit > BASIC_RATE_LIMIT) {
    tax += (profit - BASIC_RATE_LIMIT) * 0.4;
    tax += (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * 0.2;
  } else if (profit > PERSONAL_ALLOWANCE) {
    tax += (profit - PERSONAL_ALLOWANCE) * 0.2;
  }

  // Class 4 NI
  let ni = 0;
  if (profit > NI_UPPER) {
    ni += (profit - NI_UPPER) * 0.02;
    ni += (NI_UPPER - NI_LOWER) * 0.06;
  } else if (profit > NI_LOWER) {
    ni += (profit - NI_LOWER) * 0.06;
  }

  return { profit, tax, ni, total: tax + ni, takeHome: profit - tax - ni };
}

function calcLtdTax(income: number, expenses: number) {
  const profit = Math.max(0, income - expenses);

  // Optimal salary (NI threshold)
  const salary = 12570;
  const corpProfit = Math.max(0, profit - salary);

  // Corporation tax (25% or 19% small profits)
  const corpTaxRate = corpProfit > 250000 ? 0.25 : corpProfit > 50000 ? 0.265 : 0.19;
  const corpTax = corpProfit * corpTaxRate;

  // Dividends from remaining
  const distributable = corpProfit - corpTax;
  const dividendAllowance = 500;
  const taxableDividend = Math.max(0, distributable - dividendAllowance);

  // Dividend tax
  let divTax = 0;
  const remainingBasic = Math.max(0, BASIC_RATE_LIMIT - salary);
  if (taxableDividend > remainingBasic) {
    const higherDividend = taxableDividend - remainingBasic;
    divTax = remainingBasic * 0.0875 + higherDividend * 0.3375;
  } else {
    divTax = taxableDividend * 0.0875;
  }

  const totalTax = corpTax + divTax;
  const takeHome = salary + distributable - divTax;

  return { profit, corpTax, divTax, totalTax, takeHome, salary, dividends: distributable };
}

export default function TaxCalculator() {
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(5000);
  const [businessType, setBusinessType] = useState<"sole-trader" | "limited">("sole-trader");
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = useCallback(() => {
    setShowResults(true);
  }, []);

  const soleTrader = calcSoleTraderTax(income, expenses);
  const ltd = calcLtdTax(income, expenses);

  const savings = soleTrader.total - ltd.totalTax;
  const currentResult = businessType === "sole-trader" ? soleTrader : null;
  const potentialSavings = businessType === "sole-trader" ? savings : 0;

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blob-shape" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 blob-shape-2" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-primary font-bold text-sm uppercase tracking-wider">Free Tool</span>
          <h2 className="text-4xl md:text-5xl font-black text-dark mt-3">
            How Much Could You <span className="text-gradient">Save?</span>
          </h2>
          <p className="text-lg text-text-light mt-4 max-w-2xl mx-auto">
            Enter your details below to see your estimated tax bill — and how much you could save with expert advice.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Input panel */}
            <div className="lg:col-span-2 bg-surface rounded-3xl p-8 border border-border">
              <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-primary" />
                Your Details
              </h3>

              {/* Business type toggle */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark mb-2">I&apos;m a...</label>
                <div className="grid grid-cols-2 gap-2 bg-white rounded-xl p-1 border border-border">
                  <button
                    onClick={() => { setBusinessType("sole-trader"); setShowResults(false); }}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      businessType === "sole-trader"
                        ? "bg-primary text-white shadow-md"
                        : "text-text-light hover:text-dark"
                    }`}
                  >
                    Sole Trader
                  </button>
                  <button
                    onClick={() => { setBusinessType("limited"); setShowResults(false); }}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      businessType === "limited"
                        ? "bg-primary text-white shadow-md"
                        : "text-text-light hover:text-dark"
                    }`}
                  >
                    Limited Company
                  </button>
                </div>
              </div>

              {/* Income slider */}
              <div className="mb-6">
                <label className="flex items-center justify-between text-sm font-semibold text-dark mb-2">
                  Annual Income / Revenue
                  <span className="text-primary font-black text-lg">£{income.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={10000}
                  max={200000}
                  step={1000}
                  value={income}
                  onChange={(e) => { setIncome(Number(e.target.value)); setShowResults(false); }}
                  className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-text-light mt-1">
                  <span>£10k</span>
                  <span>£200k</span>
                </div>
              </div>

              {/* Expenses slider */}
              <div className="mb-8">
                <label className="flex items-center justify-between text-sm font-semibold text-dark mb-2">
                  Annual Business Expenses
                  <span className="text-primary font-black text-lg">£{expenses.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={Math.min(income * 0.5, 50000)}
                  step={500}
                  value={expenses}
                  onChange={(e) => { setExpenses(Number(e.target.value)); setShowResults(false); }}
                  className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-text-light mt-1">
                  <span>£0</span>
                  <span>£{Math.min(income * 0.5, 50000).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 rounded-xl"
              >
                <Sparkles size={20} />
                Calculate My Savings
              </button>
            </div>

            {/* Results panel */}
            <div className="lg:col-span-3">
              {!showResults ? (
                <div className="h-full flex items-center justify-center bg-surface/50 rounded-3xl border border-dashed border-border p-12">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                      <PoundSterling size={32} />
                    </div>
                    <p className="text-xl font-bold text-dark mb-2">Enter your details</p>
                    <p className="text-text-light">Adjust the sliders and click calculate to see your estimated tax breakdown</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Main result card */}
                  <div className="gradient-dark rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blob-shape" />
                    <div className="relative">
                      <p className="text-white/60 text-sm uppercase tracking-wider mb-1">
                        {businessType === "sole-trader" ? "Sole Trader" : "Limited Company"} — Estimated Tax Bill
                      </p>
                      <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-5xl md:text-6xl font-black">
                          £{businessType === "sole-trader"
                            ? Math.round(soleTrader.total).toLocaleString()
                            : Math.round(ltd.totalTax).toLocaleString()
                          }
                        </span>
                        <span className="text-white/50 text-lg">/year</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-xl p-4">
                          <p className="text-white/50 text-xs mb-1">Taxable Profit</p>
                          <p className="text-white font-bold text-lg">
                            £{(businessType === "sole-trader" ? soleTrader.profit : ltd.profit).toLocaleString()}
                          </p>
                        </div>
                        {businessType === "sole-trader" ? (
                          <>
                            <div className="bg-white/10 rounded-xl p-4">
                              <p className="text-white/50 text-xs mb-1">Income Tax</p>
                              <p className="text-white font-bold text-lg">£{Math.round(soleTrader.tax).toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                              <p className="text-white/50 text-xs mb-1">National Insurance</p>
                              <p className="text-white font-bold text-lg">£{Math.round(soleTrader.ni).toLocaleString()}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-white/10 rounded-xl p-4">
                              <p className="text-white/50 text-xs mb-1">Corporation Tax</p>
                              <p className="text-white font-bold text-lg">£{Math.round(ltd.corpTax).toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                              <p className="text-white/50 text-xs mb-1">Dividend Tax</p>
                              <p className="text-white font-bold text-lg">£{Math.round(ltd.divTax).toLocaleString()}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Take home */}
                  <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-light text-sm">Estimated Take-Home Pay</p>
                        <p className="text-3xl font-black text-dark">
                          £{Math.round(businessType === "sole-trader" ? soleTrader.takeHome : ltd.takeHome).toLocaleString()}
                          <span className="text-text-light text-lg font-normal">/year</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-text-light text-sm">Monthly</p>
                        <p className="text-2xl font-bold text-primary">
                          £{Math.round((businessType === "sole-trader" ? soleTrader.takeHome : ltd.takeHome) / 12).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Savings opportunity */}
                  {businessType === "sole-trader" && savings > 0 && (
                    <div className="gradient-cta rounded-2xl p-6 text-white relative overflow-hidden">
                      <div className="absolute inset-0 pattern-dots opacity-10" />
                      <div className="relative flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                          <TrendingDown size={28} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white/80 text-sm">Switch to a Limited Company &amp; you could save up to</p>
                          <p className="text-3xl font-black">£{Math.round(savings).toLocaleString()}/year</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="bg-primary-50 rounded-2xl p-6 border border-primary/20">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-dark text-lg">Want to keep more of what you earn?</p>
                        <p className="text-text-light text-sm">Our accountants find savings most people miss. Get a free, personalised review.</p>
                      </div>
                      <Link
                        href="/sign-up"
                        className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
                      >
                        Get Expert Advice <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <p className="flex items-start gap-2 text-xs text-text-light">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    Estimates based on 2025/26 tax rates. For illustration only — your actual tax position may differ. Speak to one of our accountants for personalised advice.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
