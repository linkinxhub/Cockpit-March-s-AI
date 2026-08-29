import{userSyncStoreConfigured}from'@/lib/user-sync-store';

export async function GET(){
 const durableStore=userSyncStoreConfigured();
 return Response.json({durableStore,watchlist:durableStore,notificationPreferences:durableStore,notificationReads:durableStore,paperTrading:durableStore,requiredEnv:'USER_SYNC_STORE',supportedStores:['d1','external']},{headers:{'Cache-Control':'private, no-store'}});
}
