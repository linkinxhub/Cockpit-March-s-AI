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

export function userSyncStoreConfigured(){return Boolean(process.env.USER_SYNC_API_URL&&process.env.USER_SYNC_API_SECRET);}

function externalStore():UserSyncStore{
 const base=(process.env.USER_SYNC_API_URL||'').replace(/\/$/,'');
 const secret=process.env.USER_SYNC_API_SECRET||'';
 const request=async(path:string,init?:RequestInit)=>{
  const response=await fetch(`${base}${path}`,{...init,headers:{'Content-Type':'application/json','Authorization':`Bearer ${secret}`,...(init?.headers||{})},cache:'no-store'});
  if(!response.ok)throw new Error(`user_sync_store_${response.status}`);
  if(response.status===204)return null;
  return response.json();
 };
 return{
  async getSnapshot(userId){const data=await request(`/v1/users/${encodeURIComponent(userId)}/sync`);return{watchlist:Array.isArray(data?.watchlist)?data.watchlist:[],notificationPreferences:{...defaultNotificationPreferences,...(data?.notificationPreferences||{})},readNotificationIds:Array.isArray(data?.readNotificationIds)?data.readNotificationIds:[]};},
  async setWatchlist(userId,assetKeys){await request(`/v1/users/${encodeURIComponent(userId)}/watchlist`,{method:'PUT',body:JSON.stringify({assetKeys})});},
  async setNotificationPreferences(userId,value){await request(`/v1/users/${encodeURIComponent(userId)}/notification-preferences`,{method:'PUT',body:JSON.stringify(value)});},
  async markNotificationsRead(userId,eventIds){await request(`/v1/users/${encodeURIComponent(userId)}/notification-reads`,{method:'POST',body:JSON.stringify({eventIds})});},
 };
}

export function getUserSyncStore():UserSyncStore{
 if(!userSyncStoreConfigured())throw new Error('storage_not_configured');
 return externalStore();
}
