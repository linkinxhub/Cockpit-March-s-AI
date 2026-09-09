import {getAIAllowance} from '@/lib/ai-allowance';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await getAIAllowance(),{headers:{'Cache-Control':'private, no-store'}});}catch(e){const code=e instanceof Error?e.message:'';return Response.json({error:'unavailable'},{status:code==='AUTH_REQUIRED'?401:code==='FORBIDDEN'?403:503,headers:{'Cache-Control':'private, no-store'}});}}
