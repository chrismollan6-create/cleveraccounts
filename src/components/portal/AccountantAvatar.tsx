"use client";

import { useState } from "react";

/**
 * Accountant avatar.
 *
 * Loads the real Salesforce profile photo via the `/api/portal/accountant-photo`
 * proxy (the raw SF URL is auth-gated and would 403 in an <img>).
 *
 * Fallback strategy: initials are the ALWAYS-RENDERED base, and the photo is
 * layered on top revealed only once it successfully loads (`onLoad`). We
 * intentionally rely on the success event, not `onError` — an <img> that 404s
 * before React hydrates fires `onError` while nothing is listening, so an
 * onError-based fallback silently fails and you get a broken-image icon. With
 * this approach a photo that never loads simply stays invisible and the
 * initials show through. Never broken.
 */
export default function AccountantAvatar({
  name,
  hasPhoto,
  sizeClass = "h-10 w-10",
  textClass = "text-xs",
}: {
  name: string | null;
  hasPhoto: boolean;
  sizeClass?: string;
  textClass?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  const init =
    (name ?? "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "··";

  return (
    <div className={`relative ${sizeClass}`}>
      {/* Initials base — always present underneath. */}
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark ${textClass} font-bold text-white`}
      >
        {init}
      </div>

      {/* Real photo — revealed only on a genuine successful load. */}
      {hasPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/api/portal/accountant-photo"
          alt={name ?? "Your accountant"}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth > 0) setLoaded(true);
          }}
          className={`absolute inset-0 h-full w-full rounded-full object-cover transition-opacity duration-200 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
