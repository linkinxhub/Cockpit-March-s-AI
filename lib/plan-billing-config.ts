import 'server-only';
import {getStripeSecrets} from './stripe-settings';
import {TEST_PRICES,isTestKey,isWebhookSecret} from './stripe-test-policy';
export async function billingConfig(){
 try{const c=await getStripeSecrets();return {key:c.apiKey,webhookSecret:c.webhookSecret,portalConfiguration:c.portalConfiguration||'',pro:TEST_PRICES.pro,expert:TEST_PRICES.expert,live:false,ready:isTestKey(c.apiKey)&&isWebhookSecret(c.webhookSecret)};}
 catch{return {key:'',webhookSecret:'',portalConfiguration:'',pro:TEST_PRICES.pro,expert:TEST_PRICES.expert,live:false,ready:false};}
}
export async function billingPublicStatus(){const c=await billingConfig();return {ready:c.ready,mode:'test'};}
