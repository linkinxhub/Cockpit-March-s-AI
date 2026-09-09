import 'server-only';
import {readStripeSettings,writeStripeSettings} from './stripe-settings-store';
import {sealKey,openKey} from './stripe-secret-crypto';
import {isTestKey,isWebhookSecret} from './stripe-test-policy';
export type StripeSecrets={apiKey:string;webhookSecret:string;portalConfiguration?:string};
function secret(){const value=process.env.AI_SETTINGS_ENCRYPTION_KEY||process.env.AUTH0_SECRET||'';if(value.length<32)throw Error('encryption_unavailable');return value;}
export function stripeCanSave(){return (process.env.AI_SETTINGS_ENCRYPTION_KEY||process.env.AUTH0_SECRET||'').length>=32;}
export async function getStripeSecrets():Promise<StripeSecrets>{const stored=await readStripeSettings();if(stored){const value=JSON.parse(await openKey(stored.encrypted_key,secret()));if(!isTestKey(value.apiKey)||!isWebhookSecret(value.webhookSecret))throw Error('invalid_saved_configuration');return value;}
 return {apiKey:process.env.STRIPE_RESTRICTED_KEY?.trim()||'',webhookSecret:process.env.STRIPE_WEBHOOK_SECRET?.trim()||''};}
export async function stripeSettingsStatus(){const c=await getStripeSecrets();return {keyConfigured:isTestKey(c.apiKey),webhookConfigured:isWebhookSecret(c.webhookSecret),configured:isTestKey(c.apiKey)&&isWebhookSecret(c.webhookSecret),canSave:stripeCanSave(),mode:'test'};}
export async function saveStripeSecrets(value:StripeSecrets,actor:string){if(!isTestKey(value.apiKey)||!isWebhookSecret(value.webhookSecret))throw Error('invalid_test_configuration');await writeStripeSettings(await sealKey(JSON.stringify(value),secret()),'stripe-test-v1',actor,Date.now());}
