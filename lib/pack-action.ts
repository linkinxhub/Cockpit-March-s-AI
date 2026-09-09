export type PackMembership={plan:string;status:string;suspended:boolean;hasSubscription:boolean;hasCustomer:boolean};
export function packAction(target:string,m:PackMembership|null):'current'|'portal'|'account'|'checkout'|'blocked'{
 if(m?.suspended)return 'blocked';
 const active=!!m&&['active','trialing'].includes(m.status.toLowerCase());
 const current=active?(({discovery:'free',trader_plus:'expert'} as Record<string,string>)[m!.plan.toLowerCase()]||m!.plan.toLowerCase()):'free';
 if(m&&current===target)return 'current';
 if(m?.hasSubscription&&m.hasCustomer)return 'portal';
 return target==='free'?'account':'checkout';
}
