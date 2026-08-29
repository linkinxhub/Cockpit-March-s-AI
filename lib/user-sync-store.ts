import{neon}from'@neondatabase/serverless';

export type NotificationSeverity='INFO'|'IMPORTANT'|'CRITIQUE';
export type NotificationPreferences={minimumSeverity:NotificationSeverity;watchedOnly:boolean;pushEnabled:boolean;quietHoursStart:string|null;quietHoursEnd:string|null};
export type UserSyncSnapshot={watchlist:string[];notificationPreferences:NotificationPreferences;readNotificationIds:string[]};
export type NotificationDevicePlatform='web'|'android'|'ios';
export type NotificationDeviceProvider='webPush'|'fcm'|'apns';
export type NotificationDevice={id:string;userId:string;platform:NotificationDevicePlatform;provider:NotificationDeviceProvider;token:string|null;endpoint:string|null;p256dh:string|null;auth:string|null;createdAt:number;updatedAt:number};
export type RegisterNotificationDevice={id:string;platform:NotificationDevicePlatform;provider:NotificationDeviceProvider;token:string|null;endpoint:string|null;p256dh:string|null;auth:string|null};
export type PaperTradeSide='BUY'|'SELL';
export type PaperTrade={id:string;userId:string;assetKey:string;side:PaperTradeSide;quantity:string;entryPrice:string;exitPrice:string|null;openedAt:number;closedAt:number|null;note:string|null};
export type NewPaperTrade={id:string;assetKey:string;side:PaperTradeSide;quantity:string;entryPrice:string;openedAt:number;note:string|null};

export interface UserSyncStore{
 getSnapshot(userId:string):Promise<UserSyncSnapshot>;
 setWatchlist(userId:string,assetKeys:string[]):Promise<void>;
 setNotificationPreferences(userId:string,value:NotificationPreferences):Promise<void>;
 markNotificationsRead(userId:string,eventIds:string[]):Promise<void>;
 listNotificationDevices(userId:string):Promise<NotificationDevice[]>;
 registerNotificationDevice(userId:string,value:RegisterNotificationDevice):Promise<NotificationDevice>;
 removeNotificationDevice(userId:string,id:string):Promise<boolean>;
 listPaperTrades(userId:string):Promise<PaperTrade[]>;
 createPaperTrade(userId:string,value:NewPaperTrade):Promise<PaperTrade>;
 closePaperTrade(userId:string,id:string,exitPrice:string,closedAt:number):Promise<PaperTrade|null>;
 deletePaperTrade(userId:string,id:string):Promise<boolean>;
}

export const defaultNotificationPreferences:NotificationPreferences={minimumSeverity:'IMPORTANT',watchedOnly:true,pushEnabled:false,quietHoursStart:null,quietHoursEnd:null};

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}
export function userSyncStoreConfigured(){return Boolean(connectionString());}
function rowToPaperTrade(row:any):PaperTrade{return{id:String(row.id),userId:String(row.user_id),assetKey:String(row.asset_key),side:String(row.side) as PaperTradeSide,quantity:String(row.quantity),entryPrice:String(row.entry_price),exitPrice:row.exit_price==null?null:String(row.exit_price),openedAt:Number(row.opened_at),closedAt:row.closed_at==null?null:Number(row.closed_at),note:row.note==null?null:String(row.note)};}
function rowToNotificationDevice(row:any):NotificationDevice{return{id:String(row.id),userId:String(row.user_id),platform:String(row.platform) as NotificationDevicePlatform,provider:String(row.provider) as NotificationDeviceProvider,token:row.token==null?null:String(row.token),endpoint:row.endpoint==null?null:String(row.endpoint),p256dh:row.p256dh==null?null:String(row.p256dh),auth:row.auth==null?null:String(row.auth),createdAt:Number(row.created_at),updatedAt:Number(row.updated_at)};}

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
  async listNotificationDevices(userId){const rows=await sql`select id,user_id,platform,provider,token,endpoint,p256dh,auth,created_at,updated_at from notification_devices where user_id=${userId} order by updated_at desc`;return rows.map(rowToNotificationDevice);},
  async registerNotificationDevice(userId,value){const now=Date.now();const rows=await sql`insert into notification_devices(id,user_id,platform,provider,token,endpoint,p256dh,auth,created_at,updated_at) values(${value.id},${userId},${value.platform},${value.provider},${value.token},${value.endpoint},${value.p256dh},${value.auth},${now},${now}) on conflict(id) do update set platform=excluded.platform,provider=excluded.provider,token=excluded.token,endpoint=excluded.endpoint,p256dh=excluded.p256dh,auth=excluded.auth,updated_at=excluded.updated_at where notification_devices.user_id=${userId} returning id,user_id,platform,provider,token,endpoint,p256dh,auth,created_at,updated_at`;if(!rows[0])throw new Error('device_id_conflict');return rowToNotificationDevice(rows[0]);},
  async removeNotificationDevice(userId,id){const rows=await sql`delete from notification_devices where id=${id} and user_id=${userId} returning id`;return rows.length>0;},
  async listPaperTrades(userId){const rows=await sql`select id,user_id,asset_key,side,quantity,entry_price,exit_price,opened_at,closed_at,note from paper_trades where user_id=${userId} order by opened_at desc`;return rows.map(rowToPaperTrade);},
  async createPaperTrade(userId,value){const rows=await sql`insert into paper_trades(id,user_id,asset_key,side,quantity,entry_price,opened_at,note) values(${value.id},${userId},${value.assetKey},${value.side},${value.quantity},${value.entryPrice},${value.openedAt},${value.note}) returning id,user_id,asset_key,side,quantity,entry_price,exit_price,opened_at,closed_at,note`;return rowToPaperTrade(rows[0]);},
  async closePaperTrade(userId,id,exitPrice,closedAt){const rows=await sql`update paper_trades set exit_price=${exitPrice},closed_at=${closedAt} where id=${id} and user_id=${userId} and closed_at is null returning id,user_id,asset_key,side,quantity,entry_price,exit_price,opened_at,closed_at,note`;return rows[0]?rowToPaperTrade(rows[0]):null;},
  async deletePaperTrade(userId,id){const rows=await sql`delete from paper_trades where id=${id} and user_id=${userId} returning id`;return rows.length>0;},
 };
}

export function getUserSyncStore():UserSyncStore{
 if(!userSyncStoreConfigured())throw new Error('storage_not_configured');
 return postgresStore();
}
