import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getActivePromoBanner } from "@/sanity/queries";

const bgColors: Record<string, string> = {
  orange: "gradient-cta",
  teal: "gradient-teal",
  dark: "gradient-dark",
  green: "bg-emerald-600",
  red: "bg-red-600",
};

export default async function PromoBanner() {
  let banner = null;

  try {
    banner = await getActivePromoBanner();
  } catch (e) { /* no banner */ }

  if (!banner) return null;

  const bg = bgColors[banner.backgroundColor] || "gradient-cta";

  return (
    <div className={`${bg} text-white text-sm py-2.5 text-center`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 flex-wrap">
        <Sparkles size={14} className="shrink-0" />
        <span className="font-medium">{banner.text}</span>
        {banner.linkText && banner.linkUrl && (
          <Link
            href={banner.linkUrl}
            className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:no-underline"
          >
            {banner.linkText} <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
