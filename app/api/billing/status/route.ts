import {billingPublicStatus} from '@/lib/plan-billing-config';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(billingPublicStatus(),{headers:{'Cache-Control':'no-store'}});}
