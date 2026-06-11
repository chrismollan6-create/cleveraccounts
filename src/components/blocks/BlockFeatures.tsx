import { CheckCircle2 } from "lucide-react";
import { toneSection, toneEyebrow, toneHeading, toneMuted } from "@/components/blocks/tone";

export type FeaturesBlock = {
  _type: "block.features";
  tone?: "light" | "tinted" | "dark";
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items?: string[];
};

export default function BlockFeatures(b: FeaturesBlock) {
  return (
    <section className={`${toneSection(b.tone)} py-16 md:py-20`}>
      <div className="max-w-5xl mx-auto px-4">
        {(b.eyebrow || b.heading || b.intro) && (
          <div className="max-w-2xl mb-10 md:mb-12">
            {b.eyebrow && (
              <span className={`${toneEyebrow(b.tone)} font-bold text-sm uppercase tracking-wider`}>{b.eyebrow}</span>
            )}
            {b.heading && (
              <h2 className={`${toneHeading(b.tone)} text-3xl md:text-4xl font-extrabold tracking-tight mt-2`}>{b.heading}</h2>
            )}
            {b.intro && <p className={`${toneMuted(b.tone)} text-lg leading-relaxed mt-4`}>{b.intro}</p>}
          </div>
        )}
        {b.items && b.items.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {b.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={22} className="text-primary shrink-0 mt-0.5" />
                <span className={`${toneMuted(b.tone)} text-base leading-relaxed`}>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
