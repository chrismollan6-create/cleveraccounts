import BlockHero, { type HeroBlock } from "./BlockHero";
import BlockRichText, { type RichTextBlock } from "./BlockRichText";
import BlockCta, { type CtaBlock } from "./BlockCta";
import BlockFeatures, { type FeaturesBlock } from "./BlockFeatures";
import BlockCards, { type CardsBlock } from "./BlockCards";
import BlockSteps, { type StepsBlock } from "./BlockSteps";
import BlockStats, { type StatsBlock } from "./BlockStats";
import BlockTestimonial, { type TestimonialBlock } from "./BlockTestimonial";
import BlockFaq, { type FaqBlock } from "./BlockFaq";

export type PageBlock = { _type: string; _key: string } & Record<string, unknown>;

/**
 * Renders a page-builder `sections` array — maps each block's _type to its
 * brand-aware React component. Add a new block: build it, then add a `case`.
 */
export default function BlockRenderer({ sections }: { sections?: PageBlock[] }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((s) => {
        const key = s._key;
        switch (s._type) {
          case "block.hero":
            return <BlockHero key={key} {...(s as unknown as HeroBlock)} />;
          case "block.richText":
            return <BlockRichText key={key} {...(s as unknown as RichTextBlock)} />;
          case "block.features":
            return <BlockFeatures key={key} {...(s as unknown as FeaturesBlock)} />;
          case "block.cards":
            return <BlockCards key={key} {...(s as unknown as CardsBlock)} />;
          case "block.steps":
            return <BlockSteps key={key} {...(s as unknown as StepsBlock)} />;
          case "block.stats":
            return <BlockStats key={key} {...(s as unknown as StatsBlock)} />;
          case "block.testimonial":
            return <BlockTestimonial key={key} {...(s as unknown as TestimonialBlock)} />;
          case "block.faq":
            return <BlockFaq key={key} {...(s as unknown as FaqBlock)} />;
          case "block.cta":
            return <BlockCta key={key} {...(s as unknown as CtaBlock)} />;
          default:
            return null;
        }
      })}
    </>
  );
}
