import type { BrandConfig } from "@/lib/constants";

/**
 * Shared Clerk `<SignIn/>` and `<SignUp/>` appearance config.
 *
 * Centralised so the sign-in and sign-up pages stay visually identical and a
 * single tweak updates both. Brand-aware: pulls primary colour, font, and
 * text colours from the active brand at render-time.
 *
 * Tailwind classes are mapped onto Clerk's internal element keys
 * (see https://clerk.com/docs/customization/elements-and-variables).
 */
export function getPortalClerkAppearance(brand: BrandConfig) {
  return {
    variables: {
      colorPrimary: brand.colors.primary,
      colorText: brand.colors.text,
      colorTextSecondary: brand.colors.textLight,
      colorBackground: "#ffffff",
      colorInputBackground: "#ffffff",
      colorInputText: brand.colors.text,
      colorDanger: "#dc2626",
      colorSuccess: "#059669",
      colorWarning: "#d97706",
      borderRadius: "0.75rem",
      fontFamily: brand.font.family + ", system-ui, sans-serif",
      fontSize: "0.95rem",
      spacingUnit: "1rem",
    },
    elements: {
      // Wrappers
      rootBox: "w-full",
      card: "shadow-xl border border-neutral-200 rounded-2xl bg-white px-8 py-7",

      // Clerk owns the heading so it stays in step with the current screen
      // (e.g. "Sign in" → "Check your email" → "Enter verification code").
      // A static heading outside the card can't do that, and leaves the
      // verification step with no instruction above the code input.
      header: "mb-5 text-left",
      headerTitle: "text-2xl font-bold tracking-tight text-text",
      headerSubtitle: "mt-1 text-sm text-text-light",

      // OAuth / social row (Continue with Google etc.)
      socialButtonsBlockButton:
        "border border-neutral-200 rounded-xl py-2.5 hover:border-neutral-400 hover:bg-neutral-50 transition shadow-none",
      socialButtonsBlockButtonText: "font-semibold text-sm text-neutral-800",
      socialButtonsProviderIcon: "h-4 w-4",

      // OR divider
      dividerRow: "my-5",
      dividerLine: "bg-neutral-200",
      dividerText:
        "text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 px-3",

      // Form fields
      formField: "mb-3",
      formFieldLabelRow: "mb-1.5",
      formFieldLabel:
        "text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-600",
      formFieldHintText: "text-xs text-neutral-500",
      formFieldInput:
        "rounded-xl border border-neutral-200 px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition",
      formFieldInputShowPasswordButton: "text-neutral-400 hover:text-neutral-700",
      formFieldErrorText: "text-xs text-red-600 mt-1",

      // "Last used" / identity preview pills
      identityPreview:
        "rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-2.5",
      identityPreviewText: "text-sm text-neutral-700",
      identityPreviewEditButtonIcon: "text-primary",
      formFieldAction:
        "text-xs font-semibold text-primary hover:text-primary-dark",
      badge:
        "inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-emerald-200",

      // Submit button — clean, no arrow
      formButtonPrimary:
        "rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold py-3 shadow-sm transition normal-case tracking-normal",
      formButtonPrimaryArrow: "hidden",

      // Resend link, "edit", inline links
      formResendCodeLink:
        "text-sm font-medium text-primary hover:text-primary-dark",

      // Footer ("Don't have an account?") + Clerk branding
      footer: "bg-transparent border-0 px-0 pb-0 pt-4",
      footerAction: "text-sm text-neutral-600",
      footerActionText: "text-sm text-neutral-600",
      footerActionLink:
        "text-sm font-semibold text-primary hover:text-primary-dark",
      // "Secured by Clerk" — hidden in production, the dev-mode badge below
      // it stays so we know we're not yet on prod Clerk
      logoBox: "hidden",
      footerPages: "hidden",
      poweredByClerk: "hidden",
    },
    layout: {
      socialButtonsPlacement: "top" as const,
      socialButtonsVariant: "blockButton" as const,
      showOptionalFields: false,
    },
  };
}

/**
 * Immersive variant for the native-app sign-in — the Clerk widget dissolves
 * into the branded gradient: transparent card (no white box), glassy inputs,
 * white text, a solid white submit button. Used on the full-bleed app login.
 */
export function getPortalClerkAppearanceImmersive(brand: BrandConfig) {
  return {
    variables: {
      colorPrimary: "#ffffff",
      colorText: "#ffffff",
      colorTextSecondary: "rgba(255,255,255,0.72)",
      colorBackground: "transparent",
      colorInputBackground: "rgba(255,255,255,0.10)",
      colorInputText: "#ffffff",
      colorDanger: "#fecaca",
      colorSuccess: "#a7f3d0",
      colorWarning: "#fde68a",
      borderRadius: "0.75rem",
      fontFamily: brand.font.family + ", system-ui, sans-serif",
      fontSize: "0.95rem",
      spacingUnit: "1rem",
    },
    elements: {
      rootBox: "w-full",
      cardBox: "bg-transparent shadow-none border-0",
      card: "bg-transparent shadow-none border-0 rounded-none px-0 py-0",

      header: "mb-6 text-center",
      headerTitle: "text-2xl font-bold tracking-tight text-white",
      headerSubtitle: "mt-1.5 text-sm text-white/70",

      socialButtonsBlockButton:
        "border border-white/20 bg-white/10 rounded-xl py-2.5 hover:bg-white/15 transition shadow-none",
      socialButtonsBlockButtonText: "font-semibold text-sm text-white",
      socialButtonsProviderIcon: "h-4 w-4",

      dividerRow: "my-5",
      dividerLine: "bg-white/20",
      dividerText:
        "text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 px-3",

      formField: "mb-3",
      formFieldLabelRow: "mb-1.5",
      formFieldLabel:
        "text-[11px] font-bold uppercase tracking-[0.08em] text-white/70",
      formFieldHintText: "text-xs text-white/55",
      formFieldInput:
        "rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/25 focus:border-white/40 outline-none transition",
      formFieldInputShowPasswordButton: "text-white/50 hover:text-white",
      formFieldErrorText: "text-xs text-red-200 mt-1",

      identityPreview:
        "rounded-xl border border-white/20 bg-white/10 px-4 py-2.5",
      identityPreviewText: "text-sm text-white/90",
      identityPreviewEditButtonIcon: "text-white",
      formFieldAction: "text-xs font-semibold text-white hover:text-white/80",
      badge:
        "inline-flex items-center rounded-full bg-white/15 text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-white/20",

      formButtonPrimary:
        "rounded-xl bg-white text-primary-dark hover:bg-white/90 font-semibold py-3 shadow-sm transition normal-case tracking-normal",
      formButtonPrimaryArrow: "hidden",

      formResendCodeLink: "text-sm font-medium text-white hover:text-white/80",

      footer: "bg-transparent border-0 px-0 pb-0 pt-4",
      footerAction: "text-sm text-white/70",
      footerActionText: "text-sm text-white/70",
      footerActionLink: "text-sm font-semibold text-white hover:text-white/80",
      logoBox: "hidden",
      footerPages: "hidden",
      poweredByClerk: "hidden",
    },
    layout: {
      socialButtonsPlacement: "top" as const,
      socialButtonsVariant: "blockButton" as const,
      showOptionalFields: false,
    },
  };
}
