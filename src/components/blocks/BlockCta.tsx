import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type CtaBlock = {
  _type: "block.cta";
  heading?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function BlockCta(b: CtaBlock) {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative overflow-hidden gradient-dark rounded-[2rem] p-10 md:p-16 text-center">
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-16 w-72 h-72 bg-secondary/15 rounded-full blur-3xl" />
          <div className="relative">
            {b.heading && <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{b.heading}</h2>}
            {b.text && <p className="text-white/75 text-lg mb-9 max-w-2xl mx-auto">{b.text}</p>}
            {b.ctaLabel && (
              <Link
                href={b.ctaHref || "/sign-up"}
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-4 rounded-xl"
              >
                {b.ctaLabel} <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
