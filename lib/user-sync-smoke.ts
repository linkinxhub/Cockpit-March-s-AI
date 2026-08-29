import{neon}from'@neondatabase/serverless';
import{getUserSyncStore,type NotificationPreferences}from'./user-sync-store';
import{getUserWorkspace,setUserWorkspace}from'./user-workspace-store';

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}

export async function runUserSyncSmoke(){
 const userId=`smoke:${crypto.randomUUID()}`,deviceId=`smoke-device:${crypto.randomUUID()}`,tradeId=`smoke-trade:${crypto.randomUUID()}`,noteId=`smoke-note:${crypto.randomUUID()}`,eventId=`smoke-event:${crypto.randomUUID()}`;
 const store=getUserSyncStore();
 const prefs:NotificationPreferences={minimumSeverity:'CRITIQUE',watchedOnly:false,pushEnabled:true,quietHoursStart:'23:00',quietHoursEnd:'06:00',timeZone:'Europe/Brussels',utcOffsetMinutes:120};
 const checks={watchlist:false,preferences:false,reads:false,devices:false,paperTrading:false,decisionNotes:false,userWorkspace:false,cleanup:false};
 try{
  await store.setWatchlist(userId,['BTCUSD','EURUSD']);
  await store.setNotificationPreferences(userId,prefs);
  await store.markNotificationsRead(userId,[eventId]);
  await store.registerNotificationDevice(userId,{id:deviceId,platform:'web',provider:'webPush',token:null,endpoint:'https://example.invalid/push',p256dh:'smoke-p256dh',auth:'smoke-auth'});
  await store.createPaperTrade(userId,{id:tradeId,assetKey:'BTCUSD',side:'BUY',quantity:'0.01',entryPrice:'100000',openedAt:Date.now(),note:'smoke-test'});
  await store.createDecisionNote(userId,{id:noteId,assetKey:'BTCUSD',text:'smoke decision note',createdAt:Date.now()});
  await setUserWorkspace(userId,{profile:{level:'Expert',style:'Swing',capital:25000,riskPercent:1.5,dailyLoss:4},priceAlerts:[{id:1,symbol:'BTC/USDT',price:'120000'}],passports:[{id:1,symbol:'BTC/USDT',decision:'ACHETER'}]});
  const snapshot=await store.getSnapshot(userId),devices=await store.listNotificationDevices(userId),trades=await store.listPaperTrades(userId),notes=await store.listDecisionNotes(userId),workspace=await getUserWorkspace(userId);
  checks.watchlist=snapshot.watchlist.includes('BTCUSD')&&snapshot.watchlist.includes('EURUSD');
  checks.preferences=snapshot.notificationPreferences.minimumSeverity==='CRITIQUE'&&snapshot.notificationPreferences.timeZone==='Europe/Brussels';
  checks.reads=snapshot.readNotificationIds.includes(eventId);
  checks.devices=devices.some(device=>device.id===deviceId&&device.provider==='webPush');
  checks.paperTrading=trades.some(trade=>trade.id===tradeId&&trade.side==='BUY');
  checks.decisionNotes=notes.some(item=>item.id===noteId&&item.assetKey==='BTCUSD'&&item.text==='smoke decision note');
  checks.userWorkspace=workspace.profile.level==='Expert'&&workspace.priceAlerts.some(item=>item.symbol==='BTC/USDT')&&workspace.passports.length===1;
  await store.closePaperTrade(userId,tradeId,'101000',Date.now());
  await store.deleteDecisionNote(userId,noteId);
  return{ok:Object.values(checks).slice(0,7).every(Boolean),checks};
 }finally{
  const url=connectionString();
  if(url){
   const sql=neon(url);
   await Promise.all([
    sql`delete from watchlist_items where user_id=${userId}`,
    sql`delete from notification_preferences where user_id=${userId}`,
    sql`delete from notification_reads where user_id=${userId}`,
    sql`delete from notification_devices where user_id=${userId}`,
    sql`delete from paper_trades where user_id=${userId}`,
    sql`delete from decision_notes where user_id=${userId}`,
    sql`delete from user_workspace_state where user_id=${userId}`,
    sql`delete from user_profiles where id=${userId}`,
   ]);
   checks.cleanup=true;
  }
 }
}
