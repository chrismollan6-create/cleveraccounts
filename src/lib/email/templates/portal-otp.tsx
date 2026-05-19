import {
  Body,
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
 * OTP verification code email — fallback when the magic link doesn't arrive
 * or the user is on a different device. Large, copyable 6-digit code.
 */

export interface PortalOtpEmailProps {
  brand: BrandConfig;
  firstName: string | null;
  /** The 6-digit code. */
  code: string;
}

export default function PortalOtpEmail({
  brand,
  firstName,
  code,
}: PortalOtpEmailProps) {
  const name = firstName ?? "there";
  return (
    <Html lang="en">
      <Head />
      <Preview>Your {brand.name} sign-in code: {code}</Preview>
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
            <Heading style={styles.h1}>Your sign-in code</Heading>
            <Text style={styles.paragraph}>
              Hi {name}, enter this code on the {brand.name} sign-in page to
              continue:
            </Text>

            <Section style={styles.codeWrap}>
              <Text style={{ ...styles.code, color: brand.colors.primary }}>
                {code}
              </Text>
            </Section>

            <Text style={styles.helperText}>
              The code expires in 10 minutes and can only be used once.
            </Text>

            <Hr style={styles.hr} />
            <Text style={styles.securityNote}>
              If you didn&apos;t try to sign in, you can safely ignore this
              email — someone may have mistyped their address.
            </Text>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerSmall}>
              <strong>{brand.legalName}</strong>
              <br />
              <Link
                href={`mailto:${brand.supportEmail}`}
                style={styles.footerLink}
              >
                {brand.supportEmail}
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
    maxWidth: "480px",
    overflow: "hidden" as const,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
  },
  header: { padding: "28px 40px", textAlign: "center" as const },
  logo: { height: "32px", width: "auto", margin: "0 auto" },
  content: { padding: "36px 40px 24px" },
  h1: {
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: 700,
    margin: "0 0 12px",
  },
  paragraph: {
    color: "#334155",
    fontSize: "15px",
    lineHeight: 1.55,
    margin: "0 0 16px",
  },
  codeWrap: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    margin: "8px 0 20px",
    padding: "20px",
    textAlign: "center" as const,
  },
  code: {
    fontFamily: "'SF Mono', Menlo, Consolas, monospace",
    fontSize: "36px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    margin: 0,
  },
  helperText: {
    color: "#64748b",
    fontSize: "13px",
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  hr: { border: "none", borderTop: "1px solid #e2e8f0", margin: "20px 0" },
  securityNote: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.5,
    margin: 0,
  },
  footer: { backgroundColor: "#f8fafc", padding: "18px 40px" },
  footerSmall: {
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: 1.55,
    margin: 0,
  },
  footerLink: { color: "#64748b", textDecoration: "none" },
};
