import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const web=fs.readFileSync('app/page.tsx','utf8');
const api=fs.readFileSync('app/api/user-sync/workspace/route.ts','utf8');
const store=fs.readFileSync('lib/user-workspace-store.ts','utf8');
const health=fs.readFileSync('lib/user-sync-health.ts','utf8');
const runner=fs.readFileSync('lib/user-sync-migration-runner.ts','utf8');
const migration=fs.readFileSync('db/migrations/0005_user_workspace_state.sql','utf8');
const manifest=fs.readFileSync('app/api/sync/manifest/route.ts','utf8');

test('business workspace is durable and server-backed',()=>{
  assert.match(api,/getSharedUserIdentity/);
  assert.match(api,/workspace/);
  assert.match(store,/user_workspace_state/);
  assert.match(store,/select profile,price_alerts,passports,updated_at/);
  assert.match(store,/profile=excluded\.profile/);
  assert.match(store,/price_alerts=excluded\.price_alerts/);
  assert.match(store,/passports=excluded\.passports/);
  assert.match(health,/user_workspace_state/);
  assert.match(runner,/CREATE TABLE IF NOT EXISTS user_workspace_state/);
  assert.match(migration,/CREATE TABLE IF NOT EXISTS user_workspace_state/);
});

test('web cockpit no longer stores business workspace in localStorage',()=>{
  assert.match(web,/\/api\/user-sync\/workspace/);
  for(const key of ['cockpit-alerts-v1','cockpit-profile-v1','cockpit-passports-v1']) assert.doesNotMatch(web,new RegExp(key));
  assert.doesNotMatch(web,/Ces valeurs restent enregistrées uniquement dans ce/);
  assert.match(web,/synchronisées avec votre compte Web et mobile via le stockage Neon sécurisé/);
});

test('ui-only preferences remain local while business state is synchronized',()=>{
  assert.match(web,/cockpit-language/);
  assert.match(web,/cockpit-sticky-enabled/);
  assert.match(web,/cockpit-decision-events-v1/);
});

test('manifest preserves workspace contract in v2.6',()=>{
  assert.match(manifest,/schemaVersion:'2\.6\.0'/);
  assert.match(manifest,/userWorkspace:'\/api\/user-sync\/workspace'/);
  assert.match(manifest,/0005_user_workspace_state\.sql/);
  assert.match(manifest,/traderProfile/);
  assert.match(manifest,/priceAlerts/);
  assert.match(manifest,/analysisPassports/);
});
