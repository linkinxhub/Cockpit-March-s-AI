import{neon}from'@neondatabase/serverless';
import type{BillingPlan}from'./billing-config';

type BillingStatus='free'|'trialing'|'active'|'past_due'|'canceled'|'unpaid'|'incomplete'|'paused';
export type BillingState={userId:string;plan:BillingPlan;status:BillingStatus;stripeCustomerId:string|null;stripeSubscriptionId:string|null;stripePriceId:string|null;currentPeriodEnd:number|null;cancelAtPeriodEnd:boolean;updatedAt:number};

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}
function sql(){const url=connectionString();if(!url)throw new Error('storage_not_configured');return neon(url);}
const freeState=(userId:string):BillingState=>({userId,plan:'FREE',status:'free',stripeCustomerId:null,stripeSubscriptionId:null,stripePriceId:null,currentPeriodEnd:null,cancelAtPeriodEnd:false,updatedAt:0});

export async function getBillingState(userId:string):Promise<BillingState>{const rows=await sql()`select user_id,plan,status,stripe_customer_id,stripe_subscription_id,stripe_price_id,current_period_end,cancel_at_period_end,updated_at from billing_subscriptions where user_id=${userId} limit 1`;const row=rows[0] as any|undefined;if(!row)return freeState(userId);return{userId:String(row.user_id),plan:(row.plan||'FREE') as BillingPlan,status:(row.status||'free') as BillingStatus,stripeCustomerId:row.stripe_customer_id?String(row.stripe_customer_id):null,stripeSubscriptionId:row.stripe_subscription_id?String(row.stripe_subscription_id):null,stripePriceId:row.stripe_price_id?String(row.stripe_price_id):null,currentPeriodEnd:row.current_period_end==null?null:Number(row.current_period_end),cancelAtPeriodEnd:Boolean(row.cancel_at_period_end),updatedAt:Number(row.updated_at)||0};}

export async function upsertBillingState(input:BillingState){await sql()`insert into billing_subscriptions(user_id,plan,status,stripe_customer_id,stripe_subscription_id,stripe_price_id,current_period_end,cancel_at_period_end,updated_at) values(${input.userId},${input.plan},${input.status},${input.stripeCustomerId},${input.stripeSubscriptionId},${input.stripePriceId},${input.currentPeriodEnd},${input.cancelAtPeriodEnd},${input.updatedAt}) on conflict(user_id) do update set plan=excluded.plan,status=excluded.status,stripe_customer_id=excluded.stripe_customer_id,stripe_subscription_id=excluded.stripe_subscription_id,stripe_price_id=excluded.stripe_price_id,current_period_end=excluded.current_period_end,cancel_at_period_end=excluded.cancel_at_period_end,updated_at=excluded.updated_at`;return input;}

export async function findUserIdByStripeCustomer(customerId:string){const rows=await sql()`select user_id from billing_subscriptions where stripe_customer_id=${customerId} limit 1`;return rows[0]?.user_id?String(rows[0].user_id):null;}
export async function findUserIdByStripeSubscription(subscriptionId:string){const rows=await sql()`select user_id from billing_subscriptions where stripe_subscription_id=${subscriptionId} limit 1`;return rows[0]?.user_id?String(rows[0].user_id):null;}
export function hasPaidEntitlement(state:BillingState){return(state.plan==='PRO'||state.plan==='INSTITUTIONAL')&&['trialing','active'].includes(state.status);}
