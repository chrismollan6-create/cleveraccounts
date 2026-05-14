/**
 * Salesforce API utilities for server-side Next.js API routes.
 *
 * Two identities, two credential sets:
 *
 *   1. **General integration** (`SALESFORCE_CLIENT_ID/SECRET`) — used by
 *      marketing-site signup, lead conversion, engagement letter sending,
 *      etc. This identity has broad permissions because it does broad work.
 *
 *   2. **Portal-only integration** (`SALESFORCE_PORTAL_CLIENT_ID/SECRET`) —
 *      added 2026-05-11 to lock down portal blast radius. Authenticates as a
 *      dedicated SF user assigned only the Portal_Integration_User_PS perm
 *      set. If a portal token leaks, the attacker can read/write *only* the
 *      objects portal endpoints need (Account/Contact/Case/EmailMessage/
 *      Engagement_Letter__c/New_Client_Workflow__c) and cannot send email,
 *      convert leads, or touch any other CRM data.
 *
 * For local/sandbox testing: set `SALESFORCE_ACCESS_TOKEN` directly
 * (get it from `sf org display --target-org <alias>`). This overrides both
 * identities — convenient for dev but DO NOT use in production. The same
 * override applies to both `getSalesforceToken()` and `getPortalSalesforceToken()`.
 *
 * Both require:
 *   SALESFORCE_INSTANCE_URL — e.g. https://cleveraccounts.my.salesforce.com
 *   SALESFORCE_TOKEN_URL    — https://login.salesforce.com/services/oauth2/token
 */

export async function getSalesforceToken(): Promise<string> {
  // Direct token override — useful for local testing without a Connected App
  if (process.env.SALESFORCE_ACCESS_TOKEN) {
    return process.env.SALESFORCE_ACCESS_TOKEN;
  }

  return fetchClientCredentialsToken({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    label: "general",
  });
}

/**
 * Portal-only Salesforce token. Authenticates as the dedicated portal
 * integration user (least-privilege perm set) when
 * `SALESFORCE_PORTAL_CLIENT_ID/SECRET` are configured.
 *
 * Falls back to the general credentials (with a one-time warning) if the
 * portal-specific env vars aren't set — this keeps the portal working
 * during the Stage 1 rollout, but production should ALWAYS have the
 * portal creds set. The fallback is for the brief window between code
 * deploy and Netlify env var update.
 */
let portalCredFallbackWarned = false;

export async function getPortalSalesforceToken(): Promise<string> {
  // Same dev override as the general path — sf-org-display tokens work
  // for both identities while running locally against a sandbox.
  if (process.env.SALESFORCE_ACCESS_TOKEN) {
    return process.env.SALESFORCE_ACCESS_TOKEN;
  }

  const portalId = process.env.SALESFORCE_PORTAL_CLIENT_ID;
  const portalSecret = process.env.SALESFORCE_PORTAL_CLIENT_SECRET;

  if (portalId && portalSecret) {
    return fetchClientCredentialsToken({
      clientId: portalId,
      clientSecret: portalSecret,
      label: "portal",
    });
  }

  // Fallback path — portal-specific creds not yet configured. Warn once
  // so we notice in logs, then degrade to the general identity. Production
  // SHOULD never hit this once Stage 1 rollout completes.
  if (!portalCredFallbackWarned) {
    console.warn(
      "[salesforce] SALESFORCE_PORTAL_CLIENT_ID/SECRET not set — portal " +
        "API calls falling back to the GENERAL Connected App identity. " +
        "Set the portal-specific creds on Netlify to complete Stage 1 of " +
        "the portal security hardening (least-privilege integration user)."
    );
    portalCredFallbackWarned = true;
  }
  return getSalesforceToken();
}

async function fetchClientCredentialsToken(opts: {
  clientId: string | undefined;
  clientSecret: string | undefined;
  label: string;
}): Promise<string> {
  if (!opts.clientId || !opts.clientSecret) {
    throw new Error(
      `Salesforce ${opts.label} credentials missing: set CLIENT_ID and CLIENT_SECRET env vars`
    );
  }

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: opts.clientId,
    client_secret: opts.clientSecret,
  });

  const res = await fetch(process.env.SALESFORCE_TOKEN_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Salesforce ${opts.label} auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

/** Build the full URL for an Apex REST endpoint */
export function sfApex(path: string): string {
  return `${process.env.SALESFORCE_INSTANCE_URL}/services/apexrest${path}`;
}
