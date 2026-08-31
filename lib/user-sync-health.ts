import{neon}from'@neondatabase/serverless';

const requiredTables=['user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades','decision_notes','user_workspace_state','subscriptions','plan_entitlements','usage_counters','admin_audit_logs'] as const;
const preferenceColumns=['time_zone','utc_offset_minutes'] as const;
const profileColumns=['stable_user_id','role','account_status','locale','avatar_url','last_login_at','onboarding_completed_at'] as const;

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}

export type UserSyncHealth={configured:boolean;connected:boolean;tables:string[];missingTables:string[];notificationPreferenceColumns:string[];missingPreferenceColumns:string[];userProfileColumns:string[];missingProfileColumns:string[];migrations:{userSync:boolean;notificationDevices:boolean;notificationTimezone:boolean;decisionNotes:boolean;userWorkspace:boolean;authRbacSubscriptions:boolean};postgresVersion:string|null};

export async function getUserSyncHealth():Promise<UserSyncHealth>{
 const url=connectionString();
 if(!url)return{configured:false,connected:false,tables:[],missingTables:[...requiredTables],notificationPreferenceColumns:[],missingPreferenceColumns:[...preferenceColumns],userProfileColumns:[],missingProfileColumns:[...profileColumns],migrations:{userSync:false,notificationDevices:false,notificationTimezone:false,decisionNotes:false,userWorkspace:false,authRbacSubscriptions:false},postgresVersion:null};
 const sql=neon(url);
 const[tableRows,columnRows,profileColumnRows,versionRows]=await Promise.all([
  sql`select table_name from information_schema.tables where table_schema='public' and table_name in ('user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades','decision_notes','user_workspace_state','subscriptions','plan_entitlements','usage_counters','admin_audit_logs')`,
  sql`select column_name from information_schema.columns where table_schema='public' and table_name='notification_preferences' and column_name in ('time_zone','utc_offset_minutes')`,
  sql`select column_name from information_schema.columns where table_schema='public' and table_name='user_profiles' and column_name in ('stable_user_id','role','account_status','locale','avatar_url','last_login_at','onboarding_completed_at')`,
  sql`select current_setting('server_version') as version`,
 ]);
 const tables=tableRows.map((row:any)=>String(row.table_name)),columns=columnRows.map((row:any)=>String(row.column_name)),userProfileColumns=profileColumnRows.map((row:any)=>String(row.column_name));
 const missingTables=requiredTables.filter(name=>!tables.includes(name)),missingPreferenceColumns=preferenceColumns.filter(name=>!columns.includes(name)),missingProfileColumns=profileColumns.filter(name=>!userProfileColumns.includes(name));
 const commercialTables=['subscriptions','plan_entitlements','usage_counters','admin_audit_logs'];
 return{configured:true,connected:true,tables,missingTables,notificationPreferenceColumns:columns,missingPreferenceColumns,userProfileColumns,missingProfileColumns,migrations:{userSync:['user_profiles','watchlist_items','notification_preferences','notification_reads','paper_trades'].every(name=>tables.includes(name)),notificationDevices:tables.includes('notification_devices'),notificationTimezone:missingPreferenceColumns.length===0,decisionNotes:tables.includes('decision_notes'),userWorkspace:tables.includes('user_workspace_state'),authRbacSubscriptions:missingProfileColumns.length===0&&commercialTables.every(name=>tables.includes(name))},postgresVersion:versionRows[0]?.version?String(versionRows[0].version):null};
}
