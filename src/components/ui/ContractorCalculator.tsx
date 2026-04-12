"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Sparkles, Info, TrendingDown, PoundSterling, Shield, Zap } from "lucide-react";

/* ────────────────────────────────────────
   UK Tax / NI constants (2025/26)
   ──────────────────────────────────────── */
const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;
const NI_PRIMARY_THRESHOLD = 12570;
const NI_UPPER = 50270;
const NI_SECONDARY_THRESHOLD = 9100; // Employer NI threshold
const EMPLOYER_NI_RATE = 0.138;
const UMBRELLA_FEE = 1300; // ~£25/week
const WORKING_DAYS = 220;

/* ────────────────────────────────────────
   Outside IR35 — PSC (Ltd company)
   ──────────────────────────────────────── */
function calcOutsideIR35(dayRate: number, expenses: number) {
  const contractValue = dayRate * WORKING_DAYS;
  const profit = Math.max(0, contractValue - expenses);
  const salary = 12570;
  const corpProfit = Math.max(0, profit - salary);
  const corpTaxRate = corpProfit > 250000 ? 0.25 : corpProfit > 50000 ? 0.265 : 0.19;
  const corpTax = corpProfit * corpTaxRate;
  const distributable = corpProfit - corpTax;
  const dividendAllowance = 500;
  const taxableDividend = Math.max(0, distributable - dividendAllowance);
  const remainingBasic = Math.max(0, BASIC_RATE_LIMIT - salary);
  let divTax = 0;
  if (taxableDividend > remainingBasic) {
    divTax = remainingBasic * 0.0875 + (taxableDividend - remainingBasic) * 0.3375;
  } else {
    divTax = taxableDividend * 0.0875;
  }
  const totalTax = corpTax + divTax;
  const takeHome = salary + distributable - divTax;
  const effectiveRate = contractValue > 0 ? (totalTax / contractValue) * 100 : 0;
  return { contractValue, profit, salary, corpTax, divTax, totalTax, takeHome, effectiveRate, dividends: distributable };
}

/* ────────────────────────────────────────
   Inside IR35 — Umbrella
   ──────────────────────────────────────── */
function calcInsideIR35(dayRate: number) {
  const contractValue = dayRate * WORKING_DAYS;
  // Employer NI deducted from contract value first
  const beforeEmployerNI = contractValue - UMBRELLA_FEE;
  const employerNI = Math.max(0, (beforeEmployerNI - NI_SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE);
  const grossSalary = Math.max(0, beforeEmployerNI - employerNI);

  // Income tax
  let incomeTax = 0;
  if (grossSalary > HIGHER_RATE_LIMIT) {
    incomeTax += (grossSalary - HIGHER_RATE_LIMIT) * 0.45;
    incomeTax += (HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT) * 0.4;
    incomeTax += (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * 0.2;
  } else if (grossSalary > BASIC_RATE_LIMIT) {
    incomeTax += (grossSalary - BASIC_RATE_LIMIT) * 0.4;
    incomeTax += (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * 0.2;
  } else if (grossSalary > PERSONAL_ALLOWANCE) {
    incomeTax += (grossSalary - PERSONAL_ALLOWANCE) * 0.2;
  }

  // Employee NI
  let employeeNI = 0;
  if (grossSalary > NI_UPPER) {
    employeeNI += (grossSalary - NI_UPPER) * 0.02;
    employeeNI += (NI_UPPER - NI_PRIMARY_THRESHOLD) * 0.08;
  } else if (grossSalary > NI_PRIMARY_THRESHOLD) {
    employeeNI += (grossSalary - NI_PRIMARY_THRESHOLD) * 0.08;
  }

  const totalDeductions = employerNI + UMBRELLA_FEE + incomeTax + employeeNI;
  const takeHome = contractValue - totalDeductions;
  const effectiveRate = contractValue > 0 ? (totalDeductions / contractValue) * 100 : 0;
  return { contractValue, grossSalary, employerNI, incomeTax, employeeNI, umbrellaFee: UMBRELLA_FEE, totalDeductions, takeHome, effectiveRate };
}

function fmt(n: number) {
  return `£${Math.round(n).toLocaleString()}`;
}

export default function ContractorCalculator() {
  const [dayRate, setDayRate] = useState(500);
  const [expenses, setExpenses] = useState(3000);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = useCallback(() => setShowResults(true), []);

  const outside = calcOutsideIR35(dayRate, expenses);
  const inside = calcInsideIR35(dayRate);
  const saving = outside.takeHome - inside.takeHome;

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blob-shape" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 blob-shape-2" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-primary font-bold text-sm uppercase tracking-wider">Free Contractor Tool</span>
          <h2 className="text-4xl md:text-5xl font-black text-dark mt-3">
            IR35 Take-Home <span className="text-gradient">Calculator</span>
          </h2>
          <p className="text-lg text-text-light mt-4 max-w-2xl mx-auto">
            See exactly how much more you keep operating outside IR35 through your own limited company versus inside IR35 through an umbrella.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Input panel */}
            <div className="lg:col-span-2 bg-surface rounded-3xl p-8 border border-border">
              <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-primary" />
                Your Contract Details
              </h3>

              {/* Day rate */}
              <div className="mb-6">
                <label className="flex items-center justify-between text-sm font-semibold text-dark mb-2">
                  Day Rate
                  <span className="text-primary font-black text-lg">{fmt(dayRate)}/day</span>
                </label>
                <input
                  type="range" min={150} max={1500} step={25} value={dayRate}
                  onChange={(e) => { setDayRate(Number(e.target.value)); setShowResults(false); }}
                  className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-text-light mt-1">
                  <span>£150/day</span>
                  <span>£1,500/day</span>
                </div>
                <p className="text-xs text-text-light mt-2">
                  Based on {WORKING_DAYS} working days = {fmt(dayRate * WORKING_DAYS)}/year
                </p>
              </div>

              {/* Expenses (outside IR35 only) */}
              <div className="mb-8">
                <label className="flex items-center justify-between text-sm font-semibold text-dark mb-2">
                  Annual Business Expenses
                  <span className="text-primary font-black text-lg">{fmt(expenses)}</span>
                </label>
                <input
                  type="range" min={0} max={15000} step={250} value={expenses}
                  onChange={(e) => { setExpenses(Number(e.target.value)); setShowResults(false); }}
                  className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-text-light mt-1">
                  <span>£0</span>
                  <span>£15,000</span>
                </div>
                <p className="text-xs text-text-light mt-2">Applied to outside IR35 (PSC) only</p>
              </div>

              <button
                onClick={handleCalculate}
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 rounded-xl"
              >
                <Sparkles size={20} />
                Calculate My Take-Home
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
                    <p className="text-xl font-bold text-dark mb-2">Set your day rate</p>
                    <p className="text-text-light">Adjust the sliders and click calculate to see how IR35 status affects your take-home pay</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in-up">

                  {/* Side-by-side comparison */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Outside IR35 */}
                    <div className="gradient-dark rounded-2xl p-5 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blob-shape" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Shield size={14} className="text-primary" />
                          </div>
                          <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Outside IR35</p>
                        </div>
                        <p className="text-xs text-white/40 mb-1">Your own Ltd company (PSC)</p>
                        <p className="text-3xl font-black text-white">{fmt(outside.takeHome)}</p>
                        <p className="text-white/50 text-xs mt-1">{fmt(outside.takeHome / 12)}/month</p>
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-xs text-white/50">
                          <div className="flex justify-between"><span>Corp tax</span><span>{fmt(outside.corpTax)}</span></div>
                          <div className="flex justify-between"><span>Dividend tax</span><span>{fmt(outside.divTax)}</span></div>
                          <div className="flex justify-between font-semibold text-white/70"><span>Effective rate</span><span>{outside.effectiveRate.toFixed(1)}%</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Inside IR35 */}
                    <div className="bg-surface rounded-2xl p-5 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                          <Zap size={14} className="text-red-400" />
                        </div>
                        <p className="text-text-light text-xs font-semibold uppercase tracking-wide">Inside IR35</p>
                      </div>
                      <p className="text-xs text-text-light mb-1">Umbrella company</p>
                      <p className="text-3xl font-black text-dark">{fmt(inside.takeHome)}</p>
                      <p className="text-text-light text-xs mt-1">{fmt(inside.takeHome / 12)}/month</p>
                      <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-xs text-text-light">
                        <div className="flex justify-between"><span>Employer NI</span><span>{fmt(inside.employerNI)}</span></div>
                        <div className="flex justify-between"><span>Income tax + NI</span><span>{fmt(inside.incomeTax + inside.employeeNI)}</span></div>
                        <div className="flex justify-between font-semibold text-dark"><span>Effective rate</span><span>{inside.effectiveRate.toFixed(1)}%</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Saving banner */}
                  {saving > 0 && (
                    <div className="gradient-cta rounded-2xl p-5 text-white relative overflow-hidden">
                      <div className="absolute inset-0 pattern-dots opacity-10" />
                      <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                          <TrendingDown size={24} />
                        </div>
                        <div>
                          <p className="text-white/80 text-sm">Operating outside IR35 through your PSC could mean</p>
                          <p className="text-2xl font-black">{fmt(saving)}/year more in your pocket</p>
                          <p className="text-white/70 text-sm">That&apos;s {fmt(saving / 12)} more per month</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="bg-primary-50 rounded-2xl p-5 border border-primary/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-dark">Not sure about your IR35 status?</p>
                        <p className="text-text-light text-sm mt-0.5">We review your contracts, assess your working practices, and give you a clear, written IR35 opinion.</p>
                      </div>
                      <Link href="/sign-up" className="btn-primary inline-flex items-center gap-2 whitespace-nowrap shrink-0">
                        Talk to an Expert <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>

                  <p className="flex items-start gap-2 text-xs text-text-light">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    Estimates based on 2025/26 tax rates, {WORKING_DAYS} working days, and umbrella fee of £{UMBRELLA_FEE.toLocaleString()}/year. For illustration only — your actual position may differ. Clever Accounts provides personalised advice.
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
