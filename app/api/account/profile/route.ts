import{z}from'zod';
import{ensureAccount,updateOwnProfile}from'@/lib/account-store';
import{getSharedUserIdentity}from'@/lib/user-identity';
import{requireSameOrigin}from'@/lib/request-security';

const schema=z.object({displayName:z.string().trim().min(2).max(80),locale:z.enum(['fr','en','de','nl']),avatarUrl:z.string().trim().url().max(500).nullable()}).strict();
export async function PATCH(req:Request){try{await requireSameOrigin();const identity=await getSharedUserIdentity();if(!identity)return Response.json({error:'authentication_required'},{status:401});const body=schema.safeParse(await req.json());if(!body.success)return Response.json({error:'invalid_profile'},{status:400});const current=await ensureAccount(identity);if(current.accountStatus==='SUSPENDED')return Response.json({error:'account_suspended'},{status:403});const account=await updateOwnProfile(current.userId,body.data);return Response.json({ok:true,profile:{displayName:account.displayName,locale:account.locale,avatarUrl:account.avatarUrl}},{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'profile_update_failed'},{status:500});}}
