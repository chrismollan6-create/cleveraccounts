import { toneSection, toneEyebrow, toneHeading, toneMuted, type Tone } from "@/components/blocks/tone";

type Step = {
  title?: string;
  text?: string;
};

export type StepsBlock = {
  _type: "block.steps";
  tone?: Tone;
  eyebrow?: string;
  heading?: string;
  steps?: Step[];
};

export default function BlockSteps(b: StepsBlock) {
  return (
    <section className={`${toneSection(b.tone)} py-16 md:py-20`}>
      <div className="max-w-6xl mx-auto px-4">
        {(b.eyebrow || b.heading) && (
          <div className="text-center mb-12 md:mb-14">
            {b.eyebrow && (
              <span className={`${toneEyebrow(b.tone)} font-bold text-sm uppercase tracking-wider`}>{b.eyebrow}</span>
            )}
            {b.heading && (
              <h2 className={`${toneHeading(b.tone)} text-3xl md:text-4xl font-extrabold mt-3`}>{b.heading}</h2>
            )}
          </div>
        )}
        {b.steps && b.steps.length > 0 && (
          <div className="grid gap-10 md:grid-cols-3">
            {b.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white text-xl font-extrabold">
                  {i + 1}
                </div>
                {step.title && <h3 className={`${toneHeading(b.tone)} font-bold text-lg mb-2`}>{step.title}</h3>}
                {step.text && <p className={`${toneMuted(b.tone)} leading-relaxed`}>{step.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
