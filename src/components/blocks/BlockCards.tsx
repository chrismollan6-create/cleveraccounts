import { Sparkles } from "lucide-react";
import { toneSection, toneEyebrow, toneHeading, toneMuted, toneCard } from "@/components/blocks/tone";

export type CardsBlock = {
  _type: "block.cards";
  tone?: "light" | "tinted" | "dark";
  eyebrow?: string;
  heading?: string;
  intro?: string;
  cards?: { title?: string; text?: string }[];
};

export default function BlockCards(b: CardsBlock) {
  return (
    <section className={`${toneSection(b.tone)} py-16 md:py-20`}>
      <div className="max-w-6xl mx-auto px-4">
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
        {b.cards && b.cards.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {b.cards.map((card, i) => (
              <div key={i} className={`${toneCard(b.tone)} rounded-2xl p-6`}>
                <div className="inline-flex items-center justify-center w-11 h-11 bg-primary/10 text-primary rounded-2xl mb-4">
                  <Sparkles size={20} />
                </div>
                {card.title && <h3 className={`${toneHeading(b.tone)} text-lg font-bold mb-2`}>{card.title}</h3>}
                {card.text && <p className={`${toneMuted(b.tone)} text-base leading-relaxed`}>{card.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
