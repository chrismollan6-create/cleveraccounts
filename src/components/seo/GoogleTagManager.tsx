import Script from "next/script";

// Replace GTM-XXXXXXX with your actual GTM container ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

// ─── Annual contract value by business type (used for value-based bidding) ───
// This tells Google Ads what a conversion is actually worth so Smart Bidding
// can bid more aggressively for Ltd/Contractor leads vs Sole Trader leads.
const LTV_MAP: Record<string, number> = {
  "Sole Trader":     510,   // £42.50 × 12
  "Freelancer":      510,
  "Landlord":        510,
  "CIS":             510,
  "Limited Company": 1254,  // £104.50 × 12
  "Contractor":      1254,
  "Startup":         1254,
};

export function getConversionValue(businessType: string): number {
  return LTV_MAP[businessType] ?? 510;
}

// ─── SHA-256 hash (for Enhanced Conversions) ─────────────────────────────────
// Google requires user data hashed with SHA-256 before sending.
async function sha256(value: string): Promise<string> {
  const normalised = value.trim().toLowerCase();
  const buffer = new TextEncoder().encode(normalised);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Enhanced Conversion tracking ────────────────────────────────────────────
// Fires after a lead is created. Hashes PII and sends to GTM dataLayer so
// Google Ads can match conversions to Google accounts — recovering 15–25% of
// conversions lost to ad blockers / iOS tracking prevention.
export async function trackEnhancedConversion(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  businessType: string;
}) {
  if (typeof window === "undefined") return;

  const value = getConversionValue(params.businessType);

  const [hashedEmail, hashedPhone, hashedFirst, hashedLast] = await Promise.all([
    sha256(params.email),
    sha256(params.phone.replace(/[\s()\-+]/g, "")),
    sha256(params.firstName),
    sha256(params.lastName),
  ]);

  // Push to GTM dataLayer — GTM Enhanced Conversions tag picks this up
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.dataLayer) {
    w.dataLayer.push({
      event: "enhanced_conversion",
      conversion_value: value,
      conversion_currency: "GBP",
      business_type: params.businessType,
      // Google's Enhanced Conversions variable names
      enhanced_conversion_data: {
        email: hashedEmail,
        phone_number: hashedPhone,
        first_name: hashedFirst,
        last_name: hashedLast,
      },
    });
  }

  // Also fire directly via gtag if loaded outside GTM
  if (typeof w.gtag === "function") {
    w.gtag("event", "conversion", {
      value,
      currency: "GBP",
      user_data: {
        email_address: hashedEmail,
        phone_number: hashedPhone,
        address: { first_name: hashedFirst, last_name: hashedLast },
      },
    });
  }
}

export function GoogleTagManagerHead() {
  return (
    <>
      {/* ── Consent Mode v2 — MUST run before GTM loads ──────────────────────
          Sets default consent to denied (UK/EEA legal requirement).
          Google models conversions from unconsented users, recovering 15-30%
          of otherwise invisible conversions. Updated when user accepts/declines
          via the cookie banner. */}
      <Script
        id="consent-mode-init"
        strategy="beforeInteractive"
      >
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            var existingConsent = '';
            try { existingConsent = localStorage.getItem('ca_cookie_consent') || ''; } catch(e) {}
            if (existingConsent === 'all') {
              gtag('consent', 'default', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted',
              });
            } else {
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'granted',
                'wait_for_update': 2000,
              });
            }
          `}
      </Script>
      {/* ── Google Tag Manager ──────────────────────────────────────────────── */}
      {GTM_ID && (
        <Script
          id="gtm-head"
          strategy="afterInteractive"
        >
          {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
        </Script>
      )}
    </>
  );
}

export function GoogleTagManagerBody() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

// Push events to GTM dataLayer for conversion tracking
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

// Track PPC conversions
export function trackConversion(conversionType: "sign_up" | "contact_form" | "phone_call" | "pricing_view") {
  trackEvent("conversion", {
    conversion_type: conversionType,
    page_url: typeof window !== "undefined" ? window.location.href : "",
    timestamp: new Date().toISOString(),
  });
}

// Capture UTM parameters from URL and store in sessionStorage
export function captureUTMParams() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid"];

  const utmData: Record<string, string> = {};
  let hasUTM = false;

  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmData[key] = value;
      hasUTM = true;
    }
  });

  if (hasUTM) {
    sessionStorage.setItem("ca_utm_params", JSON.stringify(utmData));
    sessionStorage.setItem("ca_landing_page", window.location.pathname);
    sessionStorage.setItem("ca_referrer", document.referrer || "direct");

    // Push to dataLayer for GTM
    trackEvent("utm_captured", utmData);
  }

  // ── GCLID: persist to localStorage so it survives tab switches and
  // is available for offline conversion import to Google Ads later.
  // This is the key that links a Salesforce closed-won back to the original click.
  const gclid = params.get("gclid");
  if (gclid) {
    try {
      localStorage.setItem("ca_gclid", gclid);
      localStorage.setItem("ca_gclid_ts", new Date().toISOString());
    } catch (e) { /* storage blocked */ }
  }

  // Capture referral code independently of UTM params — persists across navigation
  const ref = params.get("ref");
  if (ref) {
    sessionStorage.setItem("ca_referral_code", ref);
  }
}

// Get stored GCLID — used for offline conversion import
export function getGclid(): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem("ca_gclid"); } catch { return null; }
}

// Get stored UTM params (for passing to forms/sign-up)
export function getStoredUTMParams(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("ca_utm_params");
  return stored ? JSON.parse(stored) : null;
}

// Get stored referral code (for passing to sign-up lead creation)
export function getReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("ca_referral_code");
}
