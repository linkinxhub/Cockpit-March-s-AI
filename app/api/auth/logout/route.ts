import{cookies}from'next/headers';
import{WEB_SESSION_COOKIE}from'@/lib/web-auth';
export async function POST(){(await cookies()).set(WEB_SESSION_COOKIE,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});return Response.json({ok:true},{headers:{'Cache-Control':'private, no-store'}});}
