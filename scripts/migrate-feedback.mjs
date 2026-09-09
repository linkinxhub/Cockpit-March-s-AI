import {readFileSync} from 'node:fs';
import {neon} from '@neondatabase/serverless';
// Production-only, additive and idempotent. Preview builds never mutate the production database.
if(process.env.VERCEL_ENV==='production'){
 const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL;
 if(!url)throw new Error('feedback_database_not_configured');
 const sql=neon(url);
 const statements=readFileSync(new URL('../db/migrations/0007_feedback.sql',import.meta.url),'utf8').split(';').map(s=>s.trim()).filter(Boolean);
 for(const statement of statements)await sql.query(statement,[]);
 for(const statement of readFileSync(new URL('../db/migrations/0008_ai_settings.sql',import.meta.url),'utf8').split(';').map(s=>s.trim()).filter(Boolean))await sql.query(statement,[]);
 for(const statement of readFileSync(new URL('../db/migrations/0009_billing_events.sql',import.meta.url),'utf8').split(';').map(s=>s.trim()).filter(Boolean))await sql.query(statement,[]);
 console.log('Application schemas ready');
}
