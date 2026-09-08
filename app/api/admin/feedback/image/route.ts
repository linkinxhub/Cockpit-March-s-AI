import {handleFeedback} from '@/lib/feedback-handler';
export const GET=(r:Request)=>handleFeedback(r,'image');
