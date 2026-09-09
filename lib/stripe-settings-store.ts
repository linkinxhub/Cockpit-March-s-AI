import 'server-only';
import {neon} from '@neondatabase/serverless';

function db(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL;if(!url)throw Error('storage');return neon(url);}
export async function readStripeSettings(){const sql=db();const rows=await sql`SELECT encrypted_key,model,updated_at FROM ai_settings WHERE id='stripe_test'`;return rows[0] as {encrypted_key:string;model:string;updated_at:number}|undefined;}
export async function writeStripeSettings(encrypted:string,model:string,actor:string,now:number){const sql=db();await sql`INSERT INTO ai_settings (id,encrypted_key,model,updated_by,updated_at) VALUES ('stripe_test',${encrypted},${model},${actor},${now}) ON CONFLICT(id) DO UPDATE SET encrypted_key=excluded.encrypted_key,model=excluded.model,updated_by=excluded.updated_by,updated_at=excluded.updated_at`;}
