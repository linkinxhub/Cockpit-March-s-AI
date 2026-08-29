import{getSharedUserIdentity}from'@/lib/user-identity';

export async function GET(){
 const user=await getSharedUserIdentity();
 if(!user)return Response.json({authenticated:false,user:null},{status:401,headers:{'Cache-Control':'private, no-store'}});
 return Response.json({authenticated:true,user},{headers:{'Cache-Control':'private, no-store'}});
}
