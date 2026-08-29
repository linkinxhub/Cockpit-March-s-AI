import type { NewsAlertEvent, NewsAlertSeverity } from './news-alert-engine';
import type { NotificationPreferences, UserSyncSnapshot } from './user-sync-store';

const rank:Record<NewsAlertSeverity,number>={INFO:1,IMPORTANT:2,CRITIQUE:3};

export type AlertEligibility={eligible:boolean;reason:'eligible'|'below_minimum_severity'|'not_in_watchlist'|'push_disabled'|'quiet_hours'};

export function isQuietHours(now:Date,prefs:NotificationPreferences){
 const start=prefs.quietHoursStart,end=prefs.quietHoursEnd;
 if(!start||!end)return false;
 const parse=(value:string)=>{const[m,h]=[value.split(':')[1],value.split(':')[0]];const hours=Number(h),minutes=Number(m);return Number.isFinite(hours)&&Number.isFinite(minutes)?hours*60+minutes:null;};
 const s=parse(start),e=parse(end);if(s===null||e===null)return false;
 const current=now.getHours()*60+now.getMinutes();
 return s===e?true:s<e?current>=s&&current<e:current>=s||current<e;
}

export function alertEligibility(event:NewsAlertEvent,snapshot:UserSyncSnapshot,options?:{now?:Date;requirePush?:boolean}):AlertEligibility{
 const prefs=snapshot.notificationPreferences;
 if(rank[event.severity]<rank[prefs.minimumSeverity])return{eligible:false,reason:'below_minimum_severity'};
 if(prefs.watchedOnly&&!snapshot.watchlist.includes(event.assetKey))return{eligible:false,reason:'not_in_watchlist'};
 if(options?.requirePush&&prefs.pushEnabled!==true)return{eligible:false,reason:'push_disabled'};
 if(isQuietHours(options?.now??new Date(),prefs))return{eligible:false,reason:'quiet_hours'};
 return{eligible:true,reason:'eligible'};
}

export function filterUserAlerts(events:NewsAlertEvent[],snapshot:UserSyncSnapshot,options?:{now?:Date;requirePush?:boolean}){
 return events.filter(event=>alertEligibility(event,snapshot,options).eligible);
}
