import{userSyncStoreConfigured}from'@/lib/user-sync-store';

export async function GET(){
 const durableStore=userSyncStoreConfigured();
 return Response.json({durableStore,provider:durableStore?'vercel-neon-postgres':'not-configured',watchlist:durableStore,notificationPreferences:durableStore,notificationReads:durableStore,notificationDevices:durableStore,paperTrading:durableStore,decisionNotes:durableStore,userWorkspace:durableStore,connectionEnv:['DATABASE_URL','POSTGRES_URL','NEON_DATABASE_URL','NEON_POSTGRES_URL']},{headers:{'Cache-Control':'private, no-store'}});
}
