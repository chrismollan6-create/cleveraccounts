CREATE SCHEMA "portal";
--> statement-breakpoint
CREATE TABLE "portal"."audit_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"clerk_user_id" text,
	"account_sf_id" text,
	"action" text NOT NULL,
	"target" text,
	"ip" "inet",
	"user_agent" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "portal"."push_tokens" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"platform" text NOT NULL,
	"token" text NOT NULL,
	"device_name" text,
	"last_seen" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal"."users" (
	"clerk_user_id" text PRIMARY KEY NOT NULL,
	"contact_sf_id" text NOT NULL,
	"account_sf_id" text NOT NULL,
	"brand" text NOT NULL,
	"email" text NOT NULL,
	"status" text NOT NULL,
	"invited_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_login_at" timestamp with time zone,
	"last_seen_at" timestamp with time zone,
	CONSTRAINT "users_email_lower" CHECK ("portal"."users"."email" = lower("portal"."users"."email"))
);
--> statement-breakpoint
CREATE INDEX "audit_log_user_at_idx" ON "portal"."audit_log" USING btree ("clerk_user_id","at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "audit_log_account_at_idx" ON "portal"."audit_log" USING btree ("account_sf_id","at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "push_tokens_user_idx" ON "portal"."push_tokens" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "push_tokens_user_token_uq" ON "portal"."push_tokens" USING btree ("clerk_user_id","token");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "portal"."users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_account_sf_idx" ON "portal"."users" USING btree ("account_sf_id");