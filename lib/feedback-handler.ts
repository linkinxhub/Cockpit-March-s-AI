import {feedbackAuth,saveFeedback,listFeedback,updateFeedback,feedbackImage} from './feedback-store';
import {FeedbackError,readFeedbackBody,validateFeedback,statuses,privateHeaders} from './feedback-validation';
export async function handleFeedback(request:Request,operation:'send'|'list'|'update'|'image'){
 try{
  const user=await feedbackAuth(operation!=='send');
  if(operation==='send'){const data=validateFeedback(await readFeedbackBody(request));await saveFeedback(user,data);return Response.json({id:data.id},{status:201,headers:privateHeaders});}
  if(operation==='list')return Response.json({items:await listFeedback()},{headers:privateHeaders});
  if(operation==='update'){const body=await readFeedbackBody(request);if(typeof body?.id!=='string'||!statuses.includes(body.status))throw new FeedbackError(400,'fields');if(!await updateFeedback(body.id,body.status,user.email))throw new FeedbackError(404,'missing');return Response.json({ok:true},{headers:privateHeaders});}
  const id=new URL(request.url).searchParams.get('id');if(!id||id.length>60)throw new FeedbackError(400,'id');const bytes=await feedbackImage(id);if(!bytes)throw new FeedbackError(404,'missing');return new Response(bytes,{headers:{...privateHeaders,'Content-Type':'image/jpeg','Content-Disposition':'inline; filename="feedback.jpg"'}});
 }catch(e){const status=e instanceof FeedbackError?e.status:503;if(status===503)console.error('feedback_storage_unavailable');return Response.json({error:status===503?'unavailable':e instanceof Error?e.message:'error'},{status,headers:privateHeaders});}
}
