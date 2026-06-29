CREATE TABLE IF NOT EXISTS "portal"."companies" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"company_number" text,
	"company_name" text,
	"status" text,
	"status_detail" text,
	"company_type" text,
	"date_of_creation" date,
	"date_of_cessation" date,
	"reg_premises" text,
	"reg_line_1" text,
	"reg_line_2" text,
	"reg_locality" text,
	"reg_region" text,
	"reg_postal_code" text,
	"reg_country" text,
	"sic_codes" text,
	"accounts_next_due" date,
	"accounts_last_made_up" date,
	"accounts_next_period_end" date,
	"accounts_overdue" boolean DEFAULT false NOT NULL,
	"cs_next_due" date,
	"cs_last_made_up" date,
	"cs_overdue" boolean DEFAULT false NOT NULL,
	"last_synced" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portal"."officers" (
	"sf_id" text PRIMARY KEY NOT NULL,
	"account_sf_id" text NOT NULL,
	"company_sf_id" text,
	"name" text,
	"officer_role" text,
	"appointed_on" date,
	"resigned_on" date,
	"month_of_birth" text,
	"year_of_birth" text,
	"occupation" text,
	"nationality" text,
	"country_of_residence" text,
	"addr_premises" text,
	"addr_line_1" text,
	"addr_line_2" text,
	"addr_locality" text,
	"addr_region" text,
	"addr_postal_code" text,
	"addr_country" text,
	"idv_verified_on" date,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sf_updated_at" timestamp with time zone,
	"raw" jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "companies_account_idx" ON "portal"."companies" ("account_sf_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "officers_account_idx" ON "portal"."officers" ("account_sf_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "officers_company_idx" ON "portal"."officers" ("company_sf_id");
--> statement-breakpoint
ALTER TABLE "portal"."companies" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "portal"."officers" ENABLE ROW LEVEL SECURITY;
