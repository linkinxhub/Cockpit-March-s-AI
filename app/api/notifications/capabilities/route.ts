export async function GET(){
 const fcm=Boolean(process.env.FCM_PROJECT_ID&&process.env.FCM_CLIENT_EMAIL&&process.env.FCM_PRIVATE_KEY);
 const webPush=Boolean(process.env.WEB_PUSH_PUBLIC_KEY&&process.env.WEB_PUSH_PRIVATE_KEY);
 const apns=Boolean(process.env.APNS_KEY_ID&&process.env.APNS_TEAM_ID&&process.env.APNS_PRIVATE_KEY);
 return Response.json({center:{newsAlerts:true,synchronized:true},push:{fcm,webPush,apns},requirements:{fcm:['FCM_PROJECT_ID','FCM_CLIENT_EMAIL','FCM_PRIVATE_KEY'],webPush:['WEB_PUSH_PUBLIC_KEY','WEB_PUSH_PRIVATE_KEY'],apns:['APNS_KEY_ID','APNS_TEAM_ID','APNS_PRIVATE_KEY']},updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'no-store'}});
}
