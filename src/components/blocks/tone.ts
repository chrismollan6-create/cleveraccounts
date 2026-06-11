/**
 * Section "tone" — lets editors control the light/dark rhythm of a page from
 * Studio without touching design. Brand-aware: classes resolve to the active
 * brand's palette via the [data-brand] CSS variables.
 */
export type Tone = "light" | "tinted" | "dark";

export const TONE_LIST = [
  { title: "Light (white)", value: "light" },
  { title: "Tinted (soft brand)", value: "tinted" },
  { title: "Dark (brand)", value: "dark" },
] as const;

/** Background + base text colour for a section, by tone. */
export function toneSection(tone?: Tone): string {
  switch (tone) {
    case "dark":
      return "bg-dark text-white";
    case "tinted":
      return "bg-surface text-text";
    default:
      return "bg-white text-text";
  }
}

/** Eyebrow/label colour that reads on the tone. */
export function toneEyebrow(tone?: Tone): string {
  return tone === "dark" ? "text-primary-light" : "text-primary";
}

/** Heading colour that reads on the tone. */
export function toneHeading(tone?: Tone): string {
  return tone === "dark" ? "text-white" : "text-dark";
}

/** Muted body colour that reads on the tone. */
export function toneMuted(tone?: Tone): string {
  return tone === "dark" ? "text-white/70" : "text-text-light";
}

/** Card surface that reads on the tone. */
export function toneCard(tone?: Tone): string {
  return tone === "dark"
    ? "bg-white/[0.06] border border-white/10"
    : "bg-white border border-border shadow-sm";
}
