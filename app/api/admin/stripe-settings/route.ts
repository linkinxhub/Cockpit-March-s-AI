import {requireAISettingsOwner} from '@/lib/ai-settings-store';
import {AISettingsError} from '@/lib/ai-settings-http';
import {stripeSettingsStatus,getStripeSecrets,saveStripeSecrets} from '@/lib/stripe-settings';
import {readStripeBody,testStripeKey,prepareStripePortal} from '@/lib/stripe-settings-http';
import {isTestKey,isWebhookSecret} from '@/lib/stripe-test-policy';
export const dynamic='force-dynamic';
export const maxDuration=120;
const headers={'Cache-Control':'private, no-store'};
const attempts=new Map<string,number>();
function failure(e:unknown){return Response.json({error:e instanceof AISettingsError?e.code:'settings_unavailable'},{status:e instanceof AISettingsError?e.status:503,headers});}
export async function GET(){try{await requireAISettingsOwner();return Response.json(await stripeSettingsStatus(),{headers});}catch(e){return failure(e);}}
export async function POST(r:Request){try{const owner=await requireAISettingsOwner();const b=await readStripeBody(r);const now=Date.now();if(now-(attempts.get(owner)||0)<5000)throw new AISettingsError(429,'try_later');for(const [id,time]of attempts)if(now-time>60000)attempts.delete(id);attempts.set(owner,now);
 const old=await getStripeSecrets(),value={apiKey:b.apiKey||old.apiKey,webhookSecret:b.webhookSecret||old.webhookSecret};
 if(!isTestKey(value.apiKey))throw new AISettingsError(400,'test_key_required');
 if(b.action==='save'&&!isWebhookSecret(value.webhookSecret))throw new AISettingsError(400,'webhook_required');
 await testStripeKey(value.apiKey,new URL(r.url).origin);
 if(b.action==='save'){const portalConfiguration=await prepareStripePortal(value.apiKey,new URL(r.url).origin);await saveStripeSecrets({...value,portalConfiguration},owner);}
 return Response.json({ok:true,saved:b.action==='save'},{headers});
 }catch(e){return failure(e);}}
