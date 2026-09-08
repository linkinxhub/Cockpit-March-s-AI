import {handleFeedback} from '@/lib/feedback-handler';
export const POST=(r:Request)=>handleFeedback(r,'send');
