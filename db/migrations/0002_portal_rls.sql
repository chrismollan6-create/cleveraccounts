-- Stage 3G / Stage 4: Enable Row-Level Security on portal.* tables.
--
-- Closes audit finding #5 from the May 2026 internal portal security
-- audit. Defence-in-depth: the Next.js portal already routes every read
-- through withPortalScope() which scopes to the authenticated user's
-- accountSfId. RLS adds a second layer — even if the application chokepoint
-- is bypassed or the anon key leaks, Postgres refuses to return any rows
-- to non-service-role connections.
--
-- The portal app uses the service-role key (SUPABASE_SECRET_KEY) which
-- bypasses RLS, so application behaviour is unchanged.

-- Cache tables — enable RLS with NO policies = deny-all-by-default.
-- Any client connecting with the anon key gets 0 rows.
ALTER TABLE portal.accounts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.contacts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.workflows           ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.engagement_letters  ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.cases               ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.email_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.accountants         ENABLE ROW LEVEL SECURITY;

-- Link / operational tables — same treatment.
ALTER TABLE portal.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.audit_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.push_tokens         ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal.sync_log            ENABLE ROW LEVEL SECURITY;

-- ─── FORCE row security ─────────────────────────────────────────────────
-- By default, the table OWNER (typically the postgres / supabase admin
-- role) bypasses RLS — required so migrations and DDL still work. We do
-- NOT force RLS here because the service-role key needs to be able to
-- INSERT/UPDATE/SELECT for the sync handler to populate the cache. If we
-- forced it, we'd need to add an explicit ALLOW policy for service-role.
--
-- The standard Supabase setup gives the service-role key the
-- 'service_role' Postgres role which is the table owner, so it bypasses
-- RLS naturally. Anon-key connections use 'anon' which is not the owner,
-- so RLS applies and they get 0 rows from any of these tables.

-- Sanity-check comment: if any portal table is later created via Drizzle
-- migration, remember to ALTER TABLE …ENABLE ROW LEVEL SECURITY for it
-- too. drizzle-kit does NOT carry RLS settings from the schema.ts file.
