import{authorizeApiRequest}from'@/lib/access-control';import{listAdminAudit}from'@/lib/admin-store';
export async function GET(){const auth=await authorizeApiRequest({roles:['ADMIN']});if(auth.response)return auth.response;return Response.json({logs:await listAdminAudit()},{headers:{'Cache-Control':'private, no-store'}});}
