"use client";

import { useState } from "react";
import { MessageCircle, X, Phone, Mail, ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat panel */}
      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in-up mb-2">
          <div className="gradient-teal p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Need Help?</h3>
                <p className="text-white/80 text-sm">We typically reply within 2 hours</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
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
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-dark">Direct Line</p>
                <p className="text-xs text-text-light">{COMPANY.phone}</p>
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
          </div>
          <div className="px-4 pb-4">
            <p className="text-xs text-text-light text-center">
              Mon-Fri 9am-5:30pm • We&apos;re here to help
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
          open
            ? "bg-dark text-white"
            : "gradient-cta text-white animate-pulse-glow"
        }`}
        aria-label="Contact us"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
