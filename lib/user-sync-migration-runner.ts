import{neon}from'@neondatabase/serverless';
import{getUserSyncHealth}from'./user-sync-health';

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}

const statements=[
 `CREATE TABLE IF NOT EXISTS user_profiles (id text PRIMARY KEY,email text NOT NULL,display_name text NOT NULL,created_at bigint NOT NULL,updated_at bigint NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS watchlist_items (user_id text NOT NULL,asset_key text NOT NULL,created_at bigint NOT NULL,PRIMARY KEY (user_id,asset_key))`,
 `CREATE TABLE IF NOT EXISTS notification_preferences (user_id text PRIMARY KEY,minimum_severity text NOT NULL DEFAULT 'IMPORTANT',watched_only boolean NOT NULL DEFAULT true,push_enabled boolean NOT NULL DEFAULT false,quiet_hours_start text,quiet_hours_end text,updated_at bigint NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS notification_reads (user_id text NOT NULL,event_id text NOT NULL,read_at bigint NOT NULL,PRIMARY KEY (user_id,event_id))`,
 `CREATE TABLE IF NOT EXISTS paper_trades (id text PRIMARY KEY,user_id text NOT NULL,asset_key text NOT NULL,side text NOT NULL,quantity text NOT NULL,entry_price text NOT NULL,exit_price text,opened_at bigint NOT NULL,closed_at bigint,note text)`,
 `CREATE INDEX IF NOT EXISTS watchlist_items_user_idx ON watchlist_items(user_id)`,
 `CREATE INDEX IF NOT EXISTS notification_reads_user_idx ON notification_reads(user_id)`,
 `CREATE INDEX IF NOT EXISTS paper_trades_user_idx ON paper_trades(user_id)`,
 `CREATE TABLE IF NOT EXISTS notification_devices (id text PRIMARY KEY,user_id text NOT NULL,platform text NOT NULL,provider text NOT NULL,token text,endpoint text,p256dh text,auth text,created_at bigint NOT NULL,updated_at bigint NOT NULL)`,
 `CREATE INDEX IF NOT EXISTS notification_devices_user_idx ON notification_devices(user_id)`,
 `CREATE INDEX IF NOT EXISTS notification_devices_provider_idx ON notification_devices(provider)`,
 `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS time_zone text`,
 `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS utc_offset_minutes integer`,
 `CREATE TABLE IF NOT EXISTS decision_notes (id text PRIMARY KEY,user_id text NOT NULL,asset_key text,note_text text NOT NULL,created_at bigint NOT NULL,updated_at bigint NOT NULL)`,
 `CREATE INDEX IF NOT EXISTS decision_notes_user_idx ON decision_notes(user_id)`,
 `CREATE INDEX IF NOT EXISTS decision_notes_asset_idx ON decision_notes(asset_key)`,
 `CREATE TABLE IF NOT EXISTS user_workspace_state (user_id text PRIMARY KEY,profile jsonb NOT NULL DEFAULT '{}'::jsonb,price_alerts jsonb NOT NULL DEFAULT '[]'::jsonb,passports jsonb NOT NULL DEFAULT '[]'::jsonb,updated_at bigint NOT NULL)`,
] as const;

export async function runUserSyncMigrations(){
 const url=connectionString();
 if(!url)throw new Error('storage_not_configured');
 const before=await getUserSyncHealth();
 if(before.missingTables.length===0&&before.missingPreferenceColumns.length===0)return{changed:false,before,after:before};
 const sql=neon(url);
 for(const statement of statements)await sql.query(statement,[]);
 const after=await getUserSyncHealth();
 if(after.missingTables.length||after.missingPreferenceColumns.length)throw new Error('migration_incomplete');
 return{changed:true,before,after};
}
