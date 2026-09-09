import 'server-only';
import {authorizeApiRequest} from './access-control';
import {getUsageSummary,consumeMonthlyUsage,refundAIUsage,UsageLimitError} from './usage-store';
import {aiMonth} from './ai-plan-policy';
import {AIQuotaError} from './ai-allowance-types';
async function context(){const a=await authorizeApiRequest();if(a.response)throw Error(a.response.status===401?'AUTH_REQUIRED':'FORBIDDEN');return a.context.membership;}
export async function getAIAllowance(){const m=await context(),s=await getUsageSummary(m),a=s.features.AI_INSTANT_ANALYSIS;return{used:a.used,limit:a.limit,remaining:a.limit==null?null:Math.max(0,a.limit-a.used),resetAt:s.windowEnd,plan:m.plan,automaticAllowed:a.limit==null||a.limit>5};}
export async function reserveAIAllowance(){const m=await context(),w=aiMonth();try{const r=await consumeMonthlyUsage('AI_INSTANT_ANALYSIS',m);return r.limit==null?null:{id:m.userId,start:w.start};}catch(e){if(e instanceof UsageLimitError)throw new AIQuotaError(e.limit,e.used,e.resetAt);throw e;}}
export async function refundAIAllowance(r:{id:string;start:number}|null){if(r)await refundAIUsage(r.id,r.start);}
