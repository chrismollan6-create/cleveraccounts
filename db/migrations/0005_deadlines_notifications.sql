CREATE TABLE IF NOT EXISTS "portal"."deadlines" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"due_date" date,
	"period_label" text,
	"status" text NOT NULL,
	"blocked_on" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portal"."notifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"href" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deadlines_account_due_idx" ON "portal"."deadlines" ("account_sf_id","due_date");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_account_created_idx" ON "portal"."notifications" ("account_sf_id","created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_account_unread_idx" ON "portal"."notifications" ("account_sf_id","read_at");
--> statement-breakpoint
ALTER TABLE "portal"."deadlines" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "portal"."notifications" ENABLE ROW LEVEL SECURITY;
