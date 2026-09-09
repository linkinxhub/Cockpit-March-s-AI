import {billingPublicStatus} from './plan-billing-config';
import'server-only';import type{AccountStatus}from'./account-types';

export const STRIPE_SERVER_CONFIG={restrictedKeyEnv:'STRIPE_RESTRICTED_KEY',webhookSecretEnv:'STRIPE_WEBHOOK_SECRET',apiVersion:'2026-07-29.dahlia',checkoutMode:'subscription',customerPortal:true,automaticTax:false}as const;
export const STRIPE_EVENT_STATUS:Record<string,AccountStatus>={'trialing':'TRIALING','active':'ACTIVE','past_due':'PAST_DUE','canceled':'CANCELED','unpaid':'SUSPENDED','paused':'SUSPENDED'};
export async function billingReadiness(){const b=await billingPublicStatus();return{checkoutConfigured:b.ready,webhookConfigured:b.ready,liveBillingEnabled:false,taxEnabled:false};}
