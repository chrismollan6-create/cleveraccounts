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
  Mail,
  Send,
  Loader2,
  RotateCcw,
} from "lucide-react";

interface ReferralItem {
  id: string;
  referredName: string;
  email?: string;
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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function ReferralPageContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [loading, setLoading] = useState(!!ref);
  const [data, setData] = useState<ReferralData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [emailForm, setEmailForm] = useState({ friendName: "", friendEmail: "" });
  const [emailSending, setEmailSending] = useState(false);
  const [emailsSent, setEmailsSent] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resentIds, setResentIds] = useState<Set<string>>(new Set());
  const [requestEmail, setRequestEmail] = useState("");
  const [requestSending, setRequestSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

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

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!data || !emailForm.friendEmail) return;
    setEmailSending(true);
    setEmailError(null);
    try {
      const res = await fetch("/api/referral/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: data.referralCode,
          friendName: emailForm.friendName,
          friendEmail: emailForm.friendEmail,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setEmailError(json.error || "Failed to send email. Please try again.");
      } else {
        setEmailsSent((prev) => [...prev, emailForm.friendEmail]);
        setEmailForm({ friendName: "", friendEmail: "" });
        // Refresh the referrals list so the new entry appears
        await loadReferralData();
      }
    } catch {
      setEmailError("A network error occurred. Please try again.");
    } finally {
      setEmailSending(false);
    }
  }

  async function handleResend(referral: ReferralItem) {
    if (!data || !referral.email) return;
    setResendingId(referral.id);
    try {
      await fetch("/api/referral/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: data.referralCode,
          friendName: referral.referredName,
          friendEmail: referral.email,
        }),
      });
      setResentIds((prev) => new Set([...prev, referral.id]));
      setTimeout(() => {
        setResentIds((prev) => {
          const next = new Set(prev);
          next.delete(referral.id);
          return next;
        });
      }, 3000);
    } finally {
      setResendingId(null);
    }
  }

  async function handleRequestLink(e: React.FormEvent) {
    e.preventDefault();
    if (!requestEmail) return;
    setRequestSending(true);
    setRequestError(null);
    try {
      const res = await fetch("/api/referral/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestEmail }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setRequestError(json.error || "We couldn't find an account with that email address.");
      } else {
        setRequestSent(true);
      }
    } catch {
      setRequestError("A network error occurred. Please try again.");
    } finally {
      setRequestSending(false);
    }
  }

  function handleCopy() {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const filteredReferrals =
    data?.referrals.filter(
      (r) => activeFilter === "All" || r.status === activeFilter
    ) ?? [];

  const counts = {
    total: data?.referrals.length ?? 0,
    converted: data?.referrals.filter((r) => r.status !== "Pending").length ?? 0,
    due: data?.referrals.filter((r) => r.status === "Voucher Due").length ?? 0,
    paid: data?.referrals.filter((r) => r.status === "Paid").length ?? 0,
  };

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
            <div className="space-y-10 max-w-lg mx-auto">

              {/* Already a client — send my link */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-dark leading-tight">Already a client?</h2>
                    <p className="text-sm text-text-light">Enter your email and we&apos;ll send your personal referral link.</p>
                  </div>
                </div>

                {requestSent ? (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-semibold">
                    <Check size={16} className="shrink-0" />
                    Referral link sent — check your inbox!
                  </div>
                ) : (
                  <form onSubmit={handleRequestLink} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/50"
                    />
                    <button
                      type="submit"
                      disabled={requestSending}
                      className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 shrink-0"
                    >
                      {requestSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      Send
                    </button>
                  </form>
                )}
                {requestError && <p className="mt-3 text-sm text-red-500">{requestError}</p>}
              </div>

              {/* Not a client — sign up */}
              <div className="bg-dark rounded-2xl p-8 text-center">
                <h2 className="text-lg font-black text-white mb-2">Not a client yet?</h2>
                <p className="text-white/70 text-sm mb-5">
                  Join Clever Accounts and you&apos;ll get your own referral link — earn up to £250 for every friend you refer.
                </p>
                <a
                  href="/sign-up"
                  className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all"
                >
                  Sign Up Now <ArrowRight size={16} />
                </a>
              </div>

              <HowItWorks />
            </div>
          )}

          {/* Personalised view */}
          {!loading && data && (
            <div className="space-y-10">

              {/* Top row: share link + voucher tiers */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Share link — takes more width */}
                <div className="md:col-span-3 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6">
                  <h2 className="text-base font-black text-dark mb-1">Your Referral Link</h2>
                  <p className="text-sm text-text-light mb-4">Share this with anyone you think would benefit from Clever Accounts.</p>
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

                {/* Voucher tiers — stacked */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <div className="text-xl font-black text-primary">£75</div>
                      <div className="text-xs font-semibold text-dark">Sole Trader referral</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/30 rounded-2xl p-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary-dark flex items-center justify-center shrink-0">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <div className="text-xl font-black text-secondary-dark">£250</div>
                      <div className="text-xs font-semibold text-dark">Limited Company referral</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-light text-center -mt-6">
                Paid after 3 months, assuming both clients are still active.
              </p>

              {/* ── YOUR REFERRALS ─────────────────────────────── */}
              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-dark">Your Referrals</h2>
                    {counts.total > 0 && (
                      <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {counts.total}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {STATUS_FILTERS.map((f) => {
                      const count = f === "All"
                        ? counts.total
                        : data.referrals.filter((r) => r.status === f).length;
                      return (
                        <button
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            activeFilter === f
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-text-light border-border hover:border-primary hover:text-primary"
                          }`}
                        >
                          {f}{count > 0 && ` (${count})`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary stats */}
                {counts.total > 0 && (
                  <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-surface">
                    <div className="px-6 py-3 text-center">
                      <div className="text-lg font-black text-dark">{counts.total}</div>
                      <div className="text-xs text-text-light">Invited</div>
                    </div>
                    <div className="px-6 py-3 text-center">
                      <div className="text-lg font-black text-indigo-600">{counts.converted}</div>
                      <div className="text-xs text-text-light">Signed up</div>
                    </div>
                    <div className="px-6 py-3 text-center">
                      <div className="text-lg font-black text-amber-600">{counts.due}</div>
                      <div className="text-xs text-text-light">Voucher due</div>
                    </div>
                  </div>
                )}

                {/* Table or empty state */}
                {filteredReferrals.length === 0 ? (
                  <div className="text-center py-14 text-text-light text-sm px-4">
                    {activeFilter === "All"
                      ? "No referrals yet — share your link or send an invite below to get started!"
                      : `No referrals with status "${activeFilter}".`}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface border-b border-border">
                          <th className="text-left px-5 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Name</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Type</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Invited</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Voucher</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-text-light uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredReferrals.map((r) => (
                          <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                            <td className="px-5 py-4 font-semibold text-dark">{r.referredName}</td>
                            <td className="px-5 py-4 text-text-light">{r.businessType || "—"}</td>
                            <td className="px-5 py-4 text-text-light">{formatDate(r.referralDate)}</td>
                            <td className="px-5 py-4 font-bold text-dark">
                              {r.voucherAmount != null ? `£${r.voucherAmount}` : "—"}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              {r.status === "Pending" && r.email && (
                                resentIds.has(r.id) ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold">
                                    <Check size={13} /> Sent
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleResend(r)}
                                    disabled={resendingId === r.id}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all disabled:opacity-50"
                                  >
                                    {resendingId === r.id ? (
                                      <Loader2 size={12} className="animate-spin" />
                                    ) : (
                                      <RotateCcw size={12} />
                                    )}
                                    Resend
                                  </button>
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ── EMAIL A FRIEND ──────────────────────────────── */}
              <div className="bg-white border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-dark leading-tight">Email a Friend</h2>
                    <p className="text-sm text-text-light">We&apos;ll send them a branded invite with your referral link.</p>
                  </div>
                </div>

                {emailsSent.length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    {emailsSent.map((email) => (
                      <div key={email} className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                        <Check size={15} className="shrink-0" />
                        Invite sent to {email}
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendEmail} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1.5">Their First Name</label>
                      <input
                        type="text"
                        value={emailForm.friendName}
                        onChange={(e) => setEmailForm((prev) => ({ ...prev, friendName: e.target.value }))}
                        placeholder="Jane"
                        className="w-full px-4 py-3 border border-border rounded-xl text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1.5">Their Email Address *</label>
                      <input
                        type="email"
                        required
                        value={emailForm.friendEmail}
                        onChange={(e) => setEmailForm((prev) => ({ ...prev, friendEmail: e.target.value }))}
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 border border-border rounded-xl text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/50"
                      />
                    </div>
                  </div>

                  {emailError && (
                    <p className="text-sm text-red-600">{emailError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={emailSending}
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {emailSending ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={16} /> Send Invite</>
                    )}
                  </button>
                </form>
              </div>

              {/* ── HOW IT WORKS ────────────────────────────────── */}
              <HowItWorks />

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
      desc: "They sign up using your link and become a Clever Accounts client.",
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
    <div className="border-t border-border pt-10">
      <h2 className="text-lg font-black text-dark text-center mb-6">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="relative text-center">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              {step.icon}
            </div>
            <div className="text-xs font-bold text-primary mb-1">Step {i + 1}</div>
            <div className="font-bold text-dark text-sm mb-1">{step.title}</div>
            <div className="text-xs text-text-light">{step.desc}</div>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-5 -right-2 text-border">
                <ArrowRight size={14} />
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
