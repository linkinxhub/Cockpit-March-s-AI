import{runUserSyncMigrations}from'@/lib/user-sync-migration-runner';
import{runUserSyncSmoke}from'@/lib/user-sync-smoke';

const expectedBranch='feat/flutter-mobile-sync';
const expectedConfirmation='APPLY_USER_SYNC_V1';
const expectedSmokeConfirmation='RUN_USER_SYNC_SMOKE';

async function execute(req:Request){
 if(process.env.VERCEL_ENV!=='preview')return Response.json({error:'preview_only'},{status:403});
 if(process.env.VERCEL_GIT_COMMIT_REF!==expectedBranch)return Response.json({error:'wrong_branch'},{status:403});
 const url=new URL(req.url);if(url.searchParams.get('confirm')!==expectedConfirmation)return Response.json({error:'confirmation_required'},{status:400});
 try{
  const result=await runUserSyncMigrations();
  const smokeRequested=url.searchParams.get('smoke')===expectedSmokeConfirmation;
  const smoke=smokeRequested?await runUserSyncSmoke():null;
  return Response.json({ok:true,changed:result.changed,healthy:result.after.missingTables.length===0&&result.after.missingPreferenceColumns.length===0,migrations:result.after.migrations,smoke},{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'migration_or_smoke_failed'},{status:500,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});}
}

export const POST=execute;
export const GET=execute;
