CREATE TABLE "portal"."accountants" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"calendly_slug" text,
	"photo_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE TABLE "portal"."accounts" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"owner_sf_id" text,
	"active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE TABLE "portal"."cases" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"contact_sf_id" text,
	"status" text NOT NULL,
	"subject" text,
	"is_closed" boolean DEFAULT false NOT NULL,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE TABLE "portal"."contacts" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE TABLE "portal"."email_messages" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"case_sf_id" text NOT NULL,
	"account_sf_id" text NOT NULL,
	"from_address" text,
	"from_name" text,
	"subject" text,
	"body_text" text,
	"sent_at" timestamp with time zone NOT NULL,
	"is_from_client" boolean DEFAULT false NOT NULL,
	"is_portal_authored" boolean DEFAULT false NOT NULL,
	"hide_from_portal" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE TABLE "portal"."engagement_letters" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"status" text NOT NULL,
	"variant" text,
	"token" text,
	"sent_at" timestamp with time zone,
	"first_viewed_at" timestamp with time zone,
	"signed_at" timestamp with time zone,
	"signer_name" text,
	"signer_email" text,
	"pdf_ready" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE TABLE "portal"."sync_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"object_type" text NOT NULL,
	"sf_id" text NOT NULL,
	"operation" text NOT NULL,
	"status" text NOT NULL,
	"error_message" text,
	"latency_ms" integer
);
--> statement-breakpoint
CREATE TABLE "portal"."workflows" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"current_stage" text NOT NULL,
	"stage_number" integer NOT NULL,
	"blocked_on" text NOT NULL,
	"sla_status" text NOT NULL,
	"signed_off_at" date,
	"welcome_complete_at" date,
	"welcome_due_at" timestamp with time zone,
	"welcome_scheduled_at" timestamp with time zone,
	"main_complete_at" date,
	"main_due_at" timestamp with time zone,
	"main_scheduled_at" timestamp with time zone,
	"portal_complete_at" date,
	"portal_due_at" timestamp with time zone,
	"portal_scheduled_at" timestamp with time zone,
	"catchup_complete_at" date,
	"catchup_due_at" timestamp with time zone,
	"catchup_scheduled_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE INDEX "accounts_brand_idx" ON "portal"."accounts" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "accounts_owner_idx" ON "portal"."accounts" USING btree ("owner_sf_id");--> statement-breakpoint
CREATE INDEX "cases_account_idx" ON "portal"."cases" USING btree ("account_sf_id");--> statement-breakpoint
CREATE INDEX "cases_open_idx" ON "portal"."cases" USING btree ("account_sf_id","is_closed");--> statement-breakpoint
CREATE INDEX "contacts_account_idx" ON "portal"."contacts" USING btree ("account_sf_id");--> statement-breakpoint
CREATE INDEX "contacts_email_idx" ON "portal"."contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "email_messages_account_sent_idx" ON "portal"."email_messages" USING btree ("account_sf_id","sent_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "email_messages_case_idx" ON "portal"."email_messages" USING btree ("case_sf_id");--> statement-breakpoint
CREATE INDEX "engagement_letters_account_idx" ON "portal"."engagement_letters" USING btree ("account_sf_id");--> statement-breakpoint
CREATE INDEX "engagement_letters_account_status_idx" ON "portal"."engagement_letters" USING btree ("account_sf_id","status");--> statement-breakpoint
CREATE INDEX "sync_log_object_idx" ON "portal"."sync_log" USING btree ("object_type","sf_id","at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "sync_log_status_at_idx" ON "portal"."sync_log" USING btree ("status","at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "workflows_account_idx" ON "portal"."workflows" USING btree ("account_sf_id");--> statement-breakpoint
CREATE INDEX "workflows_active_idx" ON "portal"."workflows" USING btree ("account_sf_id","signed_off_at");