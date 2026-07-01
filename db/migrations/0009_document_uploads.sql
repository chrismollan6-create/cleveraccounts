-- Client document uploads (portal → us). Portal-native tables (not SF mirrors).
-- File bytes live in the private `portal-uploads` Supabase Storage bucket;
-- these rows carry the commentary + status, with sf_content_ref set once the
-- batch is pushed to Salesforce.
CREATE TABLE IF NOT EXISTS "portal"."document_uploads" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"clerk_user_id" text,
	"contact_sf_id" text,
	"note" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"sf_content_ref" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portal"."document_upload_files" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"upload_id" bigint NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text,
	"size_bytes" integer,
	"storage_path" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_uploads_account_created_idx" ON "portal"."document_uploads" ("account_sf_id","created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_upload_files_upload_idx" ON "portal"."document_upload_files" ("upload_id");
--> statement-breakpoint
-- RLS: deny-all by default (service-role key bypasses). Matches 0003_portal_rls.
ALTER TABLE "portal"."document_uploads" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "portal"."document_upload_files" ENABLE ROW LEVEL SECURITY;
