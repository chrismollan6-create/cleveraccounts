"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  return (
    <>
      <section className="gradient-hero-subtle min-h-[calc(100vh-200px)] flex items-center py-16">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Benefits */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
                Get Started with<br />
                <span className="text-primary">Clever Accounts</span>
              </h1>
              <p className="text-lg text-text-light mb-8 max-w-lg">
                Join 10,000+ UK businesses who trust us with their accounting. Sign up in minutes.
              </p>
              <div className="space-y-4">
                {[
                  "No setup fees — start immediately",
                  "No minimum contract — cancel anytime",
                  "Dedicated accountant matched to you",
                  "Free FreeAgent accounting software",
                  "Unlimited advice and support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-success shrink-0" />
                    <span className="text-text font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-border">
              <h2 className="text-2xl font-bold text-dark mb-6">Create Your Account</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">First Name *</label>
                    <input type="text" required className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Last Name *</label>
                    <input type="text" required className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Email Address *</label>
                  <input type="email" required className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Phone Number *</label>
                  <input type="tel" required className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Business Type *</label>
                  <select required className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white">
                    <option value="">Select your business type...</option>
                    <option>Sole Trader</option>
                    <option>Limited Company</option>
                    <option>Contractor</option>
                    <option>Freelancer</option>
                    <option>Landlord</option>
                    <option>Startup</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2">
                  Get Started <ArrowRight size={20} />
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-text-light">
                  <ShieldCheck size={14} /> No setup fees. No minimum contract. Cancel anytime.
                </div>
              </form>
              <p className="text-xs text-text-light mt-4 text-center">
                Already have an account? <Link href="/log-in" className="text-primary font-medium hover:text-primary-dark">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
