import{test}from'node:test';import assert from'node:assert/strict';import fs from'node:fs';

test('every API mutation is protected centrally while Stripe webhook stays signature based',()=>{
 const proxy=fs.readFileSync('proxy.ts','utf8');
 assert.match(proxy,/mutation&&isApi&&!isWebhook&&!bearer/);
 assert.match(proxy,/invalid_request_origin/);
 assert.match(proxy,/\/api\/billing\/webhook/);
});

test('workspace and notification payloads are bounded',()=>{
 for(const file of['app/api/user-sync/workspace/route.ts','app/api/user-sync/notification-reads/route.ts','app/api/user-sync/notification-devices/route.ts'])assert.match(fs.readFileSync(file,'utf8'),/readBoundedJson/);
 const workspace=fs.readFileSync('lib/user-workspace-store.ts','utf8');
 assert.match(workspace,/text\.length>8_000/);
 assert.match(workspace,/value\.slice\(0,100\)/);
});

test('schema includes billing event ordering and guarded user foreign keys',()=>{
 const schema=fs.readFileSync('db/schema.ts','utf8'),migration=fs.readFileSync('db/migrations/0010_user_data_integrity.sql','utf8');
 const runner=fs.readFileSync('scripts/migrate-user-sync.mjs','utf8');
 assert.match(schema,/billingEventAt:bigint\('billing_event_at'/);
 assert.equal((migration.match(/ON DELETE CASCADE NOT VALID/g)||[]).length,7);
 assert.match(migration,/ON DELETE CASCADE/);
 for(const version of['0008_ai_settings.sql','0009_billing_events.sql','0010_user_data_integrity.sql'])assert.match(runner,new RegExp(version.replace('.','\\.')));
});

test('manual preview deploys the requested ref and CI executes all quality gates',()=>{
 const manual=fs.readFileSync('.github/workflows/manual-vercel-preview.yml','utf8'),ci=fs.readFileSync('.github/workflows/preview-build.yml','utf8');
 assert.match(manual,/ref: \$\{\{ inputs\.ref \}\}/);
 assert.doesNotMatch(manual,/ref: feat\/flutter-mobile-sync/);
 for(const command of['npm run lint','npm run build','node --test tests/'])assert.ok(ci.includes(command));
});
