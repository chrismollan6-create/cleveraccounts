"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

function FAQRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-white">{question}</span>
        {open
          ? <ChevronUp size={20} className="text-primary-light shrink-0" />
          : <ChevronDown size={20} className="text-white/50 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/10 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function PricingFAQ({ faqs }: { faqs: FAQItem[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <FAQRow key={f._id} question={f.question} answer={f.answer} />
      ))}
    </div>
  );
}
