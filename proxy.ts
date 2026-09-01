import{NextResponse,type NextRequest}from'next/server';import{auth0Configured,getAuth0Client}from'./lib/auth0';
export default function proxy(request:NextRequest){if(!auth0Configured())return NextResponse.next();return getAuth0Client().middleware(request);}
export const config={matcher:['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)']};
