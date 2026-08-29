import{neon}from'@neondatabase/serverless';
import{legalConfigured}from'./legal-config';

function dbUrl(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}
function present(name:string){return Boolean(process.env[name]);}

export async function commercialReadiness(){
 const blockers:string[]=[],warnings:string[]=[];const url=dbUrl();let billingSchema=false;
 if(!url)blockers.push('database_not_configured');else try{const sql=neon(url);const rows=await sql`select table_name from information_schema.tables where table_schema='public' and table_name in ('billing_subscriptions','billing_webhook_events')`;billingSchema=new Set(rows.map((r:any)=>String(r.table_name))).size===2;if(!billingSchema)blockers.push('billing_migration_0006_missing');}catch{blockers.push('database_health_failed');}
 if(!present('STRIPE_SECRET_KEY'))blockers.push('stripe_secret_missing');
 if(!present('STRIPE_WEBHOOK_SECRET'))blockers.push('stripe_webhook_secret_missing');
 if(!present('STRIPE_PRICE_PRO'))blockers.push('stripe_pro_price_missing');
 if(!present('STRIPE_PRICE_INSTITUTIONAL'))blockers.push('stripe_institutional_price_missing');
 if(!present('PUBLIC_APP_URL'))blockers.push('public_app_url_missing');
 if(!legalConfigured())blockers.push('legal_operator_incomplete');
 if(!present('MOBILE_SESSION_SECRET'))blockers.push('mobile_session_secret_missing');
 const stripeMode=process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')?'live':process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')?'test':'unknown';if(stripeMode!=='live')warnings.push('stripe_not_live');
 const webPush=present('WEB_PUSH_PUBLIC_KEY')&&present('WEB_PUSH_PRIVATE_KEY');const fcm=present('FCM_PROJECT_ID')&&present('FCM_CLIENT_EMAIL')&&present('FCM_PRIVATE_KEY');const apns=present('APNS_KEY_ID')&&present('APNS_TEAM_ID')&&present('APNS_PRIVATE_KEY');if(!webPush)warnings.push('web_push_delivery_not_configured');if(!fcm)warnings.push('android_push_delivery_not_configured');if(!apns)warnings.push('ios_push_delivery_not_configured');
 return{ready:blockers.length===0&&stripeMode==='live',billingSchema,stripeMode,push:{web:webPush,android:fcm,ios:apns},blockers,warnings,checkedAt:new Date().toISOString()};
}
