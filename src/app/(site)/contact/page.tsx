"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Zap,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import RequestCallback from "@/components/ui/RequestCallback";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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
            <Zap size={15} className="text-secondary" />
            We typically respond within 2 hours
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            A question about our services, a quote, or just want to talk to someone? Our team is here.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* ── Contact Form ── */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-black text-dark mb-2">Send Us a Message</h2>
              <p className="text-text-light text-sm mb-8">We'll get back to you by the next business day — usually much sooner.</p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={28} className="text-green-600" />
                  </div>
                  <h3 className="font-black text-dark text-xl mb-2">Message Sent!</h3>
                  <p className="text-text-light text-sm">Thanks for getting in touch. We'll be in touch within 2 hours during business hours.</p>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-border rounded-xl text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/50"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-border rounded-xl text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-border rounded-xl text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-light/50"
                        placeholder="07123 456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1.5">Business Type</label>
                      <select className="w-full px-4 py-3 border border-border rounded-xl text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                        <option value="">Select...</option>
                        <option>Sole Trader</option>
                        <option>Limited Company</option>
                        <option>Contractor</option>
                        <option>Landlord</option>
                        <option>Startup</option>
                        <option>CIS / Construction</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-border rounded-xl text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none placeholder:text-text-light/50"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                  >
                    Send Message <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </div>

            {/* ── Contact Info ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Call us — prominent */}
              <div className="bg-dark rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/30 text-primary-light flex items-center justify-center shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-white mb-1">Call Us</h3>
                    <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="block text-secondary font-bold text-lg hover:text-secondary/80 transition-colors">
                      {COMPANY.freephone}
                    </a>
                    <p className="text-white/50 text-xs mt-0.5">Freephone</p>
                    <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="block text-white/60 text-sm mt-2 hover:text-white transition-colors">
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-1">Email</h3>
                    <a href={`mailto:${COMPANY.email}`} className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                      {COMPANY.email}
                    </a>
                    <p className="text-xs text-text-light mt-1">Typically responded to within 2 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-2">Opening Hours</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-light">Monday – Friday</span>
                        <span className="font-semibold text-dark">9:00am – 5:30pm</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-light">Saturday – Sunday</span>
                        <span className="text-text-light">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-2">Our Offices</h3>
                    <div className="space-y-1">
                      {COMPANY.offices.map((office) => (
                        <div key={office.city} className="text-sm">
                          <span className="font-semibold text-dark">{office.city}</span>
                          <span className="text-text-light"> — {office.address}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Callback */}
              <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-dark text-sm">Prefer a call?</div>
                    <p className="text-text-light text-xs">We'll call you back within 2 hours.</p>
                  </div>
                </div>
                <RequestCallback inline label="Request a Callback" />
              </div>

              {/* Quick link */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-dark text-sm mb-0.5">Rather sign up directly?</div>
                  <p className="text-text-light text-xs">No setup fee, no commitment needed.</p>
                </div>
                <Link href="/sign-up" className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-all whitespace-nowrap">
                  Get Started <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
