import {AISettingsError} from './ai-settings-http';
import {isTestKey,isWebhookSecret,TEST_PRICES,validPrice} from './stripe-test-policy';
export async function readStripeBody(r:Request){
 const origin=r.headers.get('origin'),host=r.headers.get('x-forwarded-host')||r.headers.get('host')||new URL(r.url).host;
 try{if(!origin||new URL(origin).host!==host)throw Error();}catch{throw new AISettingsError(403,'forbidden');}
 const reader=r.body?.getReader();if(!reader)throw new AISettingsError(400,'invalid_input');let text='',size=0;const decoder=new TextDecoder();
 while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>6000){await reader.cancel();throw new AISettingsError(413,'invalid_input');}text+=decoder.decode(part.value,{stream:true});}text+=decoder.decode();
 let b:any;try{b=JSON.parse(text);}catch{throw new AISettingsError(400,'invalid_input');}
 if(!b||!['test','save'].includes(b.action)||typeof b.apiKey!=='string'||typeof b.webhookSecret!=='string')throw new AISettingsError(400,'invalid_input');
 const apiKey=b.apiKey.trim(),webhookSecret=b.webhookSecret.trim();
 if(apiKey&&!isTestKey(apiKey))throw new AISettingsError(400,'test_key_required');
 if(webhookSecret&&!isWebhookSecret(webhookSecret))throw new AISettingsError(400,'invalid_webhook_secret');
 return {action:b.action,apiKey,webhookSecret};
}
async function request(key:string,path:string,body?:URLSearchParams,idempotencyKey?:string){let r:Response;try{r=await fetch('https://api.stripe.com/v1/'+path,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${key}`,'Stripe-Version':'2026-07-29.dahlia',...(idempotencyKey?{'Idempotency-Key':idempotencyKey}:{}),...(body?{'Content-Type':'application/x-www-form-urlencoded'}:{})},body,signal:AbortSignal.timeout(12000)});}catch{throw new AISettingsError(502,'connection_failed');}
 if(!r.ok){await r.body?.cancel();throw new AISettingsError(r.status===429?429:400,r.status===401?'invalid_key':r.status===403?'missing_permissions':'stripe_test_failed');}return r.json();}
export async function testStripeKey(key:string,origin:string){
 if(!isTestKey(key))throw new AISettingsError(400,'test_key_required');
 const [pro,expert]=await Promise.all([request(key,'prices/'+TEST_PRICES.pro),request(key,'prices/'+TEST_PRICES.expert)]);
 if(!validPrice(pro,TEST_PRICES.pro,2400)||!validPrice(expert,TEST_PRICES.expert,4900))throw new AISettingsError(400,'wrong_account_or_prices');
 // Confirm subscription read access needed by the webhook before accepting this key.
 await request(key,'subscriptions?limit=1');
 // Validate Checkout write access without charging or creating a subscription.
 const session=await request(key,'checkout/sessions',new URLSearchParams({mode:'subscription','line_items[0][price]':TEST_PRICES.pro,'line_items[0][quantity]':'1',success_url:origin+'/admin/stripe-settings',cancel_url:origin+'/admin/stripe-settings','metadata[purpose]':'configuration_test',integration_identifier:'cockpitsetup_qmvztrks'}));
 if(session.livemode!==false||!/^cs_test_[A-Za-z0-9]+$/.test(session.id))throw new AISettingsError(400,'stripe_test_failed');
 await request(key,'checkout/sessions/'+session.id+'/expire',new URLSearchParams());
}

export async function prepareStripePortal(key:string,origin:string){
 const configs=await request(key,'billing_portal/configurations?active=true&limit=100');
 const existing=configs.data?.find((c:any)=>c.livemode===false&&c.metadata?.application==='cockpit-marches-ai'&&c.metadata?.origin===origin&&c.metadata?.settings_version==='1');
 if(existing)return existing.id as string;
 const body=new URLSearchParams({name:'Cockpit Marchés AI · Test',default_return_url:origin+'/account','metadata[application]':'cockpit-marches-ai','metadata[origin]':origin,'metadata[settings_version]':'1','features[invoice_history][enabled]':'true','features[payment_method_update][enabled]':'true','features[subscription_cancel][enabled]':'true','features[subscription_cancel][mode]':'at_period_end','features[subscription_update][enabled]':'true','features[subscription_update][default_allowed_updates][0]':'price','features[subscription_update][proration_behavior]':'always_invoice','features[subscription_update][products][0][product]':'prod_VA1jauO2EO15rt','features[subscription_update][products][0][prices][0]':TEST_PRICES.pro,'features[subscription_update][products][1][product]':'prod_VA1jwTtrdCk7hg','features[subscription_update][products][1][prices][0]':TEST_PRICES.expert});
 const config=await request(key,'billing_portal/configurations',body,'cockpit:portal:test:'+new URL(origin).host);
 if(config.livemode!==false||!/^bpc_[A-Za-z0-9]+$/.test(config.id))throw new AISettingsError(400,'stripe_test_failed');return config.id as string;
}
