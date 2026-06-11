import { toneSection, toneMuted, type Tone } from "@/components/blocks/tone";

type Stat = {
  value?: string;
  label?: string;
};

export type StatsBlock = {
  _type: "block.stats";
  tone?: Tone;
  stats?: Stat[];
};

export default function BlockStats(b: StatsBlock) {
  if (!b.stats || b.stats.length === 0) return null;
  return (
    <section className={`${toneSection(b.tone)} py-16 md:py-20`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {b.stats.map((stat, i) => (
            <div key={i} className="text-center">
              {stat.value && <div className="text-gradient text-3xl md:text-4xl font-extrabold">{stat.value}</div>}
              {stat.label && <div className={`${toneMuted(b.tone)} text-sm mt-2`}>{stat.label}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
