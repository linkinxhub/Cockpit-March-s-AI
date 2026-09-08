import {handleFeedback} from '@/lib/feedback-handler';
export const GET=(r:Request)=>handleFeedback(r,'list');
export const PATCH=(r:Request)=>handleFeedback(r,'update');
