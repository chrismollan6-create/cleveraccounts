-- Membership model: let one Clerk login access multiple companies.
--
-- Introduces portal.memberships (Clerk user × SF Account, many-to-many) plus a
-- portal.users.active_account_sf_id "cursor" for the account switcher. This is
-- the DUAL-WRITE step: the legacy users.account_sf_id/contact_sf_id/brand/status
-- columns are LEFT IN PLACE and keep mirroring the active membership, so every
-- existing read path (withPortalScope) still works unchanged. A later migration
-- drops them once all readers resolve the active membership instead.
--
-- Idempotent: safe to re-run via scripts/apply-portal-migration.mjs (IF NOT
-- EXISTS on DDL; ON CONFLICT / guarded WHERE on the backfill).

CREATE TABLE IF NOT EXISTS "portal"."memberships" (
	"clerk_user_id" text NOT NULL,
	"account_sf_id" text NOT NULL,
	"contact_sf_id" text NOT NULL,
	"brand" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_clerk_user_id_account_sf_id_pk" PRIMARY KEY("clerk_user_id","account_sf_id")
);
--> statement-breakpoint
ALTER TABLE "portal"."users" ADD COLUMN IF NOT EXISTS "active_account_sf_id" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memberships_user_idx" ON "portal"."memberships" ("clerk_user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memberships_account_idx" ON "portal"."memberships" ("account_sf_id");
--> statement-breakpoint
-- Backfill: one membership per existing linked user. Skip the soft-blocked
-- rows (no SF match → empty account/contact ids). Carry the user's current
-- status/brand across verbatim. ON CONFLICT keeps re-runs a no-op.
INSERT INTO "portal"."memberships"
	("clerk_user_id", "account_sf_id", "contact_sf_id", "brand", "status")
SELECT
	"clerk_user_id", "account_sf_id", "contact_sf_id", "brand", "status"
FROM "portal"."users"
WHERE "account_sf_id" <> '' AND "contact_sf_id" <> ''
ON CONFLICT ("clerk_user_id", "account_sf_id") DO NOTHING;
--> statement-breakpoint
-- Seed the switcher cursor at each user's existing account (only when unset,
-- so a user's later choice is never clobbered on re-run).
UPDATE "portal"."users"
SET "active_account_sf_id" = "account_sf_id"
WHERE "active_account_sf_id" IS NULL AND "account_sf_id" <> '';
--> statement-breakpoint
-- RLS: deny-all by default (service-role key bypasses). Matches 0003_portal_rls.
ALTER TABLE "portal"."memberships" ENABLE ROW LEVEL SECURITY;
