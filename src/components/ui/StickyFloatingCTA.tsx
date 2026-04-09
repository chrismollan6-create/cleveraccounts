"use client";

import { useState, useEffect } from "react";
import { Phone, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export default function StickyFloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up">
      {/* Gradient shadow above */}
      <div className="h-6 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      <div className="bg-white border-t border-border shadow-[0_-4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Message */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm font-semibold text-dark">
              We&apos;re online — speak to an accountant today
            </p>
          </div>

          {/* Right: CTAs */}
          <div className="flex items-center gap-3 flex-1 sm:flex-none justify-between sm:justify-end">
            <a
              href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 bg-dark hover:bg-secondary text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              <Phone size={16} />
              <span className="hidden md:inline">{COMPANY.freephone}</span>
              <span className="md:hidden">Call Free</span>
            </a>
            <Link
              href="/sign-up"
              className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm !shadow-none"
            >
              Get Started <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="text-text-light hover:text-dark transition-colors p-1"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
