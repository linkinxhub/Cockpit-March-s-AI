import{authorizeApiRequest}from'@/lib/access-control';

export async function GET(){
 const auth=await authorizeApiRequest({allowSuspended:true});if(auth.response)return auth.response;
 const{identity:user,membership}=auth.context;
 return Response.json({authenticated:true,user,membership:{role:membership.role,plan:membership.plan,status:membership.accountStatus,locale:membership.locale}},{headers:{'Cache-Control':'private, no-store'}});
}
