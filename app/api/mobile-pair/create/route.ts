import{createPairingCode}from'@/lib/web-auth';
import{getSharedUserIdentity}from'@/lib/user-identity';
export async function POST(){const user=await getSharedUserIdentity();if(!user||user.source==='mobile')return Response.json({error:'web_authentication_required'},{status:401});try{const pair=await createPairingCode(user.id);return Response.json({ok:true,code:pair.code,expiresAt:pair.expiresAt},{headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex'}});}catch(e){return Response.json({error:e instanceof Error?e.message:'pairing_unavailable'},{status:500});}}
