import{neon}from'@neondatabase/serverless';
import{getUserSyncHealth}from'./user-sync-health';

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}

const statements=[
 `CREATE TABLE IF NOT EXISTS user_profiles (id text PRIMARY KEY,email text NOT NULL,display_name text NOT NULL,created_at bigint NOT NULL,updated_at bigint NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS watchlist_items (user_id text NOT NULL,asset_key text NOT NULL,created_at bigint NOT NULL,PRIMARY KEY (user_id,asset_key))`,
 `CREATE TABLE IF NOT EXISTS notification_preferences (user_id text PRIMARY KEY,minimum_severity text NOT NULL DEFAULT 'IMPORTANT',watched_only boolean NOT NULL DEFAULT true,push_enabled boolean NOT NULL DEFAULT false,quiet_hours_start text,quiet_hours_end text,updated_at bigint NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS notification_reads (user_id text NOT NULL,event_id text NOT NULL,read_at bigint NOT NULL,PRIMARY KEY (user_id,event_id))`,
 `CREATE TABLE IF NOT EXISTS paper_trades (id text PRIMARY KEY,user_id text NOT NULL,asset_key text NOT NULL,side text NOT NULL,quantity text NOT NULL,entry_price text NOT NULL,exit_price text,opened_at bigint NOT NULL,closed_at bigint,note text)`,
 `CREATE INDEX IF NOT EXISTS watchlist_items_user_idx ON watchlist_items(user_id)`,
 `CREATE INDEX IF NOT EXISTS notification_reads_user_idx ON notification_reads(user_id)`,
 `CREATE INDEX IF NOT EXISTS paper_trades_user_idx ON paper_trades(user_id)`,
 `CREATE TABLE IF NOT EXISTS notification_devices (id text PRIMARY KEY,user_id text NOT NULL,platform text NOT NULL,provider text NOT NULL,token text,endpoint text,p256dh text,auth text,created_at bigint NOT NULL,updated_at bigint NOT NULL)`,
 `CREATE INDEX IF NOT EXISTS notification_devices_user_idx ON notification_devices(user_id)`,
 `CREATE INDEX IF NOT EXISTS notification_devices_provider_idx ON notification_devices(provider)`,
 `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS time_zone text`,
 `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS utc_offset_minutes integer`,
 `CREATE TABLE IF NOT EXISTS decision_notes (id text PRIMARY KEY,user_id text NOT NULL,asset_key text,note_text text NOT NULL,created_at bigint NOT NULL,updated_at bigint NOT NULL)`,
 `CREATE INDEX IF NOT EXISTS decision_notes_user_idx ON decision_notes(user_id)`,
 `CREATE INDEX IF NOT EXISTS decision_notes_asset_idx ON decision_notes(asset_key)`,
 `CREATE TABLE IF NOT EXISTS user_workspace_state (user_id text PRIMARY KEY,profile jsonb NOT NULL DEFAULT '{}'::jsonb,price_alerts jsonb NOT NULL DEFAULT '[]'::jsonb,passports jsonb NOT NULL DEFAULT '[]'::jsonb,updated_at bigint NOT NULL)`,
 `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS stable_user_id text`,
 `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'USER'`,
 `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'ACTIVE'`,
 `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'fr'`,
 `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url text`,
 `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_login_at bigint`,
 `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at bigint`,
 `UPDATE user_profiles SET stable_user_id=id WHERE stable_user_id IS NULL`,
 `ALTER TABLE user_profiles ALTER COLUMN stable_user_id SET NOT NULL`,
 `CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_stable_user_id_uidx ON user_profiles(stable_user_id)`,
 `CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role)`,
 `CREATE INDEX IF NOT EXISTS user_profiles_account_status_idx ON user_profiles(account_status)`,
 `CREATE TABLE IF NOT EXISTS subscriptions (id text PRIMARY KEY,user_id text NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,plan text NOT NULL DEFAULT 'DISCOVERY' CHECK(plan IN ('DISCOVERY','PRO','EXPERT')),status text NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('TRIALING','ACTIVE','PAST_DUE','CANCELED','SUSPENDED')),stripe_customer_id text,stripe_subscription_id text,stripe_price_id text,current_period_end bigint,cancel_at_period_end boolean NOT NULL DEFAULT false,trial_ends_at bigint,created_at bigint NOT NULL,updated_at bigint NOT NULL)`,
 `CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_uidx ON subscriptions(user_id)`,
 `CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_customer_uidx ON subscriptions(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL`,
 `CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_subscription_uidx ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL`,
 `CREATE INDEX IF NOT EXISTS subscriptions_plan_status_idx ON subscriptions(plan,status)`,
 `CREATE TABLE IF NOT EXISTS plan_entitlements (plan text NOT NULL CHECK(plan IN ('DISCOVERY','PRO','EXPERT')),feature text NOT NULL,enabled boolean NOT NULL DEFAULT true,limits jsonb NOT NULL DEFAULT '{}'::jsonb,created_at bigint NOT NULL,updated_at bigint NOT NULL,PRIMARY KEY(plan,feature))`,
 `CREATE INDEX IF NOT EXISTS plan_entitlements_feature_idx ON plan_entitlements(feature)`,
 `CREATE TABLE IF NOT EXISTS usage_counters (id text PRIMARY KEY,user_id text NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,feature text NOT NULL,window_start bigint NOT NULL,window_end bigint NOT NULL,usage_count bigint NOT NULL DEFAULT 0 CHECK(usage_count>=0),created_at bigint NOT NULL,updated_at bigint NOT NULL,CHECK(window_end>window_start))`,
 `CREATE UNIQUE INDEX IF NOT EXISTS usage_counters_window_uidx ON usage_counters(user_id,feature,window_start)`,
 `CREATE INDEX IF NOT EXISTS usage_counters_user_window_idx ON usage_counters(user_id,window_end)`,
 `CREATE TABLE IF NOT EXISTS admin_audit_logs (id text PRIMARY KEY,actor_user_id text NOT NULL REFERENCES user_profiles(id) ON DELETE RESTRICT,target_user_id text REFERENCES user_profiles(id) ON DELETE RESTRICT,action text NOT NULL,before jsonb,after jsonb,reason text NOT NULL,created_at bigint NOT NULL)`,
 `CREATE INDEX IF NOT EXISTS admin_audit_logs_actor_idx ON admin_audit_logs(actor_user_id)`,
 `CREATE INDEX IF NOT EXISTS admin_audit_logs_target_idx ON admin_audit_logs(target_user_id)`,
 `CREATE INDEX IF NOT EXISTS admin_audit_logs_created_idx ON admin_audit_logs(created_at)`,
] as const;

export async function runUserSyncMigrations(){
 const url=connectionString();
 if(!url)throw new Error('storage_not_configured');
 const before=await getUserSyncHealth();
 if(before.missingTables.length===0&&before.missingPreferenceColumns.length===0&&before.missingProfileColumns.length===0)return{changed:false,before,after:before};
 const sql=neon(url);
 for(const statement of statements)await sql.query(statement,[]);
 const after=await getUserSyncHealth();
 if(after.missingTables.length||after.missingPreferenceColumns.length||after.missingProfileColumns.length)throw new Error('migration_incomplete');
 return{changed:true,before,after};
}
