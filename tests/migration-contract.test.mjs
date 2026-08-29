import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const route=fs.readFileSync('app/api/user-sync/migrate/route.ts','utf8');
const runner=fs.readFileSync('lib/user-sync-migration-runner.ts','utf8');
const migration1=fs.readFileSync('db/migrations/0001_user_sync_postgres.sql','utf8');
const migration2=fs.readFileSync('db/migrations/0002_notification_devices.sql','utf8');
const migration3=fs.readFileSync('db/migrations/0003_notification_timezone.sql','utf8');

test('migration endpoint is preview and branch restricted',()=>{
 assert.match(route,/VERCEL_ENV!=='preview'/);
 assert.match(route,/VERCEL_GIT_COMMIT_REF/);
 assert.match(route,/feat\/flutter-mobile-sync/);
 assert.match(route,/confirmation_required/);
 assert.match(route,/APPLY_USER_SYNC_V1/);
});

test('migration runner is idempotent and matches versioned schema intent',()=>{
 for(const table of ['user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades'])assert.match(runner,new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
 assert.match(runner,/CREATE INDEX IF NOT EXISTS watchlist_items_user_idx/);
 assert.match(runner,/CREATE INDEX IF NOT EXISTS notification_devices_user_idx/);
 assert.match(runner,/ADD COLUMN IF NOT EXISTS time_zone/);
 assert.match(runner,/ADD COLUMN IF NOT EXISTS utc_offset_minutes/);
 assert.match(runner,/getUserSyncHealth/);
 assert.match(runner,/migration_incomplete/);
 assert.match(migration1,/CREATE TABLE IF NOT EXISTS/);
 assert.match(migration2,/CREATE TABLE IF NOT EXISTS notification_devices/);
 assert.match(migration3,/ADD COLUMN IF NOT EXISTS time_zone/);
 assert.match(migration3,/ADD COLUMN IF NOT EXISTS utc_offset_minutes/);
});

test('migration endpoint never exposes connection secrets',()=>{
 assert.doesNotMatch(route,/DATABASE_URL|POSTGRES_URL|NEON_DATABASE_URL|NEON_POSTGRES_URL/);
 assert.doesNotMatch(route,/PRIVATE_KEY|SECRET/);
});
