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
 * Magic-link sign-in email — sent when a returning client requests a
 * sign-in link.
 *
 * Same Outlook-safe structure as portal-invitation.tsx:
 *   · raw <body> (no React Email <Body> 100%-width wrapper)
 *   · 600px outer <table class="email-outer"> with width="600" on its <td>
 *     (Word renderer interprets nested 100% tables as page-width otherwise)
 *   · MSO conditional wrapper injected post-render by portal-mailer.ts
 *   · white header + standard full-colour logo (no dark band, no white-logo)
 *   · bulletproof table-based CTA button
 *   · the long sign-in URL is NEVER shown as visible text — it would blow the
 *     table out to full width in Outlook (no word-break support)
 */

export interface PortalMagicLinkEmailProps {
  brand: BrandConfig;
  firstName: string | null;
  /** The sign-in URL — already includes the ticket. */
  signInUrl: string;
  /** Optional security context surfaced as a "requested from" line. */
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
  const greetingName = firstName ?? "there";
  const primary = brand.colors.primary;

  const requestLine = requestContext
    ? buildRequestLine(requestContext)
    : null;

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
      <Preview>Sign in to {brand.name} — link expires in 10 minutes.</Preview>
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
                    SIGN IN
                  </Text>
                  <Heading className="email-hero-heading" style={s.heading}>
                    Welcome back, {greetingName}.
                  </Heading>

                  <Text className="email-para" style={s.bodyParaFirst}>
                    Click below to sign in to your{" "}
                    {`${brand.name} portal`}. This link works for the next
                    10 minutes.
                  </Text>

                  {/* Bulletproof CTA */}
                  <table
                    role="presentation"
                    cellSpacing="0"
                    cellPadding="0"
                    border={0}
                    align="center"
                    style={{ margin: "26px auto 10px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          {...({ bgcolor: primary } as Record<string, string>)}
                          style={{
                            backgroundColor: primary,
                            borderRadius: "8px",
                            padding: "14px 36px",
                          }}
                        >
                          <a
                            href={signInUrl}
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
                            Sign in to my portal
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <Text style={s.fallbackText}>
                    Button not working?{" "}
                    <Link href={signInUrl} style={s.fallbackLink}>
                      Click here to sign in
                    </Link>
                    .
                  </Text>

                  <Hr style={s.divider} />

                  <Text style={s.securityNote}>
                    {requestLine}If this wasn&apos;t you, you can safely ignore
                    this email — no action will be taken and no one can sign in
                    without this link.
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

function buildRequestLine(ctx: {
  ip?: string;
  city?: string;
  country?: string;
  at?: string;
}): string {
  const place = [ctx.city, ctx.country].filter(Boolean).join(", ");
  const parts: string[] = ["This sign-in was requested"];
  if (ctx.at) parts.push(`at ${ctx.at}`);
  if (place) parts.push(`from ${place}`);
  if (ctx.ip) parts.push(`(${ctx.ip})`);
  return parts.join(" ") + ". ";
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
