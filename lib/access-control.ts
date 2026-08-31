import{redirect}from'next/navigation';
import{chatGPTSignInPath}from'@/app/chatgpt-auth';
import{ensureAccount}from'./account-store';
import type{AccountMembership,UserRole}from'./account-types';
import{getSharedUserIdentity,type SharedUserIdentity}from'./user-identity';

export type RequestMembership={identity:SharedUserIdentity;membership:AccountMembership};
export type ApiAuthorization={context:RequestMembership;response?:never}|{context?:never;response:Response};

export async function authorizeApiRequest(options:{roles?:readonly UserRole[];allowSuspended?:boolean}={}):Promise<ApiAuthorization>{
 const identity=await getSharedUserIdentity();
 if(!identity)return{response:Response.json({error:'authentication_required'},{status:401,headers:{'Cache-Control':'private, no-store'}})};
 try{
  const membership=await ensureAccount(identity);
  if(membership.accountStatus==='SUSPENDED'&&!options.allowSuspended)return{response:Response.json({error:'account_suspended'},{status:403,headers:{'Cache-Control':'private, no-store'}})};
  if(options.roles&&!options.roles.includes(membership.role))return{response:Response.json({error:'forbidden'},{status:403,headers:{'Cache-Control':'private, no-store'}})};
  return{context:{identity,membership}};
 }catch{return{response:Response.json({error:'account_unavailable'},{status:503,headers:{'Cache-Control':'private, no-store'}})};}
}

export async function requirePageMembership(returnTo:string,options:{roles?:readonly UserRole[];allowSuspended?:boolean}={}):Promise<RequestMembership>{
 const identity=await getSharedUserIdentity();if(!identity)redirect(chatGPTSignInPath(returnTo));
 let membership:AccountMembership;try{membership=await ensureAccount(identity);}catch{redirect('/account/unavailable');}
 if(membership.accountStatus==='SUSPENDED'&&!options.allowSuspended)redirect('/account/suspended');
 if(options.roles&&!options.roles.includes(membership.role))redirect('/account');
 return{identity,membership};
}

export function requireAdminRole(membership:AccountMembership){if(membership.role!=='ADMIN')throw new Error('forbidden');}
export function requireSupportRole(membership:AccountMembership){if(membership.role!=='SUPPORT'&&membership.role!=='ADMIN')throw new Error('forbidden');}
