import 'server-only';
import {readAISettings,writeAISettings} from './ai-settings-store';
import {sealKey,openKey} from './ai-secret-crypto';
export const DEFAULT_AI_MODEL='gpt-5.6-luna';
function secret(){const value=process.env.AI_SETTINGS_ENCRYPTION_KEY||process.env.AUTH0_SECRET||'';if(value.length<32)throw Error('encryption_unavailable');return value;}
export async function getAICredentials(){const stored=await readAISettings();if(stored)return {apiKey:await openKey(stored.encrypted_key,secret()),model:stored.model,source:'saved',updatedAt:Number(stored.updated_at)};return {apiKey:process.env.OPENAI_API_KEY?.trim()||'',model:process.env.OPENAI_MODEL||DEFAULT_AI_MODEL,source:'environment',updatedAt:null};}
export async function aiSettingsStatus(){const c=await getAICredentials();return {configured:!!c.apiKey,model:c.model,source:c.apiKey?c.source:'none',updatedAt:c.updatedAt,canSave:(process.env.AI_SETTINGS_ENCRYPTION_KEY||process.env.AUTH0_SECRET||'').length>=32};}
export async function saveAICredentials(apiKey:string,model:string,actor:string){await writeAISettings(await sealKey(apiKey,secret()),model,actor,Date.now());}
