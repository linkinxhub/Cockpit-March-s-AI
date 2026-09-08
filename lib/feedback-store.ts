import 'server-only';
import {neon} from '@neondatabase/serverless';
import {authorizeApiRequest} from './access-control';
import {FeedbackError,validateFeedback} from './feedback-validation';
function db(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL;if(!url)throw Error('storage');return neon(url);}
export async function feedbackAuth(admin:boolean){const a=await authorizeApiRequest(admin?{roles:['ADMIN']}:{});if(a.response)throw new FeedbackError(a.response.status,'authentication_required');return {email:a.context.identity.email};}
export async function saveFeedback(user:{email:string},d:ReturnType<typeof validateFeedback>){const sql=db();const count=await sql`SELECT count(*) AS n FROM feedback WHERE email=${user.email} AND created_at>${Date.now()-3600000}`;if(Number(count[0]?.n)>=10)throw new FeedbackError(429,'rate_limited');await sql`INSERT INTO feedback (id,email,message,category,page,status,created_at,image) VALUES (${d.id},${user.email},${d.message},${d.category},${d.page},'open',${d.createdAt},${d.image})`;}
export async function listFeedback(){const sql=db();return sql`SELECT id,email,message,category,page,status,created_at,(image IS NOT NULL) AS has_image FROM feedback ORDER BY created_at DESC LIMIT 100`;}
export async function updateFeedback(id:string,status:string,actor:string){const sql=db();const rows=await sql`UPDATE feedback SET status=${status},updated_by=${actor},updated_at=${Date.now()} WHERE id=${id} RETURNING id`;return rows.length>0;}
export async function feedbackImage(id:string){const sql=db();const rows=await sql`SELECT image FROM feedback WHERE id=${id}`;return rows[0]?.image?Uint8Array.from(atob(String(rows[0].image).split(',')[1]),c=>c.charCodeAt(0)):null;}
