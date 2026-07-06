# Cohort / Broadcast Notifications — Design Plan

**Status:** proposed (design-first, not built)
**Author:** Chris + Claude, 2026-07-06
**Depends on:** the live per-client notifications feature (`Notification__c` → `portal.notifications` sync)

## Goal

Let an internal sender push one notification to **many clients at once**, into the
portal Notifications inbox (and later email + push). Two audiences:

1. **Accountant → their own book** — a person wants to tell their assigned clients
   something (e.g. "I'm on leave next week, cover is …").
2. **Firm → a segment or all clients** — mass communication (e.g. "Budget changes
   affecting dividends", "New portal feature", "Year-end reminder").

## Model — fan-out to per-client `Notification__c` (recommended)

A broadcast **spawns one `Notification__c` per targeted Account**, reusing the
existing sync + inbox + per-client read state. Simpler than a shared row because
read/unread, dedupe and the account-scoped cache all already work per-account.

**New object `Notification_Broadcast__c`** (the "envelope"):

| Field | Purpose |
|---|---|
| `Title__c`, `Body__c`, `Href__c`, `Action_Required__c`, `Type__c` | The notification content (same shape as `Notification__c`) |
| `Audience_Type__c` (picklist: My Clients / Owner / Brand / Segment / All) | Who to target |
| `Audience_Value__c` | The owner Id / brand / segment key when relevant |
| `Portal_Active_Only__c` (checkbox) | Optionally only clients with a portal login |
| `Sender__c` (User), `Sent_At__c`, `Scheduled_For__c` | Provenance + scheduling |
| `Status__c` (Draft / Scheduled / Sending / Sent / Failed) | Lifecycle |
| `Recipient_Count__c` | How many clients it went to (audit) |
| `Requires_Approval__c`, `Approved_By__c` | Governance for firm-wide sends |
| `Channel__c` (Portal / Portal+Email / Portal+Push) | Future channels |

Spawned `Notification__c` get `Dedupe_Key__c = 'broadcast:{broadcastId}:{accountId}'`
so a re-run is idempotent (no duplicate per client).

## Fan-out + the scale problem (the key design point)

`PortalBroadcastBatch` (Batchable) — `start()` = the audience query, `execute()`
creates one `Notification__c` per Account (chunks of 200).

Audience query from `Audience_Type__c`:
- **My Clients / Owner** → `Account WHERE OwnerId = :ownerId AND <active client>`
- **Brand** → `WHERE Branding__c = :value`
- **Segment** → `WHERE Sector__c / Product__c = :value` (or a saved list)
- **All** → all active clients, **brand-scoped** (never cross-brand)

**⚠ Scale — do NOT use the per-record sync path.** 6,500 accounts = 6,500
`Notification__c` inserts, and today each insert fires `NotificationTrigger` →
`publishUpserts` → **one `PortalSyncQueueable` + one HTTPS callout per record**.
6,500 callouts would blow async/callout governor limits and hammer the Next.js
webhook. A firm-wide blast needs a **bulk sync**:

- Suppress the per-record trigger callout during broadcast (a `PortalSync`
  static "bulk mode" flag), and
- Add a **new bulk endpoint `POST /api/portal/sync/bulk`** (HMAC-signed) that
  upserts **many notifications in one transaction** (Drizzle `insert().values([...]).onConflictDoUpdate`),
  called in batches (e.g. 200–500 notifications per POST) from a
  `PortalBroadcastSyncBatch`.

This bulk path is the main net-new infrastructure and should be built first.

## Authoring UI (internal, Command Centre)

A compose screen: title, body, action/link, pick audience (My clients / brand /
segment / all), **live recipient-count preview**, optional schedule, send.
- **Accountant view:** audience defaults to (and is locked to) "My clients".
- **Firm-admin view:** brand / segment / all unlocked.

MVP can start with a Flow/anon-Apex trigger on `Notification_Broadcast__c` before
the full LWC, to validate the pipeline.

## Governance

- New perm set `Portal_Broadcast_Sender` — accountants send to **their own book
  only**; firm-wide requires an admin-level perm.
- Optional **approval** for firm-wide sends (`Requires_Approval__c`).
- **Audit** = `Recipient_Count__c` + the spawned per-client `Notification__c`
  rows (who got what) + a broadcast log.
- Guard rails: confirmation before large sends; a frequency cap.

## Channels

1. **Phase 1 — portal inbox only** (this plan).
2. **Phase 2 — email** fan-out (Resend/SendGrid) for the same broadcast.
3. **Phase 3 — push** (FCM) — a cohort blast is the headline use case for the
   mobile app.

## Phasing

1. **MVP:** `Notification_Broadcast__c` + `PortalBroadcastBatch` + **bulk sync
   endpoint** + audience = My Clients / All-in-brand + minimal send trigger.
   Portal-only.
2. Segments + scheduling + recipient preview + governance perms/approval + the
   Command Centre compose LWC.
3. Email + push channels.

## Open decisions (need your call before MVP)

1. **Audience granularity for v1** — just "My clients" + "All (per brand)", or
   include brand/segment/product from the start?
2. **Who can send firm-wide** — which staff / perm set? Approval required for
   firm-wide blasts?
3. **Channel for v1** — portal-only first, or email at the same time?
4. **Recipient scope** — all active clients, or only those with a portal login?
