CREATE TABLE IF NOT EXISTS "portal"."approvals" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"period_label" text,
	"status" text NOT NULL,
	"summary" text,
	"amount_label" text,
	"due_date" date,
	"approved_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "approvals_account_status_idx" ON "portal"."approvals" ("account_sf_id","status");
--> statement-breakpoint
ALTER TABLE "portal"."approvals" ENABLE ROW LEVEL SECURITY;
