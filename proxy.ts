import{NextResponse,type NextRequest}from'next/server';import{auth0Configured,getAuth0Client}from'./lib/auth0';
export default async function proxy(request:NextRequest){
 const mutation=!['GET','HEAD','OPTIONS'].includes(request.method),isApi=request.nextUrl.pathname.startsWith('/api/'),isWebhook=request.nextUrl.pathname==='/api/billing/webhook',bearer=/^Bearer\s+\S+$/i.test(request.headers.get('authorization')||'');
 if(mutation&&isApi&&!isWebhook&&!bearer){const origin=request.headers.get('origin'),host=request.headers.get('x-forwarded-host')||request.headers.get('host');let trusted=false;try{trusted=Boolean(origin&&host&&new URL(origin).host===host&&request.headers.get('sec-fetch-site')!=='cross-site');}catch{trusted=false;}if(!trusted)return NextResponse.json({error:'invalid_request_origin'},{status:403,headers:{'Cache-Control':'private, no-store'}});}
 if(!auth0Configured())return NextResponse.next();
 const response=await getAuth0Client().middleware(request);
 const location=response.headers.get('location');
 // Next.js requires absolute middleware redirects, including callbacks that
 // have no transaction context after an expired or missing state parameter.
 if(location?.startsWith('/')&&!location.startsWith('//'))response.headers.set('location',new URL(location,request.url).toString());
 return response;
}
export const config={matcher:['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)']};
