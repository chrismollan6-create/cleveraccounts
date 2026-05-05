"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { FAQPageJsonLd, HowToJsonLd, ReviewJsonLd } from "@/components/seo/StructuredData";

export function HtmlEmbedBlock({ html }: { html: string }) {
  const safe = sanitizeHtml(html ?? "");
  return <div className="my-6 prose-html" dangerouslySetInnerHTML={{ __html: safe }} />;
}

export function FaqBlockRenderer({
  heading,
  faqs,
}: {
  heading?: string;
  faqs: { q: string; a: string }[];
}) {
  if (!faqs?.length) return null;
  return (
    <div className="my-8">
      <FAQPageJsonLd faqs={faqs} />
      {heading && <h3 className="text-xl md:text-2xl font-bold text-dark mb-4">{heading}</h3>}
      <div className="border border-border rounded-2xl overflow-hidden bg-white">
        {faqs.map((f, i) => (
          <FaqRow key={i} q={f.q} a={f.a} last={i === faqs.length - 1} />
        ))}
      </div>
    </div>
  );
}

function FaqRow({ q, a, last }: { q: string; a: string; last: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={!last ? "border-b border-border" : ""}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-dark">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-text-light transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-text leading-relaxed whitespace-pre-line">{a}</div>
      )}
    </div>
  );
}

export function HowToBlockRenderer({
  name,
  description,
  steps,
}: {
  name: string;
  description?: string;
  steps: { name?: string; text: string }[];
}) {
  if (!steps?.length) return null;
  return (
    <div className="my-8 bg-surface rounded-2xl p-6 md:p-8">
      <HowToJsonLd name={name} description={description} steps={steps} />
      <h3 className="text-xl md:text-2xl font-bold text-dark mb-2">{name}</h3>
      {description && <p className="text-text-light mb-5">{description}</p>}
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div>
              {s.name && <p className="font-semibold text-dark mb-0.5">{s.name}</p>}
              <p className="text-text leading-relaxed">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ReviewBlockRenderer({
  author,
  rating,
  reviewBody,
  itemReviewed,
}: {
  author: string;
  rating: number;
  reviewBody: string;
  itemReviewed?: string;
}) {
  return (
    <figure className="my-8 border-l-4 border-primary pl-5 py-2">
      <ReviewJsonLd
        author={author}
        rating={rating}
        reviewBody={reviewBody}
        itemReviewed={itemReviewed}
      />
      {reviewBody && (
        <blockquote className="italic text-text leading-relaxed">&ldquo;{reviewBody}&rdquo;</blockquote>
      )}
      <figcaption className="mt-2 text-sm text-text-light">
        — {author}
        {itemReviewed ? ` on ${itemReviewed}` : ""}
        {rating ? ` · ${rating}/5` : ""}
      </figcaption>
    </figure>
  );
}

export function CtaBlockRenderer({
  heading,
  subheading,
  buttonText,
  buttonHref,
}: {
  heading: string;
  subheading?: string;
  buttonText?: string;
  buttonHref?: string;
}) {
  return (
    <div className="my-8 bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 text-center">
      <h3 className="text-xl md:text-2xl font-bold text-dark mb-2">{heading}</h3>
      {subheading && <p className="text-text-light mb-5">{subheading}</p>}
      <a
        href={buttonHref || "/sign-up"}
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        {buttonText || "Get Started"}
        <ArrowRight size={16} />
      </a>
    </div>
  );
}
