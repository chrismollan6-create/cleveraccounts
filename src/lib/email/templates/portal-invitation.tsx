import {
  Body,
  Button,
  Container,
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
 * Portal invitation email — sent when a client first gets access.
 *
 * Renders as HTML compatible with Gmail, Outlook (incl. OWA), Apple Mail,
 * mobile clients. React Email handles the cross-client quirks (Outlook
 * desktop in particular). Inline CSS is required for email — React Email
 * does the inlining automatically at render time.
 *
 * Brand-aware: every visible style is derived from the `brand` prop, so the
 * same template renders correctly for Clever and Workwell.
 */

export interface PortalInvitationEmailProps {
  brand: BrandConfig;
  firstName: string | null;
  /** The redemption URL — already includes __clerk_ticket. */
  inviteUrl: string;
  /** Optional accountant name to make it feel personal ("Charlie has set up your access"). */
  accountantName?: string | null;
}

export default function PortalInvitationEmail({
  brand,
  firstName,
  inviteUrl,
  accountantName,
}: PortalInvitationEmailProps) {
  const greetingName = firstName ?? "there";
  const setupBy = accountantName
    ? `${accountantName} has set up your access to`
    : "Your accountant has set up your access to";

  return (
    <Html lang="en">
      <Head />
      <Preview>
        Your {brand.name} portal is ready — finish setup in 90 seconds.
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* ── Header — logo on brand colour ─────────────────── */}
          <Section
            style={{
              ...styles.header,
              backgroundColor: brand.colors.primary,
            }}
          >
            <Img
              src={`https://${brand.appDomain}${brand.assets.logo}`}
              width="140"
              height="36"
              alt={brand.name}
              style={styles.logo}
            />
          </Section>

          {/* ── Body ──────────────────────────────────────────── */}
          <Section style={styles.contentSection}>
            <Text style={styles.eyebrow}>YOUR CLIENT PORTAL</Text>
            <Heading style={styles.h1}>Welcome, {greetingName}.</Heading>

            <Text style={styles.paragraph}>
              {setupBy} the <strong>{brand.name}</strong> client portal — the
              place where you&apos;ll see where you are in onboarding, book
              calls with us, sign documents, and message us. All in one place.
            </Text>

            <Text style={styles.paragraph}>
              Setup takes about 90 seconds. Click below to get started — no
              password needed.
            </Text>

            {/* CTA button */}
            <Section style={styles.buttonWrap}>
              <Button
                href={inviteUrl}
                style={{
                  ...styles.button,
                  backgroundColor: brand.colors.primary,
                }}
              >
                Set up my access
              </Button>
            </Section>

            <Text style={styles.helperText}>
              Trouble with the button? Copy and paste this link into your
              browser:
              <br />
              <Link href={inviteUrl} style={styles.fallbackLink}>
                {inviteUrl}
              </Link>
            </Text>

            <Hr style={styles.hr} />

            {/* What's inside */}
            <Text style={styles.subHeading}>Once you&apos;re in</Text>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Meet your accountant and see their availability
              </li>
              <li style={styles.listItem}>
                Book your first call directly — no email back-and-forth
              </li>
              <li style={styles.listItem}>
                Sign your engagement letter and verify your identity
              </li>
              <li style={styles.listItem}>
                See everything in one place, on any device
              </li>
            </ul>
          </Section>

          {/* ── Footer ────────────────────────────────────────── */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              This link works for the next 7 days and can only be used once.
              If you weren&apos;t expecting this email, you can safely ignore
              it — no account will be created.
            </Text>
            <Hr style={styles.footerHr} />
            <Text style={styles.footerSmall}>
              <strong>{brand.legalName}</strong>
              <br />
              {brand.postalAddress}
              <br />
              <Link href={`mailto:${brand.supportEmail}`} style={styles.footerLink}>
                {brand.supportEmail}
              </Link>
              {" · "}
              <Link href={`https://${brand.domain}`} style={styles.footerLink}>
                {brand.domain}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
// Inline styles required for email clients. React Email handles inlining.

const styles = {
  body: {
    backgroundColor: "#f4f6fa",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: "40px 16px",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    margin: "0 auto",
    maxWidth: "600px",
    overflow: "hidden" as const,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
  },
  header: {
    padding: "32px 40px",
    textAlign: "center" as const,
  },
  logo: {
    height: "36px",
    width: "auto",
    margin: "0 auto",
    // White-ish via brightness filter — for email clients we can't apply
    // CSS filters, so the logo asset itself should be the white version.
    // The Clever brand falls back to the regular logo on dark — it'll look
    // a bit muddy until a transparent-PNG white logo is added at
    // /public/brand/clever/logo-white.png. Workwell has one already.
  },
  contentSection: {
    padding: "40px 40px 24px",
  },
  eyebrow: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    margin: "0 0 8px",
    textTransform: "uppercase" as const,
  },
  h1: {
    color: "#0f172a",
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: 1.2,
    margin: "0 0 16px",
  },
  paragraph: {
    color: "#334155",
    fontSize: "15px",
    lineHeight: 1.55,
    margin: "0 0 14px",
  },
  buttonWrap: {
    margin: "28px 0",
    textAlign: "center" as const,
  },
  button: {
    borderRadius: "10px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    padding: "14px 32px",
    textDecoration: "none",
  },
  helperText: {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: 1.5,
    margin: "0 0 24px",
  },
  fallbackLink: {
    color: "#64748b",
    fontSize: "11px",
    wordBreak: "break-all" as const,
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "24px 0",
  },
  subHeading: {
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    margin: "0 0 12px",
    textTransform: "uppercase" as const,
  },
  list: {
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.7,
    margin: 0,
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "6px",
  },
  footer: {
    backgroundColor: "#f8fafc",
    padding: "24px 40px",
  },
  footerText: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.55,
    margin: "0 0 16px",
  },
  footerHr: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "16px 0",
  },
  footerSmall: {
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
