import 'server-only';
import {neon} from '@neondatabase/serverless';
import {authorizeApiRequest} from './access-control';
import {AISettingsError} from './ai-settings-http';
function db(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL;if(!url)throw Error('storage');return neon(url);}
export async function requireAISettingsOwner(){const a=await authorizeApiRequest({roles:['ADMIN']});if(a.response)throw new AISettingsError(a.response.status,'forbidden');const id=a.context.identity.id,owner=process.env.BOOTSTRAP_ADMIN_STABLE_USER_ID;if(!owner||(id!==owner&&!(a.context.identity.source==='auth0'&&id.replace(/^auth0:/,'')===owner)))throw new AISettingsError(403,'forbidden');return a.context.identity.email;}
export async function readAISettings(){const sql=db();const rows=await sql`SELECT encrypted_key,model,updated_at FROM ai_settings WHERE id='openai'`;return rows[0] as {encrypted_key:string;model:string;updated_at:number}|undefined;}
export async function writeAISettings(encrypted:string,model:string,actor:string,now:number){const sql=db();await sql`INSERT INTO ai_settings (id,encrypted_key,model,updated_by,updated_at) VALUES ('openai',${encrypted},${model},${actor},${now}) ON CONFLICT(id) DO UPDATE SET encrypted_key=excluded.encrypted_key,model=excluded.model,updated_by=excluded.updated_by,updated_at=excluded.updated_at`;}
