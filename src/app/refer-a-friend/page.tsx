"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Copy,
  Check,
  Gift,
  Users,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  Banknote,
} from "lucide-react";

interface ReferralItem {
  id: string;
  referredName: string;
  businessType: string;
  referralDate: string | null;
  conversionDate: string | null;
  status: string;
  voucherAmount: number | null;
  voucherDueDate: string | null;
}

interface ReferralData {
  success: boolean;
  referrerFirstName: string;
  referralCode: string;
  referrals: ReferralItem[];
  error?: string;
}

const STATUS_FILTERS = ["All", "Pending", "Converted", "Voucher Due", "Paid"];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-gray-100 text-gray-600",
  Converted: "bg-indigo-50 text-indigo-700",
  "Voucher Due": "bg-amber-50 text-amber-700 border border-amber-200",
  Paid: "bg-green-50 text-green-700",
};

function ReferralPageContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [loading, setLoading] = useState(!!ref);
  const [data, setData] = useState<ReferralData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const shareLink = data
    ? `https://www.cleveraccounts.co.uk/sign-up?ref=${data.referralCode}`
    : "";

  const loadReferralData = useCallback(async () => {
    if (!ref) return;
    try {
      const res = await fetch(`/api/referral?ref=${encodeURIComponent(ref)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Invalid referral link.");
        setData(null);
      } else {
        setData(json);
        setError(null);
      }
    } catch {
      setError("Unable to load your referral page. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [ref]);

  useEffect(() => {
    loadReferralData();
  }, [loadReferralData]);

  function handleCopy() {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const filteredReferrals = data?.referrals.filter(
    (r) => activeFilter === "All" || r.status === activeFilter
  ) ?? [];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark py-20 md:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Gift size={15} className="text-secondary" />
            Earn up to £250 per referral
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {data ? `Hi ${data.referrerFirstName}! 👋` : "Refer a Friend"}
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            {data
              ? "Share your personal link and earn vouchers for every client you send our way."
              : "Know someone who needs an accountant? Earn vouchers every time they sign up."}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Error / generic (no valid code) */}
          {!loading && (error || !ref) && (
            <div className="space-y-12">
              {/* Voucher tiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-primary mb-2">£75</div>
                  <div className="font-bold text-dark mb-1">Sole Trader</div>
                  <div className="text-sm text-text-light">Per successful referral</div>
                </div>
                <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-secondary-dark mb-2">£250</div>
                  <div className="font-bold text-dark mb-1">Limited Company</div>
                  <div className="text-sm text-text-light">Per successful referral</div>
                </div>
              </div>
              <div className="text-center text-sm text-text-light max-w-md mx-auto">
                Vouchers are paid after 3 months, provided both you and your referral are still active clients.
              </div>
              {/* How it works */}
              <HowItWorks />
              {error && ref && (
                <div className="text-center text-sm text-red-500 mt-4">
                  We couldn&apos;t find your referral link. Please check your email for your personal link.
                </div>
              )}
            </div>
          )}

          {/* Personalised view */}
          {!loading && data && (
            <div className="space-y-10">

              {/* Share link card */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-black text-dark mb-1">Your Referral Link</h2>
                <p className="text-sm text-text-light mb-4">Share this link with anyone you think would benefit from Clever Accounts.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-border rounded-xl px-4 py-3 text-sm text-text font-mono truncate select-all">
                    {shareLink}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-primary/90 transition-all shrink-0"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Voucher tiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-primary/5 border border-primary/20 rounded-2xl p-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Banknote size={22} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary">£75</div>
                    <div className="text-sm font-semibold text-dark">Sole Trader referral</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-secondary/10 border border-secondary/30 rounded-2xl p-5">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary-dark flex items-center justify-center shrink-0">
                    <Banknote size={22} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-secondary-dark">£250</div>
                    <div className="text-sm font-semibold text-dark">Limited Company referral</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-light text-center -mt-4">
                Paid after 3 months, assuming both clients are still active.
              </p>

              {/* How it works */}
              <HowItWorks />

              {/* Referrals table */}
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h2 className="text-xl font-black text-dark">Your Referrals</h2>
                  <div className="flex gap-1.5 flex-wrap">
                    {STATUS_FILTERS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          activeFilter === f
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-text-light border-border hover:border-primary hover:text-primary"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredReferrals.length === 0 ? (
                  <div className="text-center py-12 text-text-light text-sm border border-dashed border-border rounded-2xl">
                    {activeFilter === "All"
                      ? "No referrals yet — share your link to get started!"
                      : `No referrals with status "${activeFilter}".`}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface border-b border-border">
                          <th className="text-left px-4 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Name</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Type</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Date Referred</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Voucher</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Due</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredReferrals.map((r) => (
                          <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-dark">{r.referredName}</td>
                            <td className="px-4 py-3 text-text-light">{r.businessType || "—"}</td>
                            <td className="px-4 py-3 text-text-light">{r.referralDate ?? "—"}</td>
                            <td className="px-4 py-3 font-bold text-dark">
                              {r.voucherAmount != null ? `£${r.voucherAmount}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-text-light">{r.voucherDueDate ?? "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </section>
    </>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Copy size={20} />,
      title: "Share your link",
      desc: "Copy your unique referral link and send it to friends, family, or colleagues.",
    },
    {
      icon: <Users size={20} />,
      title: "They sign up",
      desc: "Your contact signs up using your link and becomes a Clever Accounts client.",
    },
    {
      icon: <Clock size={20} />,
      title: "3 months later",
      desc: "After 3 months, provided both accounts are still active, your voucher is confirmed.",
    },
    {
      icon: <Star size={20} />,
      title: "Earn your voucher",
      desc: "We send you your voucher — £75 for a sole trader, £250 for a limited company.",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-black text-dark text-center mb-6">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              {step.icon}
            </div>
            <div className="text-xs font-bold text-primary mb-1">Step {i + 1}</div>
            <div className="font-bold text-dark text-sm mb-1">{step.title}</div>
            <div className="text-xs text-text-light">{step.desc}</div>
            {i < steps.length - 1 && (
              <div className="hidden md:flex justify-end absolute right-0 top-1/2 -translate-y-1/2">
                <ArrowRight size={16} className="text-border" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 bg-surface border border-border rounded-xl p-4 flex items-start gap-3 max-w-lg mx-auto">
        <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
        <p className="text-sm text-text-light">
          There&apos;s no limit to how many friends you can refer — the more you refer, the more you earn.
        </p>
      </div>
    </div>
  );
}

export default function ReferAFriendPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ReferralPageContent />
    </Suspense>
  );
}
