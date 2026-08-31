import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';

const access=fs.readFileSync('lib/access-control.ts','utf8');
const privateRoutes=[
 'app/api/account/profile/route.ts','app/api/me/route.ts','app/api/mobile-session/route.ts',
 'app/api/notifications/dispatch-preview/route.ts','app/api/notifications/personalized/route.ts',
 'app/api/user-sync/decision-notes/route.ts','app/api/user-sync/notification-devices/route.ts',
 'app/api/user-sync/notification-preferences/route.ts','app/api/user-sync/notification-reads/route.ts',
 'app/api/user-sync/paper-trades/route.ts','app/api/user-sync/snapshot/route.ts',
 'app/api/user-sync/watchlist/route.ts','app/api/user-sync/workspace/route.ts',
];

test('central access guard distinguishes anonymous suspended and forbidden users',()=>{
 assert.match(access,/authentication_required/);
 assert.match(access,/accountStatus==='SUSPENDED'/);
 assert.match(access,/account_suspended/);
 assert.match(access,/options\.roles/);
 assert.match(access,/error:'forbidden'/);
 assert.match(access,/requireAdminRole/);
 assert.match(access,/membership\.role!=='ADMIN'/);
 assert.match(access,/requireSupportRole/);
});

test('every personal API uses the server membership guard',()=>{
 for(const file of privateRoutes){const source=fs.readFileSync(file,'utf8');assert.match(source,/authorizeApiRequest/,file);}
});

test('private user surfaces require an active server membership',()=>{
 for(const file of['app/journal/layout.tsx','app/watchlist/layout.tsx','app/notifications/layout.tsx','app/mobile-connect/layout.tsx'])assert.match(fs.readFileSync(file,'utf8'),/requirePageMembership/,file);
 const suspended=fs.readFileSync('app/account/suspended/page.tsx','utf8');
 assert.match(suspended,/allowSuspended:true/);
});
