import{NextResponse,type NextRequest}from'next/server';import{auth0Configured,getAuth0Client}from'./lib/auth0';
export default async function proxy(request:NextRequest){
 if(!auth0Configured())return NextResponse.next();
 const response=await getAuth0Client().middleware(request);
 const location=response.headers.get('location');
 // Next.js requires absolute middleware redirects, including callbacks that
 // have no transaction context after an expired or missing state parameter.
 if(location?.startsWith('/')&&!location.startsWith('//'))response.headers.set('location',new URL(location,request.url).toString());
 return response;
}
export const config={matcher:['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)']};
