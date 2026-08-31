BEGIN;

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS stable_user_id text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'USER';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'fr';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_login_at bigint;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at bigint;

UPDATE user_profiles SET stable_user_id = id WHERE stable_user_id IS NULL;
ALTER TABLE user_profiles ALTER COLUMN stable_user_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_stable_user_id_uidx ON user_profiles(stable_user_id);
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role);
CREATE INDEX IF NOT EXISTS user_profiles_account_status_idx ON user_profiles(account_status);

DO $$ BEGIN
  ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check CHECK (role IN ('USER','SUPPORT','ADMIN'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_account_status_check CHECK (account_status IN ('TRIALING','ACTIVE','PAST_DUE','CANCELED','SUSPENDED'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_locale_check CHECK (locale IN ('fr','en','de','nl'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS subscriptions (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'DISCOVERY',
  status text NOT NULL DEFAULT 'ACTIVE',
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  current_period_end bigint,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  trial_ends_at bigint,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  CONSTRAINT subscriptions_plan_check CHECK (plan IN ('DISCOVERY','PRO','EXPERT')),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('TRIALING','ACTIVE','PAST_DUE','CANCELED','SUSPENDED'))
);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_uidx ON subscriptions(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_customer_uidx ON subscriptions(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_subscription_uidx ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS subscriptions_plan_status_idx ON subscriptions(plan,status);

CREATE TABLE IF NOT EXISTS plan_entitlements (
  plan text NOT NULL,
  feature text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  PRIMARY KEY (plan,feature),
  CONSTRAINT plan_entitlements_plan_check CHECK (plan IN ('DISCOVERY','PRO','EXPERT'))
);

CREATE INDEX IF NOT EXISTS plan_entitlements_feature_idx ON plan_entitlements(feature);

CREATE TABLE IF NOT EXISTS usage_counters (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  feature text NOT NULL,
  window_start bigint NOT NULL,
  window_end bigint NOT NULL,
  usage_count bigint NOT NULL DEFAULT 0,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  CONSTRAINT usage_counters_nonnegative_check CHECK (usage_count >= 0),
  CONSTRAINT usage_counters_window_check CHECK (window_end > window_start)
);

CREATE UNIQUE INDEX IF NOT EXISTS usage_counters_window_uidx ON usage_counters(user_id,feature,window_start);
CREATE INDEX IF NOT EXISTS usage_counters_user_window_idx ON usage_counters(user_id,window_end);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id text PRIMARY KEY,
  actor_user_id text NOT NULL REFERENCES user_profiles(id) ON DELETE RESTRICT,
  target_user_id text REFERENCES user_profiles(id) ON DELETE RESTRICT,
  action text NOT NULL,
  before jsonb,
  after jsonb,
  reason text NOT NULL,
  created_at bigint NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_audit_logs_actor_idx ON admin_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS admin_audit_logs_target_idx ON admin_audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS admin_audit_logs_created_idx ON admin_audit_logs(created_at);

COMMIT;
