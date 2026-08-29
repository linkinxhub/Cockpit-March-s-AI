import{neon}from'@neondatabase/serverless';

export type NotificationSeverity='INFO'|'IMPORTANT'|'CRITIQUE';
export type NotificationPreferences={minimumSeverity:NotificationSeverity;watchedOnly:boolean;pushEnabled:boolean;quietHoursStart:string|null;quietHoursEnd:string|null};
export type UserSyncSnapshot={watchlist:string[];notificationPreferences:NotificationPreferences;readNotificationIds:string[]};

export interface UserSyncStore{
 getSnapshot(userId:string):Promise<UserSyncSnapshot>;
 setWatchlist(userId:string,assetKeys:string[]):Promise<void>;
 setNotificationPreferences(userId:string,value:NotificationPreferences):Promise<void>;
 markNotificationsRead(userId:string,eventIds:string[]):Promise<void>;
}

export const defaultNotificationPreferences:NotificationPreferences={minimumSeverity:'IMPORTANT',watchedOnly:true,pushEnabled:false,quietHoursStart:null,quietHoursEnd:null};

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}
export function userSyncStoreConfigured(){return Boolean(connectionString());}

function postgresStore():UserSyncStore{
 const url=connectionString();
 if(!url)throw new Error('storage_not_configured');
 const sql=neon(url);
 return{
  async getSnapshot(userId){
   const[watchRows,prefRows,readRows]=await Promise.all([
    sql`select asset_key from watchlist_items where user_id=${userId} order by created_at asc`,
    sql`select minimum_severity,watched_only,push_enabled,quiet_hours_start,quiet_hours_end from notification_preferences where user_id=${userId} limit 1`,
    sql`select event_id from notification_reads where user_id=${userId} order by read_at desc`,
   ]);
   const pref=prefRows[0] as any|undefined;
   return{
    watchlist:watchRows.map((row:any)=>String(row.asset_key)),
    notificationPreferences:pref?{minimumSeverity:(pref.minimum_severity||'IMPORTANT') as NotificationSeverity,watchedOnly:Boolean(pref.watched_only),pushEnabled:Boolean(pref.push_enabled),quietHoursStart:pref.quiet_hours_start??null,quietHoursEnd:pref.quiet_hours_end??null}:defaultNotificationPreferences,
    readNotificationIds:readRows.map((row:any)=>String(row.event_id)),
   };
  },
  async setWatchlist(userId,assetKeys){
   await sql`delete from watchlist_items where user_id=${userId}`;
   const now=Date.now();
   for(const assetKey of assetKeys)await sql`insert into watchlist_items(user_id,asset_key,created_at) values(${userId},${assetKey},${now}) on conflict(user_id,asset_key) do nothing`;
  },
  async setNotificationPreferences(userId,value){
   const now=Date.now();
   await sql`insert into notification_preferences(user_id,minimum_severity,watched_only,push_enabled,quiet_hours_start,quiet_hours_end,updated_at) values(${userId},${value.minimumSeverity},${value.watchedOnly},${value.pushEnabled},${value.quietHoursStart},${value.quietHoursEnd},${now}) on conflict(user_id) do update set minimum_severity=excluded.minimum_severity,watched_only=excluded.watched_only,push_enabled=excluded.push_enabled,quiet_hours_start=excluded.quiet_hours_start,quiet_hours_end=excluded.quiet_hours_end,updated_at=excluded.updated_at`;
  },
  async markNotificationsRead(userId,eventIds){
   const now=Date.now();
   for(const eventId of eventIds)await sql`insert into notification_reads(user_id,event_id,read_at) values(${userId},${eventId},${now}) on conflict(user_id,event_id) do update set read_at=excluded.read_at`;
  },
 };
}

export function getUserSyncStore():UserSyncStore{
 if(!userSyncStoreConfigured())throw new Error('storage_not_configured');
 return postgresStore();
}
