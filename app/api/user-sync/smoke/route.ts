import{runUserSyncSmoke}from'@/lib/user-sync-smoke';

const expectedBranch='feat/flutter-mobile-sync';
const expectedConfirmation='RUN_USER_SYNC_SMOKE';

export async function GET(req:Request){
 if(process.env.VERCEL_ENV!=='preview')return Response.json({error:'preview_only'},{status:403});
 if(process.env.VERCEL_GIT_COMMIT_REF!==expectedBranch)return Response.json({error:'wrong_branch'},{status:403});
 const url=new URL(req.url);if(url.searchParams.get('confirm')!==expectedConfirmation)return Response.json({error:'confirmation_required'},{status:400});
 try{const result=await runUserSyncSmoke();return Response.json(result,{status:result.ok?200:500,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});}catch(e){return Response.json({ok:false,error:e instanceof Error?e.message:'smoke_failed'},{status:500,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});}
}
