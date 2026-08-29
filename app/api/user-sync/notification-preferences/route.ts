import{getSharedUserIdentity}from'@/lib/user-identity';
import{defaultNotificationPreferences,getUserSyncStore,userSyncStoreConfigured,type NotificationPreferences,type NotificationSeverity}from'@/lib/user-sync-store';
const severities=new Set<NotificationSeverity>(['INFO','IMPORTANT','CRITIQUE']);
const timePattern=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
function validTimeZone(value:unknown){if(typeof value!=='string'||!value.trim())return null;try{new Intl.DateTimeFormat('en-US',{timeZone:value.trim()}).format(new Date());return value.trim();}catch{return null;}}
export async function PUT(req:Request){
 const user=await getSharedUserIdentity();if(!user)return Response.json({error:'authentication_required'},{status:401});if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 let body:any;try{body=await req.json()}catch{return Response.json({error:'invalid_json'},{status:400})}
 const minimumSeverity=severities.has(body?.minimumSeverity)?body.minimumSeverity:defaultNotificationPreferences.minimumSeverity;
 const quietHoursStart=typeof body?.quietHoursStart==='string'&&timePattern.test(body.quietHoursStart)?body.quietHoursStart:null;
 const quietHoursEnd=typeof body?.quietHoursEnd==='string'&&timePattern.test(body.quietHoursEnd)?body.quietHoursEnd:null;
 const timeZone=validTimeZone(body?.timeZone);
 const offsetRaw=Number(body?.utcOffsetMinutes),utcOffsetMinutes=Number.isFinite(offsetRaw)&&offsetRaw>=-840&&offsetRaw<=840?Math.trunc(offsetRaw):null;
 const value:NotificationPreferences={minimumSeverity,watchedOnly:body?.watchedOnly!==false,pushEnabled:body?.pushEnabled===true,quietHoursStart,quietHoursEnd,timeZone,utcOffsetMinutes};
 try{await getUserSyncStore().setNotificationPreferences(user.id,value);return Response.json({ok:true,notificationPreferences:value},{headers:{'Cache-Control':'private, no-store'}})}catch{return Response.json({error:'storage_unavailable'},{status:503})}
}
