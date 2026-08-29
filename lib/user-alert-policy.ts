import type { NewsAlertEvent, NewsAlertSeverity } from './news-alert-engine';
import type { NotificationPreferences, UserSyncSnapshot } from './user-sync-store';

const rank:Record<NewsAlertSeverity,number>={INFO:1,IMPORTANT:2,CRITIQUE:3};

export type AlertEligibility={eligible:boolean;reason:'eligible'|'below_minimum_severity'|'not_in_watchlist'|'push_disabled'|'quiet_hours'};

function localMinutes(now:Date,prefs:NotificationPreferences){
 if(prefs.timeZone){
  try{
   const parts=new Intl.DateTimeFormat('en-US',{timeZone:prefs.timeZone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
   const hour=Number(parts.find(p=>p.type==='hour')?.value),minute=Number(parts.find(p=>p.type==='minute')?.value);
   if(Number.isFinite(hour)&&Number.isFinite(minute))return hour*60+minute;
  }catch{}
 }
 if(prefs.utcOffsetMinutes!==null&&Number.isFinite(prefs.utcOffsetMinutes)){
  const utc=now.getUTCHours()*60+now.getUTCMinutes(),day=24*60;
  return(utc+prefs.utcOffsetMinutes%day+day)%day;
 }
 return now.getUTCHours()*60+now.getUTCMinutes();
}

export function isQuietHours(now:Date,prefs:NotificationPreferences){
 const start=prefs.quietHoursStart,end=prefs.quietHoursEnd;
 if(!start||!end)return false;
 const parse=(value:string)=>{const[h,m]=value.split(':').map(Number);return Number.isInteger(h)&&Number.isInteger(m)&&h>=0&&h<=23&&m>=0&&m<=59?h*60+m:null;};
 const s=parse(start),e=parse(end);if(s===null||e===null)return false;
 const current=localMinutes(now,prefs);
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
