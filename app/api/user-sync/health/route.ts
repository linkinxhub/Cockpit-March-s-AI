import{getSharedUserIdentity}from'@/lib/user-identity';
import{getUserSyncHealth}from'@/lib/user-sync-health';

export async function GET(){
 const user=await getSharedUserIdentity();if(!user)return Response.json({error:'authentication_required'},{status:401});
 try{const health=await getUserSyncHealth();return Response.json(health,{status:health.configured&&health.connected?200:503,headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({configured:true,connected:false,error:'storage_unavailable'},{status:503,headers:{'Cache-Control':'private, no-store'}});}
}
