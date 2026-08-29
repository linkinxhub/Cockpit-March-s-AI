import{pushCapabilitiesFromEnv}from'@/lib/push-dispatch';
export async function GET(){
 const push=pushCapabilitiesFromEnv();
 return Response.json({center:{newsAlerts:true,synchronized:true,personalized:true},push,requirements:{fcm:['FCM_PROJECT_ID','FCM_CLIENT_EMAIL','FCM_PRIVATE_KEY'],webPush:['WEB_PUSH_PUBLIC_KEY','WEB_PUSH_PRIVATE_KEY'],apns:['APNS_KEY_ID','APNS_TEAM_ID','APNS_PRIVATE_KEY']},dispatch:{mode:'dry-run-until-device-registration',deepLinks:true},updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'no-store'}});
}
