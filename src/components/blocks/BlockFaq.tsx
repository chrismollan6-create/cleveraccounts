"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toneSection, toneEyebrow, toneHeading, toneCard, type Tone } from "@/components/blocks/tone";

export type FaqBlock = {
  _type: "block.faq";
  tone?: Tone;
  eyebrow?: string;
  heading?: string;
  items?: { question?: string; answer?: string }[];
};

function FaqRow({ question, answer, tone }: { question?: string; answer?: string; tone?: Tone }) {
  const [open, setOpen] = useState(false);
  const isDark = tone === "dark";

  return (
    <div
      className={`rounded-2xl overflow-hidden ${
        isDark ? "bg-white/[0.06] border border-white/10" : `${toneCard(tone)}`
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
      >
        <span className={`font-semibold ${isDark ? "text-white" : "text-dark"}`}>{question}</span>
        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${
            isDark ? "text-white/70" : "text-text-light"
          }`}
        />
      </button>
      {open && answer && (
        <div className={`px-6 pb-5 leading-relaxed ${isDark ? "text-white/70" : "text-text-light"}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function BlockFaq(b: FaqBlock) {
  return (
    <section className={`${toneSection(b.tone)} py-16 md:py-20`}>
      <div className="max-w-3xl mx-auto px-4">
        {(b.eyebrow || b.heading) && (
          <div className="text-center mb-10">
            {b.eyebrow && (
              <span className={`font-bold text-sm uppercase tracking-wider ${toneEyebrow(b.tone)}`}>
                {b.eyebrow}
              </span>
            )}
            {b.heading && (
              <h2 className={`text-3xl md:text-4xl font-extrabold mt-2 ${toneHeading(b.tone)}`}>
                {b.heading}
              </h2>
            )}
          </div>
        )}
        {b.items && b.items.length > 0 && (
          <div className="space-y-3">
            {b.items.map((item, i) => (
              <FaqRow key={i} question={item.question} answer={item.answer} tone={b.tone} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
