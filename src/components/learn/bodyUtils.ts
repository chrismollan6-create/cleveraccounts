import type { Heading } from "./ArticleToc";

type Span = { _type?: string; text?: string };
type Block = {
  _type?: string;
  style?: string;
  children?: Span[];
  listItem?: string;
};

const HEADING_STYLES = new Set(["h2", "h3"]);

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function blockText(block: Block): string {
  return (block.children ?? [])
    .filter((c) => c._type === "span" && typeof c.text === "string")
    .map((c) => c.text!)
    .join("");
}

/**
 * Pull out h2/h3 headings from a PortableText body, in order, with stable ids.
 * Duplicates get -2/-3 suffixes so anchors stay unique.
 */
export function extractHeadings(body: unknown[] | null | undefined): Heading[] {
  if (!Array.isArray(body)) return [];
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  for (const raw of body) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as Block;
    if (block._type !== "block" || !block.style || !HEADING_STYLES.has(block.style)) continue;
    const text = blockText(block).trim();
    if (!text) continue;
    let id = slugifyHeading(text) || `section-${headings.length + 1}`;
    const count = used.get(id) ?? 0;
    if (count > 0) id = `${id}-${count + 1}`;
    used.set(id, count + 1);
    headings.push({ id, text, level: block.style === "h2" ? 2 : 3 });
  }
  return headings;
}

/**
 * Rough reading time (English prose ~200 wpm). Counts words in normal blocks,
 * h2/h3, and the q/a fields of inline faqBlocks. Returns minimum 1 minute.
 */
export function estimateReadingTimeMinutes(body: unknown[] | null | undefined): number {
  if (!Array.isArray(body)) return 1;
  let words = 0;
  for (const raw of body) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as Record<string, unknown>;
    if (block._type === "block") {
      words += countWords(blockText(block as Block));
    } else if (block._type === "faqBlock" && Array.isArray(block.faqs)) {
      for (const f of block.faqs as Array<{ q?: string; a?: string }>) {
        words += countWords(f.q ?? "") + countWords(f.a ?? "");
      }
    } else if (block._type === "howToBlock" && Array.isArray(block.steps)) {
      for (const s of block.steps as Array<{ name?: string; text?: string }>) {
        words += countWords(s.name ?? "") + countWords(s.text ?? "");
      }
    }
  }
  return Math.max(1, Math.round(words / 200));
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
