import 'server-only';
export function billingConfig(){const key=process.env.STRIPE_RESTRICTED_KEY||'',live=key.includes('_live_'),enabled=!live||process.env.STRIPE_LIVE_ENABLED==='true';const pro=process.env.STRIPE_PRO_MONTHLY_PRICE_ID||(!live?'price_1U9hfjPaqMcvZjThyHhCdmiO':''),expert=process.env.STRIPE_EXPERT_MONTHLY_PRICE_ID||(!live?'price_1U9hfpPaqMcvZjThgzBA4ADB':'');return{key,pro,expert,live,ready:!!(key&&pro&&expert&&process.env.STRIPE_WEBHOOK_SECRET&&enabled)};}
export function billingPublicStatus(){const c=billingConfig();return{ready:c.ready,mode:c.live?'live':'test'};}
