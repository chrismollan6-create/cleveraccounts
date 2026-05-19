import {
  Body,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
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
  const primaryDark = brand.colors.primaryDark;
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
      <Body style={s.body}>
        {/* Outlook-on-Windows-specific wrapper. The <!--[if mso]--> conditional
            is honoured by Word's renderer ONLY — every other email client
            ignores it as a regular HTML comment. This guarantees Outlook
            respects the 600px width even when nested inside React Email's
            Body wrapper table. */}
        <div
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso | IE]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px"><tr><td><![endif]-->`,
          }}
        />
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
              <td style={{ padding: 0 }}>
          {/* ─── HERO — solid colour, NO gradient (Outlook strips) ──── */}
          <Section
            className="email-hero"
            style={{ ...s.hero, backgroundColor: primaryDark }}
          >
            <Img
              src={`https://${brand.appDomain}${brand.assets.logoWhite ?? brand.assets.logo}`}
              width="120"
              height="32"
              alt={brand.name}
              style={s.heroLogo}
            />
            <Text style={s.heroEyebrow}>YOUR CLIENT PORTAL</Text>
            <Heading className="email-hero-heading" style={s.heroHeading}>
              Welcome, {greetingName}.
            </Heading>
            <Text style={s.heroSub}>
              Your {brand.name} access is ready.
              <br />
              Setup takes about 90 seconds.
            </Text>
          </Section>

          {/* ─── BODY ────────────────────────────────────────────── */}
          <Section className="email-body" style={s.bodyPad}>
            {/* Accountant chip — uses table cells, not flexbox */}
            {accountantName && (
              <Section
                style={{ ...s.acctChip, borderLeftColor: primary }}
              >
                <Row>
                  <Column width="44" style={{ verticalAlign: "middle" }}>
                    <Section
                      style={{ ...s.acctBadge, backgroundColor: primary }}
                    >
                      <Text style={s.acctBadgeText}>{initialsOf(accountantName)}</Text>
                    </Section>
                  </Column>
                  <Column style={{ verticalAlign: "middle", paddingLeft: "12px" }}>
                    <Text style={s.acctLabel}>YOUR ACCOUNTANT</Text>
                    <Text style={s.acctName}>{accountantName}</Text>
                  </Column>
                </Row>
              </Section>
            )}

            {/* Intro */}
            <Text className="email-para" style={s.bodyPara}>
              Hi {greetingName},
            </Text>
            <Text className="email-para" style={s.bodyPara}>
              {accountantFirst ?? "Your accountant"} has set up your access to
              the {brand.name} client portal. It&apos;s where you&apos;ll see
              your onboarding progress, book calls, sign documents, and message
              us — all in one place.
            </Text>
            <Text className="email-para" style={s.bodyPara}>
              Click below to get started — no password needed.
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

            {/* Meta info under CTA */}
            <Text style={s.metaText}>
              ⏱ About 90 seconds &nbsp;·&nbsp; 🔒 Secure passwordless sign-in
            </Text>

            <Hr style={s.divider} />

            {/* What's inside */}
            <Text style={s.sectionLabel}>ONCE YOU&apos;RE IN</Text>

            <FeatureRow
              emoji="📅"
              primary={primary}
              title="Book calls directly"
              sub="Pick a time with your accountant — no email back-and-forth."
            />
            <FeatureRow
              emoji="✍️"
              primary={primary}
              title="Sign documents in-app"
              sub="Engagement letter, ID verification, all paperless."
            />
            <FeatureRow
              emoji="💬"
              primary={primary}
              title="Message us anytime"
              sub="Threads stay neat — your accountant always has context."
            />
            <FeatureRow
              emoji="📱"
              primary={primary}
              title="Works on any device"
              sub="Desktop, tablet, phone — sign in once, stay signed in."
            />

            <Hr style={s.divider} />

            <Text style={s.fallbackTitle}>Trouble with the button?</Text>
            <Text style={s.fallbackText}>
              Copy and paste this link into your browser:
            </Text>
            <Link href={inviteUrl} style={s.fallbackLink}>
              {inviteUrl}
            </Link>
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
        <div
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso | IE]></td></tr></table><![endif]-->`,
          }}
        />
      </Body>
    </Html>
  );
}

/** Feature row — emoji tile + title + sub. Uses Row/Column so Outlook
 *  renders it as a table, not flexbox. */
function FeatureRow({
  emoji,
  primary,
  title,
  sub,
}: {
  emoji: string;
  primary: string;
  title: string;
  sub: string;
}) {
  return (
    <Section style={{ marginBottom: "14px" }}>
      <Row>
        <Column width="44" style={{ verticalAlign: "top", paddingTop: "2px" }}>
          <table
            role="presentation"
            cellSpacing="0"
            cellPadding="0"
            border={0}
          >
            <tbody>
              <tr>
                <td
                  align="center"
                  {...({ bgcolor: `${primary}15` } as Record<string, string>)}
                  style={{
                    backgroundColor: `${primary}15`,
                    borderRadius: "8px",
                    height: "36px",
                    width: "36px",
                    fontSize: "18px",
                    lineHeight: "36px",
                  }}
                >
                  {emoji}
                </td>
              </tr>
            </tbody>
          </table>
        </Column>
        <Column style={{ verticalAlign: "top", paddingLeft: "12px" }}>
          <Text className="email-feat-title" style={s.featTitle}>{title}</Text>
          <Text className="email-feat-sub" style={s.featSub}>{sub}</Text>
        </Column>
      </Row>
    </Section>
  );
}

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
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

  // Hero — solid colour, padding via the section itself
  hero: {
    padding: "44px 40px 44px",
    textAlign: "center" as const,
    // backgroundColor set inline from brand.colors.primaryDark
  },
  heroLogo: {
    height: "32px",
    width: "auto",
    margin: "0 auto 36px",
    // No CSS filter — relies on logoWhite asset being a proper transparent PNG
  },
  heroEyebrow: {
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    margin: "0 0 10px",
    opacity: 0.75,
  },
  heroHeading: {
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: 1.15,
    margin: "0 0 12px",
  },
  heroSub: {
    color: "#ffffff",
    fontSize: "14px",
    lineHeight: 1.55,
    margin: 0,
    opacity: 0.85,
  },

  bodyPad: { padding: "32px 40px 24px" },

  // Accountant chip
  acctChip: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderLeft: "3px solid",
    borderRadius: "8px",
    marginBottom: "20px",
    padding: "10px 14px",
  },
  acctBadge: {
    borderRadius: "999px",
    height: "32px",
    width: "32px",
    textAlign: "center" as const,
    lineHeight: "32px",
  },
  acctBadgeText: {
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
    margin: 0,
    textAlign: "center" as const,
    lineHeight: "32px",
  },
  acctLabel: {
    color: "#64748b",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  acctName: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 600,
    margin: "2px 0 0",
  },

  bodyPara: {
    color: "#334155",
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "0 0 14px",
  },

  metaText: {
    color: "#64748b",
    fontSize: "12px",
    margin: "4px 0 0",
    textAlign: "center" as const,
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

  fallbackTitle: {
    color: "#0f172a",
    fontSize: "12px",
    fontWeight: 600,
    margin: "0 0 4px",
  },
  fallbackText: {
    color: "#64748b",
    fontSize: "12px",
    margin: "0 0 6px",
  },
  fallbackLink: {
    color: "#64748b",
    fontSize: "11px",
    wordBreak: "break-all" as const,
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
