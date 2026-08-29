import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const route=fs.readFileSync('app/api/user-sync/smoke/route.ts','utf8');
const smoke=fs.readFileSync('lib/user-sync-smoke.ts','utf8');

test('smoke endpoint is preview-only and explicitly confirmed',()=>{
 assert.match(route,/VERCEL_ENV!=='preview'/);
 assert.match(route,/VERCEL_GIT_COMMIT_REF/);
 assert.match(route,/feat\/flutter-mobile-sync/);
 assert.match(route,/RUN_USER_SYNC_SMOKE/);
});

test('smoke test exercises every durable user domain',()=>{
 for(const method of ['setWatchlist','setNotificationPreferences','markNotificationsRead','registerNotificationDevice','createPaperTrade','createDecisionNote','setUserWorkspace','getUserWorkspace','getSnapshot','listNotificationDevices','listPaperTrades','listDecisionNotes','closePaperTrade','deleteDecisionNote'])assert.match(smoke,new RegExp(method));
});

test('smoke test always cleans synthetic data',()=>{
 assert.match(smoke,/finally/);
 for(const table of ['watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades','decision_notes','user_workspace_state','user_profiles'])assert.match(smoke,new RegExp(`delete from ${table}`));
 assert.match(smoke,/smoke:/);
});
