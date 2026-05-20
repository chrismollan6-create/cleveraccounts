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
 * OTP verification-code email — fallback sign-in when the magic link doesn't
 * arrive or the client is on a different device. Large copyable 6-digit code.
 *
 * Same Outlook-safe structure as the invitation + magic-link templates:
 * raw <body>, 600px outer table with width="600" on its <td>, white header
 * with standard logo, MSO wrapper injected by portal-mailer.ts.
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
  const greetingName = firstName ?? "there";
  const primary = brand.colors.primary;

  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
        {/* eslint-disable-next-line react/no-danger */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media only screen and (max-width: 600px) {
                .email-outer { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
                .email-hero { padding: 28px 24px !important; }
                .email-body { padding: 28px 22px !important; }
                .email-hero-heading { font-size: 24px !important; }
                .email-para { font-size: 16px !important; }
                .email-footer { padding: 20px 22px !important; }
              }
            `,
          }}
        />
      </Head>
      <Preview>
        Your {brand.name} sign-in code: {code}
      </Preview>
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
              <td width="600" style={{ width: "600px", padding: 0 }}>
                {/* Header */}
                <Section className="email-hero" style={s.hero}>
                  <Img
                    src={`https://${brand.appDomain}${brand.assets.logo}`}
                    width="150"
                    height="40"
                    alt={brand.name}
                    style={s.heroLogo}
                  />
                </Section>

                {/* Body */}
                <Section className="email-body" style={s.bodyPad}>
                  <Text style={{ ...s.eyebrow, color: primary }}>
                    SIGN-IN CODE
                  </Text>
                  <Heading className="email-hero-heading" style={s.heading}>
                    Your sign-in code
                  </Heading>

                  <Text className="email-para" style={s.bodyParaFirst}>
                    Hi {greetingName}, enter this code on the{" "}
                    {`${brand.name} sign-in page`} to continue:
                  </Text>

                  {/* Code block — table-based, Outlook-safe */}
                  <table
                    role="presentation"
                    width="100%"
                    cellSpacing="0"
                    cellPadding="0"
                    border={0}
                    style={{ margin: "20px 0" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          {...({ bgcolor: "#f1f5f9" } as Record<string, string>)}
                          style={{
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "20px",
                          }}
                        >
                          <Text style={{ ...s.code, color: primary }}>
                            {code}
                          </Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <Text className="email-para" style={s.bodyPara}>
                    The code expires in 10 minutes and can only be used once.
                  </Text>

                  <Hr style={s.divider} />

                  <Text style={s.securityNote}>
                    If you didn&apos;t try to sign in, you can safely ignore
                    this email — someone may have mistyped their address.
                  </Text>
                </Section>

                {/* Footer */}
                <Section className="email-footer" style={s.footer}>
                  <Text style={s.footerOrg}>
                    <strong>{brand.legalName}</strong>
                  </Text>
                  <Text style={s.footerLinks}>
                    <Link
                      href={`mailto:${brand.supportEmail}`}
                      style={s.footerLink}
                    >
                      {brand.supportEmail}
                    </Link>
                    {"  ·  "}
                    <Link
                      href={`https://${brand.domain}`}
                      style={s.footerLink}
                    >
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

// ─── Styles ────────────────────────────────────────────────────────────────

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
  },
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
  eyebrow: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    margin: "0 0 8px",
    textTransform: "uppercase" as const,
  },
  heading: {
    color: "#0f172a",
    fontSize: "26px",
    fontWeight: 700,
    lineHeight: 1.15,
    margin: "0 0 4px",
  },
  bodyParaFirst: {
    color: "#334155",
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "16px 0 0",
  },
  bodyPara: {
    color: "#334155",
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "0",
  },
  code: {
    fontFamily: "'SF Mono', Menlo, Consolas, monospace",
    fontSize: "34px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    margin: 0,
    textAlign: "center" as const,
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "24px 0",
  },
  securityNote: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.55,
    margin: 0,
  },
  footer: {
    backgroundColor: "#f8fafc",
    padding: "22px 40px",
  },
  footerOrg: {
    color: "#475569",
    fontSize: "11px",
    fontWeight: 600,
    margin: "0 0 4px",
  },
  footerLinks: {
    color: "#94a3b8",
    fontSize: "11px",
    margin: 0,
  },
  footerLink: {
    color: "#64748b",
    textDecoration: "none",
  },
};
