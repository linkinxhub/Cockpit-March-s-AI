export type BillingPlan='FREE'|'PRO'|'INSTITUTIONAL';

export const billingPlans={
 FREE:{key:'FREE' as const,label:'Free',priceEnv:null,features:['Cockpit marché','Favoris synchronisés','Journal et Paper Trading','Indicateurs partagés'],limits:{aiAnalysesPerDay:5}},
 PRO:{key:'PRO' as const,label:'Pro',priceEnv:'STRIPE_PRICE_PRO',features:['Tout Free','Analyses IA avancées','Alertes personnalisées','Passeports et workspace synchronisés','Notifications prioritaires'],limits:{aiAnalysesPerDay:100}},
 INSTITUTIONAL:{key:'INSTITUTIONAL' as const,label:'Institutionnel',priceEnv:'STRIPE_PRICE_INSTITUTIONAL',features:['Tout Pro','Quota renforcé','Support prioritaire','Préparation multi-utilisateurs / B2B'],limits:{aiAnalysesPerDay:1000}},
} as const;

export function configuredPriceId(plan:BillingPlan){const env=billingPlans[plan].priceEnv;return env?process.env[env]||null:null;}
export function planFromPriceId(priceId:string|null|undefined):BillingPlan{if(!priceId)return'FREE';if(priceId===process.env.STRIPE_PRICE_PRO)return'PRO';if(priceId===process.env.STRIPE_PRICE_INSTITUTIONAL)return'INSTITUTIONAL';return'FREE';}
export function billingConfigured(){return Boolean(process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_WEBHOOK_SECRET&&process.env.STRIPE_PRICE_PRO&&process.env.STRIPE_PRICE_INSTITUTIONAL);}
