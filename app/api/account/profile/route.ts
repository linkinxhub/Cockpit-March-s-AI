import{z}from'zod';
import{updateOwnProfile}from'@/lib/account-store';
import{authorizeApiRequest}from'@/lib/access-control';
import{requireSameOrigin}from'@/lib/request-security';

const schema=z.object({displayName:z.string().trim().min(2).max(80),locale:z.enum(['fr','en','de','nl']),avatarUrl:z.string().trim().url().max(500).nullable()}).strict();
export async function PATCH(req:Request){try{await requireSameOrigin();const auth=await authorizeApiRequest();if(auth.response)return auth.response;const body=schema.safeParse(await req.json());if(!body.success)return Response.json({error:'invalid_profile'},{status:400});const account=await updateOwnProfile(auth.context.membership.userId,body.data);return Response.json({ok:true,profile:{displayName:account.displayName,locale:account.locale,avatarUrl:account.avatarUrl}},{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'profile_update_failed'},{status:500});}}
