import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const route=fs.readFileSync('app/api/user-sync/migrate/route.ts','utf8');
const runner=fs.readFileSync('lib/user-sync-migration-runner.ts','utf8');
const migration1=fs.readFileSync('db/migrations/0001_user_sync_postgres.sql','utf8');
const migration2=fs.readFileSync('db/migrations/0002_notification_devices.sql','utf8');
const migration3=fs.readFileSync('db/migrations/0003_notification_timezone.sql','utf8');
const migration4=fs.readFileSync('db/migrations/0004_decision_notes.sql','utf8');
const migration5=fs.readFileSync('db/migrations/0005_user_workspace_state.sql','utf8');
const migration6=fs.readFileSync('db/migrations/0006_auth_rbac_subscriptions.sql','utf8');
const rollback6=fs.readFileSync('db/migrations/0006_auth_rbac_subscriptions.rollback.sql','utf8');
const schema=fs.readFileSync('db/schema.ts','utf8');

test('migration endpoint is preview and branch restricted',()=>{
 assert.match(route,/VERCEL_ENV!=='preview'/);
 assert.match(route,/VERCEL_GIT_COMMIT_REF/);
 assert.match(route,/feat\/flutter-mobile-sync/);
 assert.match(route,/feat\/auth-rbac-subscriptions/);
 assert.match(route,/confirmation_required/);
 assert.match(route,/APPLY_USER_SYNC_V1/);
});

test('migration runner is idempotent and matches versioned schema intent',()=>{
 for(const table of ['user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades','decision_notes','user_workspace_state','subscriptions','plan_entitlements','usage_counters','admin_audit_logs'])assert.match(runner,new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
 assert.match(runner,/CREATE INDEX IF NOT EXISTS watchlist_items_user_idx/);
 assert.match(runner,/CREATE INDEX IF NOT EXISTS notification_devices_user_idx/);
 assert.match(runner,/CREATE INDEX IF NOT EXISTS decision_notes_user_idx/);
 assert.match(runner,/ADD COLUMN IF NOT EXISTS time_zone/);
 assert.match(runner,/ADD COLUMN IF NOT EXISTS utc_offset_minutes/);
 assert.match(runner,/getUserSyncHealth/);
 assert.match(runner,/migration_incomplete/);
 assert.match(migration1,/CREATE TABLE IF NOT EXISTS/);
 assert.match(migration2,/CREATE TABLE IF NOT EXISTS notification_devices/);
 assert.match(migration3,/ADD COLUMN IF NOT EXISTS time_zone/);
 assert.match(migration4,/CREATE TABLE IF NOT EXISTS decision_notes/);
 assert.match(migration5,/CREATE TABLE IF NOT EXISTS user_workspace_state/);
 assert.match(migration5,/price_alerts jsonb/);
 assert.match(migration5,/passports jsonb/);
 for(const column of ['stable_user_id','role','account_status','locale','avatar_url','last_login_at','onboarding_completed_at'])assert.match(migration6,new RegExp(column));
 for(const table of ['subscriptions','plan_entitlements','usage_counters','admin_audit_logs']){
  assert.match(migration6,new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  assert.match(schema,new RegExp(table));
 }
 assert.match(migration6,/CHECK \(role IN \('USER','SUPPORT','ADMIN'\)\)/);
 assert.match(migration6,/CHECK \(plan IN \('DISCOVERY','PRO','EXPERT'\)\)/);
 assert.match(migration6,/CHECK \(status IN \('TRIALING','ACTIVE','PAST_DUE','CANCELED','SUSPENDED'\)\)/);
 assert.match(migration6,/stripe_customer_id/);
 assert.match(migration6,/cancel_at_period_end/);
 for(const table of ['subscriptions','plan_entitlements','usage_counters','admin_audit_logs'])assert.match(rollback6,new RegExp(`DROP TABLE IF EXISTS ${table}`));
 assert.match(rollback6,/DROP COLUMN IF EXISTS stable_user_id/);
});

test('migration endpoint never exposes connection secrets',()=>{
 assert.doesNotMatch(route,/DATABASE_URL|POSTGRES_URL|NEON_DATABASE_URL|NEON_POSTGRES_URL/);
 assert.doesNotMatch(route,/PRIVATE_KEY|SECRET/);
});
