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

export function userSyncStoreConfigured(){return process.env.USER_SYNC_STORE==='d1'||process.env.USER_SYNC_STORE==='external';}
