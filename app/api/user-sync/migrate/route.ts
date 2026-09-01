import{runUserSyncMigrations}from'@/lib/user-sync-migration-runner';

const expectedBranches=new Set(['feat/flutter-mobile-sync','feat/auth-rbac-subscriptions','feat/auth0-migration']);
const expectedConfirmation='APPLY_USER_SYNC_V1';

export async function POST(req:Request){
 if(process.env.VERCEL_ENV!=='preview')return Response.json({error:'preview_only'},{status:403});
 if(!expectedBranches.has(process.env.VERCEL_GIT_COMMIT_REF||''))return Response.json({error:'wrong_branch'},{status:403});
 const url=new URL(req.url);if(url.searchParams.get('confirm')!==expectedConfirmation)return Response.json({error:'confirmation_required'},{status:400});
 try{
  const result=await runUserSyncMigrations();
  return Response.json({ok:true,changed:result.changed,healthy:result.after.missingTables.length===0&&result.after.missingPreferenceColumns.length===0&&result.after.missingProfileColumns.length===0,migrations:result.after.migrations},{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'migration_failed'},{status:500,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
}
