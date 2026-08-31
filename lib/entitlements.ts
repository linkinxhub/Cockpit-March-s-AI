import type{AccountMembership,CommercialPlan}from'./account-types';

export const FEATURES=['DASHBOARD_BASIC','ALL_ASSETS','REALTIME_REFRESH','FULL_TIMEFRAMES','TECHNICAL_INDICATORS','ICHIMOKU_ADVANCED','FORECASTS','MULTI_TIMEFRAME','AI_INSTANT_ANALYSIS','DECISION_PASSPORTS','ALERTS','PAPER_TRADING','EXTENDED_HISTORY','ADMIN_PANEL']as const;
export type Feature=(typeof FEATURES)[number];
export type FeatureLimit={monthly?:number;daily?:number;maximum?:number};
export type PlanDefinition={features:readonly Feature[];limits:Partial<Record<Feature,FeatureLimit>>};

export const PLAN_ENTITLEMENTS:Record<CommercialPlan,PlanDefinition>={
 DISCOVERY:{features:['DASHBOARD_BASIC','TECHNICAL_INDICATORS'],limits:{ALL_ASSETS:{maximum:12},FULL_TIMEFRAMES:{maximum:3},ALERTS:{maximum:0},AI_INSTANT_ANALYSIS:{monthly:0}}},
 PRO:{features:['DASHBOARD_BASIC','ALL_ASSETS','REALTIME_REFRESH','FULL_TIMEFRAMES','TECHNICAL_INDICATORS','ICHIMOKU_ADVANCED','FORECASTS','MULTI_TIMEFRAME','ALERTS','EXTENDED_HISTORY'],limits:{ALERTS:{maximum:25},AI_INSTANT_ANALYSIS:{monthly:0}}},
 EXPERT:{features:['DASHBOARD_BASIC','ALL_ASSETS','REALTIME_REFRESH','FULL_TIMEFRAMES','TECHNICAL_INDICATORS','ICHIMOKU_ADVANCED','FORECASTS','MULTI_TIMEFRAME','AI_INSTANT_ANALYSIS','DECISION_PASSPORTS','ALERTS','PAPER_TRADING','EXTENDED_HISTORY'],limits:{ALERTS:{maximum:100},AI_INSTANT_ANALYSIS:{monthly:300}}},
};

const planOrder:CommercialPlan[]=['DISCOVERY','PRO','EXPERT'];
function effectivePlan(membership:AccountMembership):CommercialPlan{return membership.subscriptionStatus==='ACTIVE'||membership.subscriptionStatus==='TRIALING'?membership.plan:'DISCOVERY';}
export function canAccess(feature:Feature,membership:AccountMembership):boolean{return membership.role==='ADMIN'||(membership.accountStatus!=='SUSPENDED'&&PLAN_ENTITLEMENTS[effectivePlan(membership)].features.includes(feature));}
export function requiredPlan(feature:Feature):CommercialPlan|null{for(const plan of planOrder)if(PLAN_ENTITLEMENTS[plan].features.includes(feature))return plan;return null;}
export function featureLimit(feature:Feature,membership:AccountMembership):FeatureLimit|null{if(membership.role==='ADMIN')return null;return PLAN_ENTITLEMENTS[effectivePlan(membership)].limits[feature]||null;}

export class EntitlementError extends Error{constructor(public feature:Feature,public required:CommercialPlan|null){super('entitlement_required');}}
export function requireEntitlement(feature:Feature,user:AccountMembership):AccountMembership{if(!canAccess(feature,user))throw new EntitlementError(feature,requiredPlan(feature));return user;}
