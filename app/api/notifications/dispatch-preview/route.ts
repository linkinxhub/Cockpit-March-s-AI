import{getSharedUserIdentity}from'@/lib/user-identity';
import{getUserSyncStore,userSyncStoreConfigured}from'@/lib/user-sync-store';
import{loadNewsByAsset}from'@/lib/news-source';
import{buildNewsAlerts}from'@/lib/news-alert-engine';
import{buildPushDispatchPlan}from'@/lib/push-dispatch';

export async function GET(req:Request){
 const user=await getSharedUserIdentity();if(!user)return Response.json({error:'authentication_required'},{status:401});
 if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 const url=new URL(req.url),sinceRaw=Number(url.searchParams.get('since')||0),since=Number.isFinite(sinceRaw)?sinceRaw:0;
 try{
  const store=getUserSyncStore();
  const[snapshot,devices,byAsset]=await Promise.all([store.getSnapshot(user.id),store.listNotificationDevices(user.id),loadNewsByAsset()]);
  const events=buildNewsAlerts(byAsset,{since,minSeverity:'INFO'});
  const plans=events.map(event=>buildPushDispatchPlan(event,snapshot,devices));
  return Response.json({mode:'dry-run',devices:devices.map(d=>({id:d.id,platform:d.platform,provider:d.provider})),plans,summary:{total:plans.length,eligible:plans.filter(p=>p.eligible).length,blocked:plans.filter(p=>!p.eligible).length,registeredDevices:devices.length,targets:plans.reduce((sum,p)=>sum+p.targets.length,0)},updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'storage_unavailable'},{status:503});}
}
