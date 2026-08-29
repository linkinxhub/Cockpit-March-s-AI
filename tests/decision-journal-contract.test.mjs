import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const schema=fs.readFileSync('db/schema.ts','utf8');
const migration=fs.readFileSync('db/migrations/0004_decision_notes.sql','utf8');
const store=fs.readFileSync('lib/user-sync-store.ts','utf8');
const api=fs.readFileSync('app/api/user-sync/decision-notes/route.ts','utf8');
const web=fs.readFileSync('app/page.tsx','utf8');
const flutter=fs.readFileSync('mobile/lib/features/sync/data/user_sync_repository.dart','utf8');
const flutterUi=fs.readFileSync('mobile/lib/features/paper_trading/presentation/paper_trading_view.dart','utf8');
const manifest=fs.readFileSync('app/api/sync/manifest/route.ts','utf8');

test('decision journal is durable and separate from paper trading',()=>{
 assert.match(schema,/decision_notes/);
 assert.match(migration,/CREATE TABLE IF NOT EXISTS decision_notes/);
 assert.match(store,/listDecisionNotes/);
 assert.match(store,/createDecisionNote/);
 assert.match(store,/deleteDecisionNote/);
 assert.match(api,/getSharedUserIdentity/);
 assert.match(api,/text_too_long/);
 assert.match(api,/crypto\.randomUUID/);
});

test('web cockpit decision journal uses Neon APIs instead of local storage',()=>{
 assert.match(web,/\/api\/user-sync\/decision-notes/);
 assert.match(web,/removeJournalNote/);
 assert.doesNotMatch(web,/cockpit-journal-v1/);
});

test('Flutter exposes and renders synchronized decision notes',()=>{
 assert.match(flutter,/class DecisionNote/);
 assert.match(flutter,/decisionNotes\(\)/);
 assert.match(flutter,/createDecisionNote/);
 assert.match(flutter,/deleteDecisionNote/);
 assert.match(flutterUi,/Notes de décision synchronisées/);
 assert.match(flutterUi,/createDecisionNote/);
 assert.match(flutterUi,/removeDecisionNote/);
});

test('manifest publishes decision journal contract v2.3',()=>{
 assert.match(manifest,/schemaVersion:'2\.3\.0'/);
 assert.match(manifest,/decisionNotes:'\/api\/user-sync\/decision-notes'/);
 assert.match(manifest,/0004_decision_notes\.sql/);
 assert.match(manifest,/decisionJournal/);
});
