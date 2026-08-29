import{neon}from'@neondatabase/serverless';

const requiredTables=['user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades'] as const;
const preferenceColumns=['time_zone','utc_offset_minutes'] as const;

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}

export type UserSyncHealth={configured:boolean;connected:boolean;tables:string[];missingTables:string[];notificationPreferenceColumns:string[];missingPreferenceColumns:string[];migrations:{userSync:boolean;notificationDevices:boolean;notificationTimezone:boolean};postgresVersion:string|null};

export async function getUserSyncHealth():Promise<UserSyncHealth>{
 const url=connectionString();
 if(!url)return{configured:false,connected:false,tables:[],missingTables:[...requiredTables],notificationPreferenceColumns:[],missingPreferenceColumns:[...preferenceColumns],migrations:{userSync:false,notificationDevices:false,notificationTimezone:false},postgresVersion:null};
 const sql=neon(url);
 const[tableRows,columnRows,versionRows]=await Promise.all([
  sql`select table_name from information_schema.tables where table_schema='public' and table_name in ('user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades')`,
  sql`select column_name from information_schema.columns where table_schema='public' and table_name='notification_preferences' and column_name in ('time_zone','utc_offset_minutes')`,
  sql`select current_setting('server_version') as version`,
 ]);
 const tables=tableRows.map((row:any)=>String(row.table_name)),columns=columnRows.map((row:any)=>String(row.column_name));
 const missingTables=requiredTables.filter(name=>!tables.includes(name)),missingPreferenceColumns=preferenceColumns.filter(name=>!columns.includes(name));
 return{configured:true,connected:true,tables,missingTables,notificationPreferenceColumns:columns,missingPreferenceColumns,migrations:{userSync:['user_profiles','watchlist_items','notification_preferences','notification_reads','paper_trades'].every(name=>tables.includes(name)),notificationDevices:tables.includes('notification_devices'),notificationTimezone:missingPreferenceColumns.length===0},postgresVersion:versionRows[0]?.version?String(versionRows[0].version):null};
}
