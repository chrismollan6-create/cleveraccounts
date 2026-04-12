"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { trackEvent, getStoredUTMParams, getReferralCode } from "@/components/seo/GoogleTagManager";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessType: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    trackEvent("signup_stage1_view", {
      page: "sign-up",
      ...getStoredUTMParams(),
    });
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const utms = getStoredUTMParams() || {};

      trackEvent("signup_stage1_submit", {
        business_type: formData.businessType,
        ...utms,
      });

      const referralCode = getReferralCode() || "";

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...utms, referralCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.redirectUrl) {
        setErrorMessage(
          data.error || "Something went wrong. Please try again."
        );
        return;
      }

      trackEvent("signup_lead_created", {
        business_type: formData.businessType,
        ...utms,
      });

      router.push(data.redirectUrl);
    } catch {
      setErrorMessage(
        "A network error occurred. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="gradient-hero-subtle min-h-[calc(100vh-200px)] flex items-center py-16">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Benefits */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
                Get Started with
                <br />
                <span className="text-primary">Clever Accounts</span>
              </h1>
              <p className="text-lg text-text-light mb-8 max-w-lg">
                Join 10,000+ UK businesses who trust us with their accounting.
                Sign up in minutes.
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
              <h2 className="text-2xl font-bold text-dark mb-6">
                Create Your Account
              </h2>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
                  >
                    <option value="">Select your business type...</option>
                    <option value="Sole Trader">Sole Trader</option>
                    <option value="Limited Company">Limited Company</option>
                    <option value="CIS">CIS (Construction)</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Landlord">Landlord</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Setting up your account...
                    </>
                  ) : (
                    <>
                      Get Started <ArrowRight size={20} />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-text-light">
                  <ShieldCheck size={14} /> No setup fees. No minimum contract.
                  Cancel anytime.
                </div>
              </form>
              <p className="text-xs text-text-light mt-4 text-center">
                Already have an account?{" "}
                <Link
                  href="/log-in"
                  className="text-primary font-medium hover:text-primary-dark"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
