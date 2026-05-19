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

      // We provide our own heading outside the card — hide Clerk's
      header: "hidden",
      headerTitle: "hidden",
      headerSubtitle: "hidden",

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
