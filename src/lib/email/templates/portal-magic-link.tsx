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
 * Magic-link sign-in email — sent when a returning client requests one.
 *
 * Brand-aware. Shorter than the invitation because it's a transactional
 * "click to sign in" not a welcome.
 */

export interface PortalMagicLinkEmailProps {
  brand: BrandConfig;
  firstName: string | null;
  /** The sign-in URL — already includes the ticket. */
  signInUrl: string;
  /** Where the click is coming from — surfaced as a security signal. */
  requestContext?: {
    ip?: string;
    city?: string;
    country?: string;
    at?: string; // pre-formatted human-readable timestamp
  };
}

export default function PortalMagicLinkEmail({
  brand,
  firstName,
  signInUrl,
  requestContext,
}: PortalMagicLinkEmailProps) {
  const name = firstName ?? "there";
  return (
    <Html lang="en">
      <Head />
      <Preview>Sign in to {brand.name} — link expires in 10 minutes.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section
            style={{ ...styles.header, backgroundColor: brand.colors.primary }}
          >
            <Img
              src={`https://${brand.appDomain}${brand.assets.logo}`}
              width="140"
              height="36"
              alt={brand.name}
              style={styles.logo}
            />
          </Section>

          <Section style={styles.content}>
            <Heading style={styles.h1}>Welcome back, {name}.</Heading>
            <Text style={styles.paragraph}>
              Click below to sign in to your {brand.name} portal. This link
              works for the next 10 minutes.
            </Text>

            <Section style={styles.buttonWrap}>
              <Button
                href={signInUrl}
                style={{
                  ...styles.button,
                  backgroundColor: brand.colors.primary,
                }}
              >
                Sign in to my portal
              </Button>
            </Section>

            <Text style={styles.helperText}>
              Trouble with the button? Paste this into your browser:
              <br />
              <Link href={signInUrl} style={styles.fallbackLink}>
                {signInUrl}
              </Link>
            </Text>

            {requestContext && (
              <>
                <Hr style={styles.hr} />
                <Text style={styles.securityNote}>
                  <strong>Sign-in requested</strong>
                  {requestContext.at ? ` at ${requestContext.at}` : ""}
                  {requestContext.ip || requestContext.city
                    ? ` from ${[requestContext.city, requestContext.country]
                        .filter(Boolean)
                        .join(", ")}${requestContext.ip ? ` (${requestContext.ip})` : ""}`
                    : ""}
                  . If this wasn&apos;t you, you can safely ignore this email —
                  no action will be taken.
                </Text>
              </>
            )}
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerSmall}>
              <strong>{brand.legalName}</strong>
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
    maxWidth: "560px",
    overflow: "hidden" as const,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
  },
  header: { padding: "28px 40px", textAlign: "center" as const },
  logo: { height: "32px", width: "auto", margin: "0 auto" },
  content: { padding: "36px 40px 24px" },
  h1: {
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: 1.2,
    margin: "0 0 14px",
  },
  paragraph: {
    color: "#334155",
    fontSize: "15px",
    lineHeight: 1.55,
    margin: "0 0 20px",
  },
  buttonWrap: { margin: "24px 0", textAlign: "center" as const },
  button: {
    borderRadius: "10px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    padding: "13px 28px",
    textDecoration: "none",
  },
  helperText: {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: 1.5,
    margin: "0 0 8px",
  },
  fallbackLink: {
    color: "#64748b",
    fontSize: "11px",
    wordBreak: "break-all" as const,
  },
  hr: { border: "none", borderTop: "1px solid #e2e8f0", margin: "20px 0" },
  securityNote: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.5,
    margin: 0,
  },
  footer: { backgroundColor: "#f8fafc", padding: "20px 40px" },
  footerSmall: {
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: 1.55,
    margin: 0,
  },
  footerLink: { color: "#64748b", textDecoration: "none" },
};
