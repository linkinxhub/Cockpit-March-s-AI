import {requireAISettingsOwner} from '@/lib/ai-settings-store';
import {aiSettingsStatus,getAICredentials,saveAICredentials} from '@/lib/ai-settings';
import {AISettingsError,readAISettingsBody,testAICredentials} from '@/lib/ai-settings-http';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store'};
const attempts=new Map<string,number>();
function failure(e:unknown){return Response.json({error:e instanceof AISettingsError?e.code:'settings_unavailable'},{status:e instanceof AISettingsError?e.status:503,headers});}
export async function GET(){try{await requireAISettingsOwner();return Response.json(await aiSettingsStatus(),{headers});}catch(e){return failure(e);}}
export async function POST(r:Request){try{const owner=await requireAISettingsOwner();const b=await readAISettingsBody(r);const now=Date.now();if(now-(attempts.get(owner)||0)<5000)throw new AISettingsError(429,'try_later');for(const [id,time]of attempts)if(now-time>60000)attempts.delete(id);attempts.set(owner,now);
 const apiKey=b.apiKey||(await getAICredentials()).apiKey;if(!apiKey)throw new AISettingsError(400,'key_required');
 await testAICredentials(apiKey,b.model);
 if(b.action==='save')await saveAICredentials(apiKey,b.model,owner);
 return Response.json({ok:true,saved:b.action==='save'},{headers});
 }catch(e){return failure(e);}}
