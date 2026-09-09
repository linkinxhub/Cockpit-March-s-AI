import {billingPublicStatus} from './plan-billing-config';
import'server-only';import type{AccountStatus}from'./account-types';

export const STRIPE_SERVER_CONFIG={restrictedKeyEnv:'STRIPE_RESTRICTED_KEY',webhookSecretEnv:'STRIPE_WEBHOOK_SECRET',apiVersion:'2026-07-29.dahlia',checkoutMode:'subscription',customerPortal:true,automaticTax:false}as const;
export const STRIPE_EVENT_STATUS:Record<string,AccountStatus>={'trialing':'TRIALING','active':'ACTIVE','past_due':'PAST_DUE','canceled':'CANCELED','unpaid':'SUSPENDED','paused':'SUSPENDED'};
export function billingReadiness(){const b=billingPublicStatus();return{checkoutConfigured:b.ready,webhookConfigured:Boolean(process.env.STRIPE_WEBHOOK_SECRET),liveBillingEnabled:b.ready&&b.mode==='live',taxEnabled:false};}
