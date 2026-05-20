import {
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { BrandConfig } from "@/lib/constants";

/**
 * Portal invitation email — Outlook-safe redesign.
 *
 * Microsoft Outlook on Windows uses Word's rendering engine, not a browser.
 * That means NO CSS gradients, NO filters, NO max-width on divs, NO modern
 * CSS — anything outside HTML 4.01 + basic inline styles on tables is at
 * best ignored, at worst breaks the layout.
 *
 * This template follows the email-safe rules:
 *   · Solid background colours only (no gradients)
 *   · 600px fixed width on the outer wrapper
 *   · Table-based "bulletproof button" pattern for the CTA
 *   · No CSS filters — uses pre-coloured assets where needed
 *   · Icon tiles via table cells, not divs
 *   · Inline styles only, no <style> blocks (React Email inlines anyway)
 *
 * Brand-aware via the `brand` prop. Tested mentally against Outlook 365
 * desktop, Outlook web, Gmail web, Gmail mobile, Apple Mail, iOS Mail.
 */

export interface PortalInvitationEmailProps {
  brand: BrandConfig;
  firstName: string | null;
  /** The redemption URL — already includes __clerk_ticket. */
  inviteUrl: string;
  /** Optional accountant name to make it personal. */
  accountantName?: string | null;
}

export default function PortalInvitationEmail({
  brand,
  firstName,
  inviteUrl,
  accountantName,
}: PortalInvitationEmailProps) {
  const greetingName = firstName ?? "there";
  const primary = brand.colors.primary;
  const accountantFirst = accountantName?.split(" ")[0];

  return (
    <Html lang="en">
      <Head>
        {/* Mobile-friendly viewport + responsive scale-up.
            iOS Mail and Gmail mobile honour these. */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
        {/* eslint-disable-next-line react/no-danger */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media only screen and (max-width: 600px) {
                .email-outer { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
                .email-hero { padding: 36px 24px !important; }
                .email-hero-heading { font-size: 26px !important; }
                .email-body { padding: 24px 20px !important; font-size: 16px !important; }
                .email-para { font-size: 16px !important; line-height: 1.55 !important; }
                .email-feat-title { font-size: 15px !important; }
                .email-feat-sub { font-size: 14px !important; }
                .email-footer { padding: 20px !important; }
                .email-cta-link { font-size: 16px !important; }
              }
            `,
          }}
        />
      </Head>
      <Preview>
        Your {brand.name} portal is ready — finish setup in 90 seconds.
      </Preview>
      {/* Using raw <body> instead of React Email's <Body> — Body wraps content
          in a 100%-width table which Outlook's Word renderer can interpret as
          the email's actual width, ignoring our 600px inner constraint. By
          using a plain <body> element and putting our 600px table as a direct
          child, the outermost frame Outlook sees IS the 600px table.
          MSO conditional wrapper is injected by portal-mailer.ts post-render. */}
      <body style={s.body}>
        <table
          role="presentation"
          align="center"
          width="600"
          cellPadding="0"
          cellSpacing="0"
          border={0}
          className="email-outer"
          style={s.outer}
        >
          <tbody>
            <tr>
              {/* Explicit width="600" is critical: Word's renderer interprets
                  a nested width="100%" table as 100% OF THE PAGE unless its
                  parent <td> has a fixed pixel width. Without this, every
                  inner Section table blows out to full window width. */}
              <td width="600" style={{ width: "600px", padding: 0 }}>
          {/* ─── HEADER — white, standard full-colour logo ──────────── */}
          <Section className="email-hero" style={s.hero}>
            <Img
              src={`https://${brand.appDomain}${brand.assets.logo}`}
              width="150"
              height="40"
              alt={brand.name}
              style={s.heroLogo}
            />
          </Section>

          {/* ─── BODY ────────────────────────────────────────────── */}
          <Section className="email-body" style={s.bodyPad}>
            {/* Title block */}
            <Text style={{ ...s.eyebrow, color: primary }}>
              YOUR CLIENT PORTAL
            </Text>
            <Heading className="email-hero-heading" style={s.heading}>
              Welcome, {greetingName}.
            </Heading>

            {/* Intro */}
            <Text className="email-para" style={s.bodyParaFirst}>
              Hi {greetingName},
            </Text>
            <Text className="email-para" style={s.bodyPara}>
              {accountantFirst ?? "Your accountant"} has set up your access to
              the {`${brand.name} client portal`}. It&apos;s where you&apos;ll
              see your onboarding progress, book calls, sign documents, and
              message us — all in one place.
            </Text>

            {/* Accountant line — clean, no initials badge (border-radius
                doesn't render in Outlook). Brand-coloured left rule. */}
            {accountantName && (
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{ margin: "20px 0" }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        borderLeft: `3px solid ${primary}`,
                        paddingLeft: "14px",
                      }}
                    >
                      <Text style={s.acctLabel}>YOUR ACCOUNTANT</Text>
                      <Text style={s.acctName}>{accountantName}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            <Text className="email-para" style={s.bodyParaFirst}>
              Setting up takes about 90 seconds — no password needed.
            </Text>

            {/* ─── BULLETPROOF CTA BUTTON ────────────────────────
                Table-based pattern that Outlook renders correctly.
                NO gradients, just solid background colour. ─── */}
            <table
              role="presentation"
              cellSpacing="0"
              cellPadding="0"
              border={0}
              align="center"
              style={{ margin: "28px auto 12px" }}
            >
              <tbody>
                <tr>
                  <td
                    align="center"
                    // Legacy bgcolor attribute is needed for Outlook desktop,
                    // which ignores CSS background on table cells. TS types
                    // dropped it years ago — spread bypasses the check.
                    {...({ bgcolor: primary } as Record<string, string>)}
                    style={{
                      backgroundColor: primary,
                      borderRadius: "8px",
                      padding: "14px 36px",
                    }}
                  >
                    <a
                      href={inviteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="email-cta-link"
                      style={{
                        color: "#ffffff",
                        display: "inline-block",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        lineHeight: "1.2",
                        textDecoration: "none",
                      }}
                    >
                      Set up my access
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <Hr style={s.divider} />

            {/* What's inside — clean list, no emoji. Each row is a bold
                title + grey sub, separated by thin rules. */}
            <Text style={s.sectionLabel}>ONCE YOU&apos;RE IN</Text>

            <FeatureRow
              primary={primary}
              title="Book calls directly"
              sub="Pick a time with your accountant — no email back-and-forth."
            />
            <FeatureRow
              primary={primary}
              title="Sign documents in-app"
              sub="Engagement letter, ID verification, all paperless."
            />
            <FeatureRow
              primary={primary}
              title="Message us anytime"
              sub="Threads stay neat — your accountant always has context."
            />
            <FeatureRow
              primary={primary}
              title="Works on any device"
              sub="Desktop, tablet, phone — sign in once, stay signed in."
              last
            />

            <Hr style={s.divider} />

            {/* Fallback link — the visible TEXT must stay short. The invite
                URL contains a 600+ char Clerk JWT; rendering it as visible
                text forces Outlook's Word renderer (no word-break support)
                to blow the whole email out to full window width. Short link
                text keeps the long URL safely in the href only. */}
            <Text style={s.fallbackText}>
              Button not working?{" "}
              <Link href={inviteUrl} style={s.fallbackLink}>
                Click here to set up your access
              </Link>
              .
            </Text>
          </Section>

          {/* ─── FOOTER ──────────────────────────────────────────── */}
          <Section className="email-footer" style={s.footer}>
            <Text style={s.footerSec}>
              This link works for the next{" "}
              <strong>7 days</strong>
              {" "}and can only be used once. If you weren&apos;t expecting
              this email, you can safely ignore it — no account will be
              created.
            </Text>
            <Hr style={s.footerHr} />
            <Text style={s.footerOrg}>
              <strong>{brand.legalName}</strong>
              <br />
              {brand.postalAddress}
            </Text>
            <Text style={s.footerLinks}>
              <Link
                href={`mailto:${brand.supportEmail}`}
                style={s.footerLink}
              >
                {brand.supportEmail}
              </Link>
              {"  ·  "}
              <Link href={`https://${brand.domain}`} style={s.footerLink}>
                {brand.domain}
              </Link>
            </Text>
          </Section>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </Html>
  );
}

/** Feature row — clean text row: brand-coloured marker cell + title + sub.
 *  No emoji (renders inconsistently across clients and looks amateur). Thin
 *  rule between rows via borderBottom, suppressed on the last row. */
function FeatureRow({
  primary,
  title,
  sub,
  last,
}: {
  primary: string;
  title: string;
  sub: string;
  last?: boolean;
}) {
  return (
    <table
      role="presentation"
      width="100%"
      cellSpacing="0"
      cellPadding="0"
      border={0}
    >
      <tbody>
        <tr>
          {/* Marker cell — a short brand-coloured vertical bar */}
          <td
            width="20"
            style={{
              verticalAlign: "top",
              paddingTop: "5px",
              paddingBottom: last ? "0" : "14px",
            }}
          >
            <table role="presentation" cellSpacing="0" cellPadding="0" border={0}>
              <tbody>
                <tr>
                  <td
                    {...({ bgcolor: primary } as Record<string, string>)}
                    style={{
                      backgroundColor: primary,
                      width: "8px",
                      height: "8px",
                      fontSize: "0",
                      lineHeight: "0",
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td
            style={{
              verticalAlign: "top",
              paddingBottom: last ? "0" : "14px",
              borderBottom: last ? "none" : "1px solid #eef1f5",
            }}
          >
            <Text className="email-feat-title" style={s.featTitle}>
              {title}
            </Text>
            <Text className="email-feat-sub" style={s.featSub}>
              {sub}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
// Email-safe: no gradients, no filters, no flexbox/grid, no CSS variables,
// no max-width on divs (use explicit width on tables instead).

const s = {
  body: {
    backgroundColor: "#f1f5f9",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: "32px 16px",
    width: "100%",
  },
  outer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    margin: "0 auto",
    width: "600px",
    maxWidth: "600px",
    // The `width="600"` HTML attribute on the <table> is what Outlook
    // respects — CSS width here is for Webmail/Apple Mail.
  },

  // Header — white, standard full-colour logo, subtle bottom rule
  hero: {
    padding: "32px 40px 28px",
    textAlign: "center" as const,
    borderBottom: "1px solid #eef1f5",
  },
  heroLogo: {
    height: "40px",
    width: "auto",
    margin: "0 auto",
  },

  bodyPad: { padding: "32px 40px 24px" },

  // Title block
  eyebrow: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    margin: "0 0 8px",
    textTransform: "uppercase" as const,
    // color set inline from brand.colors.primary
  },
  heading: {
    color: "#0f172a",
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: 1.15,
    margin: "0 0 4px",
  },

  // Accountant line (brand-coloured left rule, no badge)
  acctLabel: {
    color: "#64748b",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  acctName: {
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: 600,
    margin: "2px 0 0",
  },

  bodyPara: {
    color: "#334155",
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "0 0 14px",
  },
  // First paragraph after the heading — extra top margin for breathing room.
  bodyParaFirst: {
    color: "#334155",
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "20px 0 14px",
  },

  divider: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "26px 0",
  },

  sectionLabel: {
    color: "#0f172a",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    margin: "0 0 14px",
    textTransform: "uppercase" as const,
  },

  featTitle: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1.4,
    margin: "0 0 2px",
  },
  featSub: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
    margin: 0,
  },

  fallbackText: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
    margin: "0",
  },
  fallbackLink: {
    color: "#1A7A9B",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "underline",
  },

  footer: {
    backgroundColor: "#f8fafc",
    padding: "24px 40px",
  },
  footerSec: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.55,
    margin: "0 0 14px",
  },
  footerHr: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "14px 0",
  },
  footerOrg: {
    color: "#475569",
    fontSize: "11px",
    lineHeight: 1.55,
    margin: "0 0 6px",
  },
  footerLinks: {
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: 1.55,
    margin: 0,
  },
  footerLink: {
    color: "#64748b",
    textDecoration: "none",
  },
};
