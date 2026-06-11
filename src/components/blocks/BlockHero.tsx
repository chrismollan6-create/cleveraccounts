import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export type HeroBlock = {
  _type: "block.hero";
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  note?: string;
};

/** Wrap the final word of a headline in the brand gradient. */
function gradientLastWord(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) return <span className="text-gradient">{text}</span>;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className="text-gradient">{last}</span>
    </>
  );
}

export default function BlockHero(b: HeroBlock) {
  return (
    <section className="relative overflow-hidden gradient-hero-subtle">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-20 w-[520px] h-[520px] rounded-full bg-primary/15 blur-[110px]" />
        <div className="absolute -bottom-32 -left-24 w-[460px] h-[460px] rounded-full bg-secondary/10 blur-[110px]" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 pt-16 md:pt-20 pb-16 md:pb-20 text-center">
        {b.eyebrow && (
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full mb-5">
            <Sparkles size={14} /> {b.eyebrow}
          </span>
        )}
        {b.headline && (
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark leading-[1.07] tracking-tight mb-5">
            {gradientLastWord(b.headline)}
          </h1>
        )}
        {b.subheadline && (
          <p className="text-lg sm:text-xl text-text-light leading-relaxed mb-8 max-w-2xl mx-auto">{b.subheadline}</p>
        )}
        {(b.primaryCtaLabel || b.secondaryCtaLabel) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {b.primaryCtaLabel && (
              <Link href={b.primaryCtaHref || "/sign-up"} className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3.5 rounded-xl">
                {b.primaryCtaLabel} <ArrowRight size={18} />
              </Link>
            )}
            {b.secondaryCtaLabel && (
              <Link
                href={b.secondaryCtaHref || "/contact"}
                className="inline-flex items-center gap-2 bg-white border border-border text-dark font-semibold text-base px-6 py-3.5 rounded-xl hover:bg-surface transition-colors"
              >
                {b.secondaryCtaLabel}
              </Link>
            )}
          </div>
        )}
        {b.note && <p className="text-text-light text-sm mt-5">{b.note}</p>}
      </div>
    </section>
  );
}
