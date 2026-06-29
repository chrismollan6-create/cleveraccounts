import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import { toneSection, type Tone } from "./tone";

export type RichTextBlock = {
  _type: "block.richText";
  tone?: Tone;
  body?: unknown;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-extrabold text-dark mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold text-dark mt-8 mb-3">{children}</h3>,
    normal: ({ children }) => <p className="text-text-light leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-5 my-6 text-lg text-text italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-text-light">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-text-light">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-dark">{children}</strong>,
    link: ({ children, value }) => (
      <Link href={value?.href || "#"} className="text-primary font-semibold hover:underline">
        {children}
      </Link>
    ),
  },
};

export default function BlockRichText(b: RichTextBlock) {
  return (
    <section className={`${toneSection(b.tone)} py-16 md:py-20`}>
      <div className="max-w-3xl mx-auto px-4">
        <PortableText value={b.body as Parameters<typeof PortableText>[0]["value"]} components={components} />
      </div>
    </section>
  );
}
