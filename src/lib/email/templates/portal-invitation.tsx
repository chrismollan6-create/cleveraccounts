import {
  Body,
  Button,
  Column,
  Container,
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
 * Portal invitation email — sent when a client first gets access.
 *
 * Design language inspired by Stripe / Mercury / Linear transactional emails:
 * generous whitespace, a visually-distinct hero with the headline inside it,
 * icon-led feature rows, a single prominent CTA, restrained footer. All
 * email-client safe: inline CSS, table-based layout (handled by React Email),
 * no flex/grid, no SVG (uses unicode tile labels for icons).
 *
 * Brand-aware: header band uses brand.colors.primary, supportEmail used as
 * Reply-To at the mailer level, accountant name optional but personalises
 * the body when provided.
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

  return (
    <Html lang="en">
      <Head />
      <Preview>
        Your {brand.name} portal is ready — finish setup in 90 seconds.
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.outer}>
          {/* ─── HERO ─────────────────────────────────────────── */}
          <Section
            style={{
              ...styles.hero,
              background: `linear-gradient(135deg, ${brand.colors.primaryDark} 0%, ${brand.colors.primary} 100%)`,
            }}
          >
            <Img
              src={`https://${brand.appDomain}${brand.assets.logo}`}
              width="120"
              height="32"
              alt={brand.name}
              style={styles.heroLogo}
            />
            <Text style={styles.heroEyebrow}>YOUR CLIENT PORTAL</Text>
            <Heading style={styles.heroHeading}>
              Welcome, {greetingName}.
            </Heading>
            <Text style={styles.heroSub}>
              Your {brand.name} access is ready. Setup takes about 90 seconds.
            </Text>
          </Section>

          {/* ─── BODY ─────────────────────────────────────────── */}
          <Section style={styles.bodyPad}>
            {/* Accountant credit */}
            {accountantName && (
              <Section
                style={{
                  ...styles.accountantChip,
                  borderLeftColor: brand.colors.primary,
                }}
              >
                <Row>
                  <Column style={styles.accountantInitials}>
                    <Text
                      style={{
                        ...styles.accountantInitialsText,
                        backgroundColor: brand.colors.primary,
                      }}
                    >
                      {initialsOf(accountantName)}
                    </Text>
                  </Column>
                  <Column>
                    <Text style={styles.accountantLabel}>YOUR ACCOUNTANT</Text>
                    <Text style={styles.accountantName}>{accountantName}</Text>
                  </Column>
                </Row>
              </Section>
            )}

            {/* Intro */}
            <Text style={styles.bodyPara}>
              {accountantName ? `${accountantName} has` : "Your accountant has"}{" "}
              set up your access to the{" "}
              <strong style={{ color: brand.colors.primary }}>
                {brand.name}
              </strong>{" "}
              client portal — the place where you&apos;ll see where you are in
              onboarding, book calls, sign documents, and message us. All in
              one place.
            </Text>

            <Text style={styles.bodyPara}>
              Click below to get started — no password needed.
            </Text>

            {/* CTA — big, centred, prominent */}
            <Section style={styles.ctaWrap}>
              <Button
                href={inviteUrl}
                style={{
                  ...styles.cta,
                  background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.primaryDark} 100%)`,
                }}
              >
                Set up my access →
              </Button>
            </Section>

            {/* Time + security pills row */}
            <Row style={styles.metaRow}>
              <Column align="center">
                <Text style={styles.metaPill}>
                  ⏱  About 90 seconds
                </Text>
              </Column>
              <Column align="center">
                <Text style={styles.metaPill}>
                  🔒  Secure passwordless sign-in
                </Text>
              </Column>
            </Row>

            <Hr style={styles.divider} />

            {/* What's inside — icon-led tiles */}
            <Text style={styles.sectionLabel}>ONCE YOU&apos;RE IN</Text>

            <Row style={{ marginBottom: "10px" }}>
              <Column style={styles.iconCell}>
                <div
                  style={{
                    ...styles.iconTile,
                    backgroundColor: `${brand.colors.primary}15`,
                    color: brand.colors.primary,
                  }}
                >
                  📅
                </div>
              </Column>
              <Column style={styles.featureTextCell}>
                <Text style={styles.featureTitle}>Book calls directly</Text>
                <Text style={styles.featureSub}>
                  Pick a time with your accountant — no email back-and-forth.
                </Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: "10px" }}>
              <Column style={styles.iconCell}>
                <div
                  style={{
                    ...styles.iconTile,
                    backgroundColor: `${brand.colors.primary}15`,
                    color: brand.colors.primary,
                  }}
                >
                  ✍️
                </div>
              </Column>
              <Column style={styles.featureTextCell}>
                <Text style={styles.featureTitle}>
                  Sign documents in-app
                </Text>
                <Text style={styles.featureSub}>
                  Engagement letter, ID verification, all paperless.
                </Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: "10px" }}>
              <Column style={styles.iconCell}>
                <div
                  style={{
                    ...styles.iconTile,
                    backgroundColor: `${brand.colors.primary}15`,
                    color: brand.colors.primary,
                  }}
                >
                  💬
                </div>
              </Column>
              <Column style={styles.featureTextCell}>
                <Text style={styles.featureTitle}>
                  Message us anytime
                </Text>
                <Text style={styles.featureSub}>
                  Threads stay neat — your accountant always has context.
                </Text>
              </Column>
            </Row>

            <Row>
              <Column style={styles.iconCell}>
                <div
                  style={{
                    ...styles.iconTile,
                    backgroundColor: `${brand.colors.primary}15`,
                    color: brand.colors.primary,
                  }}
                >
                  📱
                </div>
              </Column>
              <Column style={styles.featureTextCell}>
                <Text style={styles.featureTitle}>Works on any device</Text>
                <Text style={styles.featureSub}>
                  Desktop, tablet, phone — sign in once, stay signed in.
                </Text>
              </Column>
            </Row>

            <Hr style={styles.divider} />

            {/* Fallback link */}
            <Text style={styles.fallbackTitle}>
              Trouble with the button?
            </Text>
            <Text style={styles.fallbackText}>
              Copy and paste this link into your browser:
            </Text>
            <Link href={inviteUrl} style={styles.fallbackLink}>
              {inviteUrl}
            </Link>
          </Section>

          {/* ─── FOOTER ───────────────────────────────────────── */}
          <Section style={styles.footer}>
            <Text style={styles.footerSec}>
              This link works for the next <strong>7 days</strong> and can only
              be used once. If you weren&apos;t expecting this email, you can
              safely ignore it — no account will be created.
            </Text>
            <Hr style={styles.footerHr} />
            <Text style={styles.footerOrg}>
              <strong>{brand.legalName}</strong>
              <br />
              {brand.postalAddress}
            </Text>
            <Text style={styles.footerLinks}>
              <Link
                href={`mailto:${brand.supportEmail}`}
                style={styles.footerLink}
              >
                {brand.supportEmail}
              </Link>
              {"  ·  "}
              <Link
                href={`https://${brand.domain}`}
                style={styles.footerLink}
              >
                {brand.domain}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
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

const styles = {
  body: {
    backgroundColor: "#f1f5f9",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: "32px 16px",
  },
  outer: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    margin: "0 auto",
    maxWidth: "560px",
    overflow: "hidden" as const,
    boxShadow:
      "0 10px 25px -10px rgba(15, 23, 42, 0.10), 0 4px 10px -4px rgba(15, 23, 42, 0.05)",
  },

  // Hero
  hero: {
    padding: "44px 40px 48px",
    textAlign: "center" as const,
  },
  heroLogo: {
    height: "32px",
    width: "auto",
    margin: "0 auto 36px",
    filter: "brightness(0) invert(1)" as const, // forces logo to white (root colour is teal)
  },
  heroEyebrow: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    margin: "0 0 12px",
    textTransform: "uppercase" as const,
  },
  heroHeading: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    margin: "0 0 12px",
  },
  heroSub: {
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: "15px",
    lineHeight: 1.55,
    margin: 0,
    maxWidth: "420px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  // Body
  bodyPad: { padding: "36px 40px 24px" },

  // Accountant chip
  accountantChip: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderLeft: "3px solid",
    borderRadius: "8px",
    marginBottom: "24px",
    padding: "12px 16px",
  },
  accountantInitials: { width: "44px" },
  accountantInitialsText: {
    borderRadius: "999px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "12px",
    fontWeight: 700,
    height: "32px",
    lineHeight: "32px",
    margin: 0,
    textAlign: "center" as const,
    width: "32px",
  },
  accountantLabel: {
    color: "#64748b",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  accountantName: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 600,
    margin: "2px 0 0",
  },

  bodyPara: {
    color: "#334155",
    fontSize: "15px",
    lineHeight: 1.6,
    margin: "0 0 16px",
  },

  // CTA
  ctaWrap: {
    margin: "32px 0 18px",
    textAlign: "center" as const,
  },
  cta: {
    borderRadius: "10px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "0.01em",
    padding: "15px 36px",
    textDecoration: "none",
    boxShadow: "0 4px 12px -2px rgba(15, 23, 42, 0.2)",
  },

  // Meta row under CTA
  metaRow: { margin: "0 0 8px" },
  metaPill: {
    color: "#64748b",
    fontSize: "12px",
    margin: 0,
    padding: "4px 0",
  },

  divider: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "28px 0",
  },

  // Section labels
  sectionLabel: {
    color: "#0f172a",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    margin: "0 0 18px",
    textTransform: "uppercase" as const,
  },

  // Feature rows
  iconCell: { width: "48px", verticalAlign: "top" as const, paddingTop: "2px" },
  iconTile: {
    borderRadius: "8px",
    fontSize: "18px",
    height: "36px",
    lineHeight: "36px",
    textAlign: "center" as const,
    width: "36px",
  },
  featureTextCell: { paddingLeft: "4px", verticalAlign: "top" as const },
  featureTitle: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1.4,
    margin: "0 0 2px",
  },
  featureSub: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
    margin: 0,
  },

  // Fallback link
  fallbackTitle: {
    color: "#0f172a",
    fontSize: "12px",
    fontWeight: 600,
    margin: "0 0 4px",
  },
  fallbackText: {
    color: "#64748b",
    fontSize: "12px",
    margin: "0 0 8px",
  },
  fallbackLink: {
    color: "#64748b",
    fontSize: "11px",
    wordBreak: "break-all" as const,
  },

  // Footer
  footer: {
    backgroundColor: "#f8fafc",
    padding: "28px 40px",
  },
  footerSec: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.6,
    margin: "0 0 16px",
  },
  footerHr: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "16px 0",
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
