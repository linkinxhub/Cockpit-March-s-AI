import{authorizeFeatureApi}from'@/lib/access-control';
import{getUserSyncStore,userSyncStoreConfigured}from'@/lib/user-sync-store';
import{loadNewsByAsset}from'@/lib/news-source';
import{buildNewsAlerts}from'@/lib/news-alert-engine';
import{alertEligibility}from'@/lib/user-alert-policy';

export async function GET(req:Request){
 const auth=await authorizeFeatureApi('ALERTS');if(auth.response)return auth.response;const user=auth.context.identity;
 if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 const url=new URL(req.url),sinceRaw=Number(url.searchParams.get('since')||0),since=Number.isFinite(sinceRaw)?sinceRaw:0;
 try{
  const[snapshot,byAsset]=await Promise.all([getUserSyncStore().getSnapshot(user.id),loadNewsByAsset()]);
  const events=buildNewsAlerts(byAsset,{since,minSeverity:'INFO'});
  const evaluated=events.map(event=>({event,eligibility:alertEligibility(event,snapshot)}));
  return Response.json({events:evaluated.filter(item=>item.eligibility.eligible).map(item=>item.event),filtered:evaluated.filter(item=>!item.eligibility.eligible).map(item=>({id:item.event.id,assetKey:item.event.assetKey,reason:item.eligibility.reason})),preferences:snapshot.notificationPreferences,watchlist:snapshot.watchlist,updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'storage_unavailable'},{status:503});}
}
