CREATE TABLE IF NOT EXISTS "portal"."documents" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"direction" text NOT NULL,
	"status" text NOT NULL,
	"file_type" text,
	"size_label" text,
	"download_url" text,
	"shared_at" timestamp with time zone,
	"due_date" date,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_account_dir_idx" ON "portal"."documents" ("account_sf_id","direction");
--> statement-breakpoint
ALTER TABLE "portal"."documents" ENABLE ROW LEVEL SECURITY;
