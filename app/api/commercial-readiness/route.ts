import{commercialReadiness}from'@/lib/commercial-readiness';
export async function GET(){try{return Response.json(await commercialReadiness(),{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});}catch{return Response.json({ready:false,blockers:['readiness_check_failed'],warnings:[]},{status:500,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});}}
