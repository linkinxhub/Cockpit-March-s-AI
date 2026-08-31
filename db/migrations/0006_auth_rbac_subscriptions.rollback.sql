BEGIN;

DROP TABLE IF EXISTS admin_audit_logs;
DROP TABLE IF EXISTS usage_counters;
DROP TABLE IF EXISTS plan_entitlements;
DROP TABLE IF EXISTS subscriptions;

DROP INDEX IF EXISTS user_profiles_account_status_idx;
DROP INDEX IF EXISTS user_profiles_role_idx;
DROP INDEX IF EXISTS user_profiles_stable_user_id_uidx;

ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_locale_check;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_account_status_check;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS onboarding_completed_at;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS last_login_at;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS locale;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS account_status;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS role;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS stable_user_id;

COMMIT;
