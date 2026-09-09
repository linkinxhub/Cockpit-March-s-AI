import {checkout} from '@/lib/plan-billing-handlers';
export const POST=(r:Request)=>checkout(r);
