"use client";

import { useState, useEffect } from "react";
import { Phone, X, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";

const timeSlots = [
  "As soon as possible",
  "Morning (9am – 12pm)",
  "Afternoon (12pm – 5pm)",
  "Today",
  "Tomorrow morning",
  "Tomorrow afternoon",
];

const businessTypes = [
  "Sole Trader",
  "Limited Company",
  "Contractor",
  "Landlord",
  "Startup",
  "CIS / Construction",
  "Ecommerce",
  "Other",
];

interface Props {
  /** Render as a floating button fixed to the bottom-right */
  floating?: boolean;
  /** Render inline (e.g. inside a page section) */
  inline?: boolean;
  /** Label for the trigger button */
  label?: string;
}

export default function RequestCallback({
  floating = false,
  inline = false,
  label = "Request a Callback",
}: Props) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    businessType: "",
    bestTime: "",
  });

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOpen(false);
    setTimeout(() => { setSubmitted(false); setForm({ firstName: "", lastName: "", phone: "", businessType: "", bestTime: "" }); setError(""); }, 300);
  };

  const triggerBtn = (
    <button
      onClick={() => setOpen(true)}
      className={
        floating
          ? "fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold px-5 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105"
          : inline
          ? "inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm"
          : "inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm"
      }
    >
      <Phone size={18} />
      {label}
    </button>
  );

  const modal = open && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={reset}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-dark rounded-t-3xl px-7 py-6">
            <button
              onClick={reset}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <h2 className="text-white font-black text-lg leading-tight">Request a Callback</h2>
                <p className="text-white/50 text-xs">We'll call you back within 2 hours</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-7 py-6">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="font-black text-dark text-xl mb-2">We'll be in touch!</h3>
                <p className="text-text-light text-sm mb-6">
                  One of our team will call you back shortly. If it's outside business hours, we'll call first thing tomorrow.
                </p>
                <button onClick={reset} className="text-primary font-semibold text-sm hover:underline">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-dark mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Jane"
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Smith"
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="07123 456789"
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark mb-1.5">Business Type</label>
                  <div className="relative">
                    <select
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none"
                    >
                      <option value="">Select...</option>
                      {businessTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark mb-1.5">Best Time to Call</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setForm({ ...form, bestTime: slot })}
                        className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors text-left ${
                          form.bestTime === slot
                            ? "bg-primary text-white border-primary"
                            : "border-border text-text-light hover:border-primary hover:text-primary bg-white"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
                >
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Phone size={18} /> Request Callback</>}
                </button>

                <p className="text-center text-xs text-text-light">
                  Mon–Fri 9am–5:30pm · We aim to call back within 2 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {triggerBtn}
      {modal}
    </>
  );
}
