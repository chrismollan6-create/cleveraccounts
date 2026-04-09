"use client";

import { useState } from "react";
import {
  Frown,
  Smile,
  Clock,
  AlertTriangle,
  PoundSterling,
  FileSpreadsheet,
  Moon,
  HeadphonesIcon,
  CheckCircle2,
  Coffee,
  Sun,
  Shield,
  TrendingDown,
  Laptop,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const beforeItems = [
  { icon: <FileSpreadsheet size={20} />, text: "Sundays lost to spreadsheets & receipts" },
  { icon: <Moon size={20} />, text: "Late nights panicking before deadlines" },
  { icon: <AlertTriangle size={20} />, text: "Constant fear of HMRC penalties" },
  { icon: <PoundSterling size={20} />, text: "Overpaying tax without realising" },
  { icon: <Clock size={20} />, text: "Hours wasted on hold with HMRC" },
  { icon: <Frown size={20} />, text: "Stress, confusion, guesswork" },
];

const afterItems = [
  { icon: <Coffee size={20} />, text: "Weekends are yours again" },
  { icon: <Shield size={20} />, text: "Every deadline met — guaranteed" },
  { icon: <CheckCircle2 size={20} />, text: "Fully compliant, zero penalties" },
  { icon: <TrendingDown size={20} />, text: "Tax-efficient — saving £1,000s" },
  { icon: <HeadphonesIcon size={20} />, text: "One call to your accountant sorts it" },
  { icon: <Smile size={20} />, text: "Peace of mind, total clarity" },
];

export default function BeforeAfter() {
  const [position, setPosition] = useState(50);

  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-sm uppercase tracking-wider">The Difference</span>
          <h2 className="text-4xl md:text-5xl font-black text-dark mt-3">
            Your Life <span className="text-gradient">Before &amp; After</span>
          </h2>
          <p className="text-lg text-text-light mt-4 max-w-xl mx-auto">
            Drag the slider to see the transformation
          </p>
        </div>

        {/* Interactive slider comparison */}
        <div className="max-w-4xl mx-auto relative">
          {/* Slider control */}
          <div className="mb-8">
            <input
              type="range"
              min={0}
              max={100}
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FEE2E2 0%, #FEE2E2 ${position}%, #DCFCE7 ${position}%, #DCFCE7 100%)`,
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm font-bold text-red-400 flex items-center gap-1"><Frown size={14} /> Without Us</span>
              <span className="text-sm font-bold text-green-500 flex items-center gap-1">With Clever Accounts <Smile size={14} /></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BEFORE card — active when slider is LEFT (low position) */}
            <div
              className="rounded-3xl p-8 border-2 transition-all duration-500"
              style={{
                opacity: position < 80 ? 1 : 0.4,
                transform: `scale(${position < 50 ? 1 : 0.95 + ((100 - position) / 100) * 0.05})`,
                borderColor: position < 50 ? "#FCA5A5" : "#E5E7EB",
                background: position < 50 ? "#FFF5F5" : "#FAFAFA",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center">
                  <Frown size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark">Without an Accountant</h3>
                  <p className="text-xs text-red-400 font-semibold">Your typical Sunday...</p>
                </div>
              </div>
              <div className="space-y-3">
                {beforeItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm transition-all duration-300"
                    style={{
                      opacity: position <= 100 - (i * 16) ? 1 : 0.3,
                    }}
                  >
                    <span className="text-red-400 shrink-0">{item.icon}</span>
                    <span className="text-text">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-red-200">
                <p className="text-red-500 font-bold text-sm">True cost: £200+/month in time &amp; stress</p>
              </div>
            </div>

            {/* AFTER card — active when slider is RIGHT (high position) */}
            <div
              className="rounded-3xl p-8 border-2 transition-all duration-500"
              style={{
                opacity: position > 20 ? 1 : 0.4,
                transform: `scale(${position >= 50 ? 1 : 0.95 + (position / 100) * 0.05})`,
                borderColor: position >= 50 ? "#86EFAC" : "#E5E7EB",
                background: position >= 50 ? "#F0FDF4" : "#FAFAFA",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-500 flex items-center justify-center">
                  <Smile size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark">With Clever Accounts</h3>
                  <p className="text-xs text-green-500 font-semibold">Your typical Sunday...</p>
                </div>
              </div>
              <div className="space-y-3">
                {afterItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm transition-all duration-300"
                    style={{
                      opacity: position >= (i + 1) * 16 ? 1 : 0.3,
                    }}
                  >
                    <span className="text-green-500 shrink-0">{item.icon}</span>
                    <span className="text-text font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-green-200">
                <p className="text-green-600 font-bold text-sm">From just £32.50/month — everything included</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex items-center gap-3 text-lg px-10 py-4 rounded-2xl"
            >
              <Sparkles size={20} />
              Make the Switch Today
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
