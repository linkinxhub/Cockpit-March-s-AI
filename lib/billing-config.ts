import'server-only';import type{AccountStatus}from'./account-types';

export const STRIPE_SERVER_CONFIG={restrictedKeyEnv:'STRIPE_RESTRICTED_KEY',webhookSecretEnv:'STRIPE_WEBHOOK_SECRET',apiVersion:'2026-07-29.dahlia',checkoutMode:'subscription',customerPortal:true,automaticTax:false}as const;
export const STRIPE_EVENT_STATUS:Record<string,AccountStatus>={'trialing':'TRIALING','active':'ACTIVE','past_due':'PAST_DUE','canceled':'CANCELED','unpaid':'SUSPENDED','paused':'SUSPENDED'};
export function billingReadiness(){return{checkoutConfigured:Boolean(process.env.STRIPE_RESTRICTED_KEY&&process.env.STRIPE_PRO_MONTHLY_PRICE_ID&&process.env.STRIPE_EXPERT_MONTHLY_PRICE_ID),webhookConfigured:Boolean(process.env.STRIPE_WEBHOOK_SECRET),liveBillingEnabled:false,taxEnabled:false};}
