#!/usr/bin/env node
/**
 * Manually test /api/portal/invite.
 *
 * Usage:
 *   node scripts/test-portal-invite.mjs <email> [brand] [target-url]
 *
 * Examples:
 *   node scripts/test-portal-invite.mjs chris@cleveraccounts.com
 *   node scripts/test-portal-invite.mjs ada@example.com clever
 *   node scripts/test-portal-invite.mjs ada@example.com workwell https://cleveraccounts.vercel.app
 *
 * What it does:
 *   1. Reads the HMAC secret from .env.local (PORTAL_INVITE_HMAC_SECRET or PORTAL_SYNC_HMAC_SECRET)
 *   2. Signs an invitation request body with HMAC-SHA256
 *   3. POSTs to <target>/api/portal/invite
 *   4. Logs the response — you should also receive the email at the address provided
 *
 * If the call succeeds: check your inbox for a branded invitation email.
 * If it fails: the response body tells you why (bad sig / Clerk error / Resend error).
 */

import { readFileSync } from "node:fs";
import { createHmac } from "node:crypto";
import { join } from "node:path";

const email = process.argv[2];
const brand = process.argv[3] ?? "clever";
const target = process.argv[4] ?? "https://cleveraccounts.vercel.app";

if (!email) {
  console.error("Usage: node scripts/test-portal-invite.mjs <email> [brand] [target-url]");
  process.exit(1);
}
if (brand !== "clever" && brand !== "workwell") {
  console.error(`Brand must be 'clever' or 'workwell', got '${brand}'`);
  process.exit(1);
}

// ── Load secret from .env.local ─────────────────────────────────────────
const envPath = join(process.cwd(), ".env.local");
let envText;
try {
  envText = readFileSync(envPath, "utf8");
} catch {
  console.error(`Could not read ${envPath}. Run this from the cleveraccounts repo root.`);
  process.exit(1);
}

function readEnv(key) {
  const line = envText.split(/\r?\n/).find((l) => l.startsWith(`${key}=`));
  if (!line) return null;
  return line.replace(`${key}=`, "").replace(/^["']|["']$/g, "").trim();
}

const secret = readEnv("PORTAL_INVITE_HMAC_SECRET") ?? readEnv("PORTAL_SYNC_HMAC_SECRET");
if (!secret) {
  console.error(
    "No HMAC secret in .env.local. Need PORTAL_INVITE_HMAC_SECRET or PORTAL_SYNC_HMAC_SECRET.",
  );
  process.exit(1);
}

// ── Build the request body ──────────────────────────────────────────────
const body = JSON.stringify({
  email,
  brand,
  firstName: "Test",
  lastName: "Recipient",
  accountantName: brand === "clever" ? "Charlie McAuley" : "your accountant",
});

// ── Sign it ─────────────────────────────────────────────────────────────
const signature = createHmac("sha256", secret).update(body).digest("hex");

// ── Send ────────────────────────────────────────────────────────────────
const url = `${target.replace(/\/$/, "")}/api/portal/invite`;
console.log(`POST ${url}`);
console.log(`  brand=${brand} email=${email}`);

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-portal-invite-signature": signature,
  },
  body,
});

const text = await res.text();
let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  parsed = text;
}

console.log(`\nStatus: ${res.status}`);
console.log("Response:", parsed);

if (res.status === 201) {
  console.log(`\n✓ Invitation created (id: ${parsed.invitationId}).`);
  console.log(`✓ Email sent (Resend id: ${parsed.emailMessageId}).`);
  console.log(`\nNow check ${email} for the invitation email.`);
} else if (res.status === 202) {
  console.log(`\n⚠ Clerk invitation created (id: ${parsed.invitationId}) BUT Resend failed:`);
  console.log(`  ${parsed.emailError}`);
  console.log("\nLikely cause: RESEND_API_KEY missing, domain not verified, or sender address rejected.");
} else if (res.status === 401) {
  console.log("\n✘ HMAC signature rejected. Make sure the local secret matches the one on Vercel.");
} else if (res.status === 502) {
  console.log("\n✘ Clerk createInvitation failed. Check Clerk dashboard for the error detail above.");
} else {
  console.log("\n✘ Unexpected status — see Response above for detail.");
}
