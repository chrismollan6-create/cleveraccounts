"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ca_cookie_consent");
    if (!consent) {
      // Delay showing so it doesn't compete with page load
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptAll() {
    localStorage.setItem("ca_cookie_consent", "all");
    setVisible(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w !== "undefined") {
      // Consent Mode v2 — grant all signals
      if (typeof w.gtag === "function") {
        w.gtag("consent", "update", {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
          analytics_storage: "granted",
        });
      }
      // Also push to dataLayer for GTM tags
      if (w.dataLayer) {
        w.dataLayer.push({ event: "cookie_consent_granted", consent_type: "all" });
      }
    }
  }

  function acceptEssential() {
    localStorage.setItem("ca_cookie_consent", "essential");
    setVisible(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w !== "undefined") {
      // Consent Mode v2 — deny ad signals, keep analytics
      if (typeof w.gtag === "function") {
        w.gtag("consent", "update", {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "granted",
        });
      }
      if (w.dataLayer) {
        w.dataLayer.push({ event: "cookie_consent_essential", consent_type: "essential" });
      }
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-border p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
            <Cookie size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-dark mb-1">We use cookies</h3>
            <p className="text-sm text-text-light mb-4">
              We use cookies to improve your experience, analyse site traffic, and serve personalised ads.
              By clicking &quot;Accept All&quot;, you consent to our use of cookies.{" "}
              <Link href="/privacy" className="text-primary hover:text-primary-dark font-medium">
                Privacy Policy
              </Link>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="btn-primary !py-2.5 !px-6 text-sm !shadow-none"
              >
                Accept All
              </button>
              <button
                onClick={acceptEssential}
                className="px-6 py-2.5 text-sm font-semibold text-text-light border border-border rounded-xl hover:bg-surface transition-colors"
              >
                Essential Only
              </button>
            </div>
          </div>
          <button onClick={acceptEssential} className="text-text-light hover:text-dark shrink-0">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
