import {requireAISettingsOwner} from '@/lib/ai-settings-store';
import {AISettingsError} from '@/lib/ai-settings-http';
export const dynamic='force-dynamic';
export async function GET(){
 try{await requireAISettingsOwner();return Response.json({authorized:true},{headers:{'Cache-Control':'private, no-store'}});}
 catch(error){return Response.json({authorized:false},{status:error instanceof AISettingsError?error.status:503,headers:{'Cache-Control':'private, no-store'}});}
}
