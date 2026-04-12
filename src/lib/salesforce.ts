/**
 * Salesforce API utilities for server-side Next.js API routes.
 *
 * For production: uses OAuth Client Credentials flow (Connected App).
 *   SALESFORCE_CLIENT_ID      — Connected App Consumer Key
 *   SALESFORCE_CLIENT_SECRET  — Connected App Consumer Secret
 *   SALESFORCE_TOKEN_URL      — https://login.salesforce.com/services/oauth2/token
 *
 * For local/sandbox testing: set SALESFORCE_ACCESS_TOKEN directly
 * (get it from: sf org display --target-org <alias>).
 *   SALESFORCE_ACCESS_TOKEN   — direct session token
 *
 * Both require:
 *   SALESFORCE_INSTANCE_URL   — e.g. https://cleveraccounts.my.salesforce.com
 */

export async function getSalesforceToken(): Promise<string> {
  // Direct token override — useful for local testing without a Connected App
  if (process.env.SALESFORCE_ACCESS_TOKEN) {
    return process.env.SALESFORCE_ACCESS_TOKEN;
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.SALESFORCE_CLIENT_ID!,
    client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
  });

  const res = await fetch(process.env.SALESFORCE_TOKEN_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Salesforce auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

/** Build the full URL for an Apex REST endpoint */
export function sfApex(path: string): string {
  return `${process.env.SALESFORCE_INSTANCE_URL}/services/apexrest${path}`;
}
