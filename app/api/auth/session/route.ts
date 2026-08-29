import{getSharedUserIdentity}from'@/lib/user-identity';
export async function GET(){const user=await getSharedUserIdentity();return Response.json({authenticated:Boolean(user),user:user?{id:user.id,email:user.email,displayName:user.displayName,source:user.source}:null},{status:user?200:401,headers:{'Cache-Control':'private, no-store'}});}
