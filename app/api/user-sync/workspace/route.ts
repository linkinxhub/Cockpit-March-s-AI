import{authorizeApiRequest}from'@/lib/access-control';
import{getUserWorkspace,setUserWorkspace}from'@/lib/user-workspace-store';
import{userSyncStoreConfigured}from'@/lib/user-sync-store';

export async function GET(){const auth=await authorizeApiRequest();if(auth.response)return auth.response;const user=auth.context.identity;if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});try{return Response.json({workspace:await getUserWorkspace(user.id)},{headers:{'Cache-Control':'private, no-store'}})}catch{return Response.json({error:'storage_unavailable'},{status:503})}}
export async function PUT(req:Request){const auth=await authorizeApiRequest();if(auth.response)return auth.response;const user=auth.context.identity;if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});let body:any;try{body=await req.json()}catch{return Response.json({error:'invalid_json'},{status:400})}try{return Response.json({workspace:await setUserWorkspace(user.id,body)},{headers:{'Cache-Control':'private, no-store'}})}catch{return Response.json({error:'storage_unavailable'},{status:503})}}
