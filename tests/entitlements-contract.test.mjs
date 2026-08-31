import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
const read=path=>fs.readFileSync(path,'utf8');
const catalog=read('lib/entitlements.ts'),access=read('lib/access-control.ts'),cockpit=read('app/page.tsx'),workspace=read('app/api/user-sync/workspace/route.ts');

test('feature catalog and plans are centralized and typed',()=>{
 for(const feature of['DASHBOARD_BASIC','ALL_ASSETS','REALTIME_REFRESH','FULL_TIMEFRAMES','TECHNICAL_INDICATORS','ICHIMOKU_ADVANCED','FORECASTS','MULTI_TIMEFRAME','AI_INSTANT_ANALYSIS','DECISION_PASSPORTS','ALERTS','PAPER_TRADING','EXTENDED_HISTORY','ADMIN_PANEL'])assert.match(catalog,new RegExp(`'${feature}'`));
 for(const plan of['DISCOVERY','PRO','EXPERT'])assert.match(catalog,new RegExp(`${plan}:`));
 assert.match(catalog,/role==='ADMIN'/);
 assert.match(catalog,/subscriptionStatus==='ACTIVE'/);
 assert.match(catalog,/export function canAccess/);
 assert.match(catalog,/export function requireEntitlement/);
});

test('premium APIs enforce entitlements on the server',()=>{
 const routes={ICHIMOKU_ADVANCED:'app/api/ichimoku-history/route.ts',AI_INSTANT_ANALYSIS:'app/api/ai-analysis/route.ts',PAPER_TRADING:'app/api/user-sync/paper-trades/route.ts',ALERTS:'app/api/notifications/personalized/route.ts'};
 for(const[feature,file]of Object.entries(routes)){const source=read(file);assert.match(source,/authorizeFeatureApi/,file);assert.match(source,new RegExp(`'${feature}'|"${feature}"`),file);}
 assert.match(access,/entitlement_required/);
 assert.match(access,/requiredPlan/);
 assert.match(access,/pricingUrl:'\/pricing'/);
});

test('Discovery limitations cannot delete preserved premium workspace data',()=>{
 assert.match(workspace,/canAccess\('ALERTS'/);
 assert.match(workspace,/canAccess\('DECISION_PASSPORTS'/);
 assert.match(workspace,/current\.priceAlerts/);
 assert.match(workspace,/current\.passports/);
});

test('cockpit exposes non-aggressive premium locks and pricing navigation',()=>{
 assert.match(cockpit,/\/api\/account\/entitlements/);
 assert.match(cockpit,/lockedFeature/);
 assert.match(cockpit,/role="status"/);
 assert.match(cockpit,/href="\/pricing"/);
 assert.doesNotMatch(cockpit,/premiumError|upgradeError/);
});
