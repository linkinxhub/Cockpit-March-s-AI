import type{CommercialPlan}from'./account-types';
export const BILLING_CATALOG={DISCOVERY:{monthlyPriceEur:0,stripePriceEnv:null},PRO:{monthlyPriceEur:24,stripePriceEnv:'STRIPE_PRO_MONTHLY_PRICE_ID'},EXPERT:{monthlyPriceEur:49,stripePriceEnv:'STRIPE_EXPERT_MONTHLY_PRICE_ID'}}as const satisfies Record<CommercialPlan,{monthlyPriceEur:number;stripePriceEnv:string|null}>;
