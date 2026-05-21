#!/usr/bin/env node
/**
 * Renders the portal-invitation email template to HTML so we can inspect
 * exactly what Resend / Outlook receives. Writes to /tmp/invite.html so
 * you can open it in a browser to see what it looks like.
 *
 * Usage:
 *   node scripts/preview-invite-email.mjs
 */

import { render } from "@react-email/components";
import { writeFileSync } from "node:fs";
import { BRANDS } from "../src/lib/constants.ts";
import PortalInvitationEmail from "../src/lib/email/templates/portal-invitation.tsx";

const html = await render(
  PortalInvitationEmail({
    brand: BRANDS.clever,
    firstName: "Test",
    inviteUrl:
      "https://charming-haddock-49.clerk.accounts.dev/v1/tickets/accept?ticket=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.example.ticket.value.here",
    accountantName: "Charlie McAuley",
  }),
);

writeFileSync("/tmp/invite.html", html);
console.log("Rendered. /tmp/invite.html written.");
console.log("\nLength:", html.length, "chars");
console.log("\n--- First 1500 chars of HTML output ---");
console.log(html.slice(0, 1500));
console.log("\n--- Searching for width=\"600\" ---");
const match = html.match(/width="600"/);
console.log(match ? "FOUND: " + match[0] : "NOT FOUND — that's the bug");
