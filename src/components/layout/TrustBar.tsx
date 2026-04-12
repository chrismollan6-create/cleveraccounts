import { Star } from "lucide-react";

function Stars({ rating, color }: { rating: number; color: string }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        if (i < full) return <Star key={i} size={12} className={`fill-current ${color}`} />;
        if (i === full && partial >= 0.5) return (
          <span key={i} className="relative inline-block" style={{ width: 12, height: 12 }}>
            <Star size={12} className="absolute text-gray-300 fill-current" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
              <Star size={12} className={`fill-current ${color}`} />
            </span>
          </span>
        );
        return <Star key={i} size={12} className="fill-current text-gray-300" />;
      })}
    </span>
  );
}

export default function TrustBar() {
  return (
    <div className="bg-white border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">

          {/* Trustpilot — plain text only, no branding */}
          <div className="flex items-center gap-1.5">
            <Stars rating={4.7} color="text-secondary" />
            <span className="text-xs text-text-light">4.7 on Trustpilot · <span className="text-dark font-semibold">746 reviews</span></span>
          </div>

          <div className="hidden sm:block w-px h-4 bg-border" />

          {/* Google */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-xs font-bold text-dark">Google</span>
            <Stars rating={4.4} color="text-[#FBBC05]" />
            <span className="text-xs text-text-light font-medium">4.4 · <span className="text-dark font-semibold">479 reviews</span></span>
          </div>

          <div className="hidden sm:block w-px h-4 bg-border" />

          {/* FreeAgent Platinum Partner */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px] font-black" style={{ background: "#E6007E" }}>F</span>
            <span className="text-xs font-semibold text-dark">FreeAgent</span>
            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-full">Platinum Partner</span>
          </div>

          <div className="hidden sm:block w-px h-4 bg-border" />

          {/* FCSA Accredited */}
          <a
            href="https://www.fcsa.org.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            aria-label="FCSA Accredited"
          >
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="#1A3A6B" />
            </svg>
            <span className="text-xs font-semibold text-dark">FCSA Accredited</span>
          </a>

        </div>
      </div>
    </div>
  );
}
