"use client";

import { useState } from "react";
import { MessageCircle, X, Phone, Mail, ArrowRight, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { COMPANY } from "@/lib/constants";

const timeSlots = ["ASAP", "Morning (9–12)", "Afternoon (12–5)", "Tomorrow AM", "Tomorrow PM"];
const businessTypes = ["Sole Trader", "Limited Company", "Contractor", "Landlord", "Startup", "CIS / Construction", "Ecommerce", "Other"];

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"menu" | "callback">("menu");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", businessType: "", bestTime: "" });

  const close = () => {
    setOpen(false);
    setTimeout(() => { setView("menu"); setSubmitted(false); setError(""); setForm({ firstName: "", lastName: "", phone: "", businessType: "", bestTime: "" }); }, 300);
  };

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
      if (!res.ok) setError(data.error || "Something went wrong. Please try again.");
      else setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Panel */}
      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in-up mb-2">

          {/* Header */}
          <div className="gradient-teal p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                {view === "callback" && !submitted && (
                  <button onClick={() => setView("menu")} className="text-white/60 hover:text-white text-xs mb-1 flex items-center gap-1">
                    ← Back
                  </button>
                )}
                <h3 className="font-bold text-lg">{view === "callback" ? "Request a Callback" : "Need Help?"}</h3>
                <p className="text-white/80 text-sm">
                  {view === "callback" ? "We'll call you back within 2 hours" : "We typically reply within 2 hours"}
                </p>
              </div>
              <button onClick={close} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Menu view */}
          {view === "menu" && (
            <div className="p-4 space-y-3">
              {/* Callback option */}
              <button
                onClick={() => setView("callback")}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/5 hover:bg-secondary/10 border border-secondary/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-dark">Request a Callback</p>
                  <p className="text-xs text-text-light">We'll call you within 2 hours</p>
                </div>
                <ArrowRight size={16} className="text-text-light" />
              </button>

              <a
                href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-dark">Call Us Free</p>
                  <p className="text-xs text-text-light">{COMPANY.freephone}</p>
                </div>
                <ArrowRight size={16} className="text-text-light" />
              </a>

              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-dark">Email Us</p>
                  <p className="text-xs text-text-light">{COMPANY.email}</p>
                </div>
                <ArrowRight size={16} className="text-text-light" />
              </a>

              <p className="text-xs text-text-light text-center pt-1">Mon–Fri 9am–5:30pm · Here to help</p>
            </div>
          )}

          {/* Callback form view */}
          {view === "callback" && (
            <div className="p-5">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={28} className="text-green-600" />
                  </div>
                  <h3 className="font-black text-dark text-lg mb-2">We'll call you back!</h3>
                  <p className="text-text-light text-sm mb-4">One of our team will be in touch shortly.</p>
                  <button onClick={close} className="text-primary font-semibold text-sm hover:underline">Close</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-dark mb-1">First Name *</label>
                      <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        placeholder="Jane" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-dark mb-1">Last Name *</label>
                      <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        placeholder="Smith" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark mb-1">Phone Number *</label>
                    <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="07123 456789" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark mb-1">Business Type</label>
                    <div className="relative">
                      <select value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none">
                        <option value="">Select...</option>
                        {businessTypes.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark mb-1">Best Time to Call</label>
                    <div className="flex flex-wrap gap-1.5">
                      {timeSlots.map((slot) => (
                        <button key={slot} type="button" onClick={() => setForm({ ...form, bestTime: slot })}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${form.bestTime === slot ? "bg-primary text-white border-primary" : "border-border text-text-light hover:border-primary hover:text-primary"}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm">
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Submitting...</> : <><Phone size={15} /> Request Callback</>}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => { setOpen(!open); if (open) close(); else setOpen(true); }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
          open ? "bg-dark text-white" : "gradient-cta text-white animate-pulse-glow"
        }`}
        aria-label="Contact us"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
