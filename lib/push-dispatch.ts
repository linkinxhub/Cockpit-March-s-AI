import type { NewsAlertEvent } from './news-alert-engine';
import type { NotificationDevice, UserSyncSnapshot } from './user-sync-store';
import { alertEligibility } from './user-alert-policy';

export type PushProvider='webPush'|'fcm'|'apns';
export type PushCapabilities={webPush:boolean;fcm:boolean;apns:boolean};
export type PushTarget={deviceId:string;platform:string;provider:PushProvider};
export type PushDispatchPlan={eligible:boolean;reason:string;providers:PushProvider[];targets:PushTarget[];eventId:string;assetKey:string;deepLink:string};

export function pushCapabilitiesFromEnv():PushCapabilities{
 return{
  fcm:Boolean(process.env.FCM_PROJECT_ID&&process.env.FCM_CLIENT_EMAIL&&process.env.FCM_PRIVATE_KEY),
  webPush:Boolean(process.env.WEB_PUSH_PUBLIC_KEY&&process.env.WEB_PUSH_PRIVATE_KEY),
  apns:Boolean(process.env.APNS_KEY_ID&&process.env.APNS_TEAM_ID&&process.env.APNS_PRIVATE_KEY),
 };
}

export function buildPushDispatchPlan(event:NewsAlertEvent,snapshot:UserSyncSnapshot,devices:NotificationDevice[]=[],options?:{now?:Date}):PushDispatchPlan{
 const deepLink=`/notifications?asset=${encodeURIComponent(event.assetKey)}&event=${encodeURIComponent(event.id)}`;
 const eligibility=alertEligibility(event,snapshot,{now:options?.now,requirePush:true});
 if(!eligibility.eligible)return{eligible:false,reason:eligibility.reason,providers:[],targets:[],eventId:event.id,assetKey:event.assetKey,deepLink};
 const caps=pushCapabilitiesFromEnv();
 const targets=devices.filter(device=>caps[device.provider]===true).map(device=>({deviceId:device.id,platform:device.platform,provider:device.provider}));
 const providers=[...new Set(targets.map(target=>target.provider))];
 const reason=devices.length===0?'no_registered_device':targets.length===0?'provider_not_configured':'ready';
 return{eligible:targets.length>0,reason,providers,targets,eventId:event.id,assetKey:event.assetKey,deepLink};
}
