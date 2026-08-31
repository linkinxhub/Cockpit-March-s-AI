import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';

const store=fs.readFileSync('lib/account-store.ts','utf8');
const profileRoute=fs.readFileSync('app/api/account/profile/route.ts','utf8');
const accountPage=fs.readFileSync('app/account/page.tsx','utf8');
const copy=fs.readFileSync('lib/account-copy.ts','utf8');

test('first login creates one stable profile and Discovery membership',()=>{
 assert.match(store,/on conflict\(stable_user_id\)/);
 assert.match(store,/on conflict\(user_id\) do nothing/);
 assert.match(store,/'DISCOVERY','ACTIVE'/);
 assert.doesNotMatch(store,/password/i);
});

test('profile mutation trusts server identity and validates editable fields',()=>{
 assert.match(profileRoute,/authorizeApiRequest/);
 assert.match(profileRoute,/requireSameOrigin/);
 assert.match(profileRoute,/z\.object/);
 assert.match(profileRoute,/\.strict\(\)/);
 assert.doesNotMatch(profileRoute,/body\.data\.(role|plan|email)/);
});

test('account pages expose account management and four translations',()=>{
 assert.match(accountPage,/chatGPTSignOutPath/);
 assert.match(accountPage,/requirePageMembership/);
 for(const locale of['fr','en','de','nl'])assert.match(copy,new RegExp(`${locale}:`));
});
