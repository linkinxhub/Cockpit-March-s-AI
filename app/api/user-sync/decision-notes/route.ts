import{assets}from'@/lib/market-data';
import{authorizeApiRequest}from'@/lib/access-control';
import{getUserSyncStore,userSyncStoreConfigured}from'@/lib/user-sync-store';
import{readBoundedJson,requireTrustedMutation,RequestSecurityError}from'@/lib/request-security';

const validAssets=new Set(assets.map(asset=>asset.key));
const textLimit=4000;

export async function GET(){
 const auth=await authorizeApiRequest();if(auth.response)return auth.response;const user=auth.context.identity;
 if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 try{
  const notes=await getUserSyncStore().listDecisionNotes(user.id);
  return Response.json({notes},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'storage_unavailable'},{status:503});}
}

export async function POST(req:Request){
 const auth=await authorizeApiRequest();if(auth.response)return auth.response;const user=auth.context.identity;
 if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 let body:any;try{body=await readBoundedJson(req,8_000)}catch(e){return Response.json({error:e instanceof RequestSecurityError?e.message:'invalid_json'},{status:e instanceof RequestSecurityError?e.status:400});}
 const text=typeof body?.text==='string'?body.text.trim():'';
 const assetKey=typeof body?.assetKey==='string'&&validAssets.has(body.assetKey)?body.assetKey:null;
 if(!text)return Response.json({error:'text_required'},{status:400});
 if(text.length>textLimit)return Response.json({error:'text_too_long'},{status:400});
 try{
  const note=await getUserSyncStore().createDecisionNote(user.id,{id:crypto.randomUUID(),assetKey,text,createdAt:Date.now()});
  return Response.json({note},{status:201,headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'storage_unavailable'},{status:503});}
}

export async function DELETE(req:Request){
 const auth=await authorizeApiRequest();if(auth.response)return auth.response;const user=auth.context.identity;
 if(!userSyncStoreConfigured())return Response.json({error:'storage_not_configured'},{status:503});
 try{requireTrustedMutation(req)}catch(e){return Response.json({error:e instanceof Error?e.message:'invalid_request_origin'},{status:403});}
 const id=new URL(req.url).searchParams.get('id')?.trim()||'';
 if(!id)return Response.json({error:'id_required'},{status:400});
 try{
  const removed=await getUserSyncStore().deleteDecisionNote(user.id,id);
  return Response.json({ok:true,removed},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'storage_unavailable'},{status:503});}
}
