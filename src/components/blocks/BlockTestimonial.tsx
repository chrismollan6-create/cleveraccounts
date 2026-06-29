import { Star } from "lucide-react";
import { toneSection, toneHeading, toneMuted, toneCard, type Tone } from "@/components/blocks/tone";

export type TestimonialBlock = {
  _type: "block.testimonial";
  tone?: Tone;
  quote?: string;
  name?: string;
  role?: string;
};

export default function BlockTestimonial(b: TestimonialBlock) {
  return (
    <section className={`${toneSection(b.tone)} py-16 md:py-20`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className={`${toneCard(b.tone)} rounded-3xl p-8 md:p-10 max-w-3xl mx-auto text-center`}>
          <div className="flex items-center justify-center gap-1 mb-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          {b.quote && (
            <p className={`text-lg md:text-xl italic leading-relaxed ${toneHeading(b.tone)}`}>
              &ldquo;{b.quote}&rdquo;
            </p>
          )}
          {(b.name || b.role) && (
            <div className="mt-6">
              {b.name && <p className={`font-bold ${toneHeading(b.tone)}`}>{b.name}</p>}
              {b.role && <p className={`text-sm ${toneMuted(b.tone)}`}>{b.role}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
