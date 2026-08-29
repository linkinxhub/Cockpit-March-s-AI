import{getUserSyncHealth}from'@/lib/user-sync-health';

export async function GET(){
 try{
  const health=await getUserSyncHealth();
  const healthy=health.configured&&health.connected&&health.missingTables.length===0&&health.missingPreferenceColumns.length===0;
  const body={
   configured:health.configured,
   connected:health.connected,
   healthy,
   missingTables:health.missingTables,
   notificationDeviceTable:health.tables.includes('notification_devices'),
   notificationTimezoneColumns:health.missingPreferenceColumns.length===0,
   migrations:health.migrations,
  };
  return Response.json(body,{status:health.configured&&health.connected?200:503,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
 }catch{
  return Response.json({configured:true,connected:false,healthy:false,error:'storage_unavailable'},{status:503,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
 }
}
