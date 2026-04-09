"use client";

import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero-subtle py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Have a question about our services? Our friendly team is here to help. We typically respond within 2 hours.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-dark mb-6">Send Us a Message</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="07123 456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Business Type</label>
                    <select className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white">
                      <option value="">Select...</option>
                      <option>Sole Trader</option>
                      <option>Limited Company</option>
                      <option>Contractor</option>
                      <option>Freelancer</option>
                      <option>Landlord</option>
                      <option>Startup</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
                >
                  Send Message <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-dark mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="bg-surface rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Phone</h3>
                      <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="block text-primary hover:text-primary-dark font-medium">
                        {COMPANY.freephone} (Freephone)
                      </a>
                      <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="block text-text-light hover:text-primary text-sm mt-1">
                        {COMPANY.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-surface rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Email</h3>
                      <a href={`mailto:${COMPANY.email}`} className="text-primary hover:text-primary-dark font-medium">
                        {COMPANY.email}
                      </a>
                      <p className="text-sm text-text-light mt-1">We typically respond within 2 hours</p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Offices</h3>
                      {COMPANY.offices.map((office) => (
                        <p key={office.city} className="text-sm text-text-light">{office.address}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-surface rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Opening Hours</h3>
                      <p className="text-sm text-text-light">Monday – Friday: 9:00am – 5:30pm</p>
                      <p className="text-sm text-text-light">Saturday – Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
