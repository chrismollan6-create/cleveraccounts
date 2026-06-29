"use client";

/**
 * Footer link that re-opens the cookie consent banner so visitors can change or
 * withdraw their choice at any time (PECR/ICO: withdrawing consent must be as
 * easy as giving it). CookieConsent listens for the "open-cookie-settings"
 * event. Inherits styling via className so it matches the surrounding links.
 */
export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
