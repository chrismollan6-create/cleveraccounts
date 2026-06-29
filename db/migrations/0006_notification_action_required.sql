ALTER TABLE "portal"."notifications" ADD COLUMN IF NOT EXISTS "action_required" boolean DEFAULT false NOT NULL;
