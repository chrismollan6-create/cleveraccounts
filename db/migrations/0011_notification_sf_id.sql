-- Notifications now sync FROM Salesforce (Notification__c → portal.notifications)
-- instead of being seeded. Add the SF record id as the idempotency key so the
-- sync webhook can ON CONFLICT DO UPDATE on it (content columns only —
-- read_at/created_at are preserved so a staff edit never marks a row unread).
--
-- Nullable: pre-existing seeded/demo rows have no SF origin and keep sf_id NULL.
-- The unique index treats NULLs as distinct (Postgres default), so any number of
-- legacy NULL rows coexist while every synced row is unique by sf_id.
--
-- Idempotent: safe to re-run via scripts/apply-portal-migration.mjs.

ALTER TABLE "portal"."notifications" ADD COLUMN IF NOT EXISTS "sf_id" text;
--> statement-breakpoint
ALTER TABLE "portal"."notifications" ADD COLUMN IF NOT EXISTS "sf_updated_at" timestamp with time zone;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "notifications_sf_id_uq" ON "portal"."notifications" ("sf_id");
