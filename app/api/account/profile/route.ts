import {z} from 'zod';
import {updateOwnProfile} from '@/lib/account-store';
import {authorizeApiRequest} from '@/lib/access-control';
import {AccountRequestError,readAccountJson} from '@/lib/account-request';
const schema=z.object({displayName:z.string().trim().min(2).max(80),locale:z.enum(['fr','en','de','nl']),avatarUrl:z.string().trim().url().max(500).refine(value=>new URL(value).protocol==='https:').nullable()}).strict();
export async function PATCH(req:Request){
 const auth=await authorizeApiRequest();if(auth.response)return auth.response;
 try {
  const body=schema.safeParse(await readAccountJson(req));
  if(!body.success)return Response.json({error:'invalid_profile'},{status:400,headers:{'Cache-Control':'private, no-store'}});
  const account=await updateOwnProfile(auth.context.membership.userId,body.data);
  return Response.json({ok:true,profile:{displayName:account.displayName,locale:account.locale,avatarUrl:account.avatarUrl}},{headers:{'Cache-Control':'private, no-store'}});
 }catch(error){return Response.json({error:error instanceof AccountRequestError?error.message:'profile_update_failed'},{status:error instanceof AccountRequestError?error.status:500,headers:{'Cache-Control':'private, no-store'}});}
}
