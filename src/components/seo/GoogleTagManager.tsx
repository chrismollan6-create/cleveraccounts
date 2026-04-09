"use client";

import Script from "next/script";

// Replace GTM-XXXXXXX with your actual GTM container ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export function GoogleTagManagerHead() {
  if (!GTM_ID) return null;

  return (
    <Script
      id="gtm-head"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
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
}

// Get stored UTM params (for passing to forms/sign-up)
export function getStoredUTMParams(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("ca_utm_params");
  return stored ? JSON.parse(stored) : null;
}
