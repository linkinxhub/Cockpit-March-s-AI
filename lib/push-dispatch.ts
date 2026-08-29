import type { NewsAlertEvent } from './news-alert-engine';
import type { UserSyncSnapshot } from './user-sync-store';
import { alertEligibility } from './user-alert-policy';

export type PushProvider='webPush'|'fcm'|'apns';
export type PushCapabilities={webPush:boolean;fcm:boolean;apns:boolean};
export type PushDispatchPlan={eligible:boolean;reason:string;providers:PushProvider[];eventId:string;assetKey:string;deepLink:string};

export function pushCapabilitiesFromEnv():PushCapabilities{
 return{
  fcm:Boolean(process.env.FCM_PROJECT_ID&&process.env.FCM_CLIENT_EMAIL&&process.env.FCM_PRIVATE_KEY),
  webPush:Boolean(process.env.WEB_PUSH_PUBLIC_KEY&&process.env.WEB_PUSH_PRIVATE_KEY),
  apns:Boolean(process.env.APNS_KEY_ID&&process.env.APNS_TEAM_ID&&process.env.APNS_PRIVATE_KEY),
 };
}

export function buildPushDispatchPlan(event:NewsAlertEvent,snapshot:UserSyncSnapshot,options?:{now?:Date}):PushDispatchPlan{
 const eligibility=alertEligibility(event,snapshot,{now:options?.now,requirePush:true});
 if(!eligibility.eligible)return{eligible:false,reason:eligibility.reason,providers:[],eventId:event.id,assetKey:event.assetKey,deepLink:`/asset/${encodeURIComponent(event.assetKey)}?tab=news&event=${encodeURIComponent(event.id)}`};
 const caps=pushCapabilitiesFromEnv(),providers:PushProvider[]=[];
 if(caps.webPush)providers.push('webPush');if(caps.fcm)providers.push('fcm');if(caps.apns)providers.push('apns');
 return{eligible:providers.length>0,reason:providers.length>0?'ready':'provider_not_configured',providers,eventId:event.id,assetKey:event.assetKey,deepLink:`/asset/${encodeURIComponent(event.assetKey)}?tab=news&event=${encodeURIComponent(event.id)}`};
}
