import{randomUUID}from'node:crypto';
import{authorizeApiRequest}from'@/lib/access-control';
import{getUserSyncStore,userSyncStoreConfigured,type NotificationDevicePlatform,type NotificationDeviceProvider}from'@/lib/user-sync-store';

const platforms=new Set<NotificationDevicePlatform>(['web','android','ios']);
const providers=new Set<NotificationDeviceProvider>(['webPush','fcm','apns']);
const compatible:Record<NotificationDevicePlatform,NotificationDeviceProvider>={web:'webPush',android:'fcm',ios:'apns'};
const publicDevice=(d:any)=>({id:d.id,platform:d.platform,provider:d.provider,createdAt:d.createdAt,updatedAt:d.updatedAt,configured:Boolean(d.token||d.endpoint)});

export async function GET(){
 const access=await authorizeApiRequest();if(access.response)return access.response;const user=access.context.identity;
 if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 try{const devices=await getUserSyncStore().listNotificationDevices(user.id);return Response.json({devices:devices.map(publicDevice)},{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'storage_unavailable'},{status:503});}
}

export async function PUT(req:Request){
 const access=await authorizeApiRequest();if(access.response)return access.response;const user=access.context.identity;
 if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 let body:any;try{body=await req.json();}catch{return Response.json({error:'invalid_json'},{status:400});}
 const platform=String(body?.platform||'') as NotificationDevicePlatform,provider=String(body?.provider||'') as NotificationDeviceProvider;
 if(!platforms.has(platform)||!providers.has(provider)||compatible[platform]!==provider)return Response.json({error:'invalid_device_provider'},{status:400});
 const token=typeof body?.token==='string'&&body.token.trim()?body.token.trim():null,endpoint=typeof body?.endpoint==='string'&&body.endpoint.trim()?body.endpoint.trim():null,p256dh=typeof body?.p256dh==='string'&&body.p256dh.trim()?body.p256dh.trim():null,auth=typeof body?.auth==='string'&&body.auth.trim()?body.auth.trim():null;
 if(provider==='webPush'&&(!endpoint||!p256dh||!auth))return Response.json({error:'web_push_subscription_required'},{status:400});
 if((provider==='fcm'||provider==='apns')&&!token)return Response.json({error:'device_token_required'},{status:400});
 const id=typeof body?.id==='string'&&body.id.trim()?body.id.trim():randomUUID();
 try{const device=await getUserSyncStore().registerNotificationDevice(user.id,{id,platform,provider,token,endpoint,p256dh,auth});return Response.json({ok:true,device:publicDevice(device)},{headers:{'Cache-Control':'private, no-store'}});}catch(e){return Response.json({error:String(e).includes('device_id_conflict')?'device_id_conflict':'storage_unavailable'},{status:String(e).includes('device_id_conflict')?409:503});}
}

export async function DELETE(req:Request){
 const access=await authorizeApiRequest();if(access.response)return access.response;const user=access.context.identity;
 if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 const id=new URL(req.url).searchParams.get('id');if(!id)return Response.json({error:'id_required'},{status:400});
 try{const removed=await getUserSyncStore().removeNotificationDevice(user.id,id);return removed?Response.json({ok:true,id}):Response.json({error:'not_found'},{status:404});}catch{return Response.json({error:'storage_unavailable'},{status:503});}
}
