import{createHmac,timingSafeEqual}from'node:crypto';

const apiBase='https://api.stripe.com/v1';
function secret(){const value=process.env.STRIPE_SECRET_KEY;if(!value)throw new Error('stripe_not_configured');return value;}
function formBody(values:Record<string,string|number|boolean|undefined|null>){const body=new URLSearchParams();for(const[k,v]of Object.entries(values))if(v!==undefined&&v!==null)body.set(k,String(v));return body;}
async function stripeRequest(method:'POST'|'DELETE',path:string,values:Record<string,string|number|boolean|undefined|null>={},idempotencyKey?:string){const response=await fetch(`${apiBase}${path}`,{method,headers:{Authorization:`Bearer ${secret()}`,'Content-Type':'application/x-www-form-urlencoded',...(idempotencyKey?{'Idempotency-Key':idempotencyKey}:{})},body:method==='POST'?formBody(values):undefined,cache:'no-store'});const payload=await response.json();if(!response.ok)throw new Error(payload?.error?.message||`stripe_${response.status}`);return payload;}
export function stripePost(path:string,values:Record<string,string|number|boolean|undefined|null>,idempotencyKey?:string){return stripeRequest('POST',path,values,idempotencyKey);}
export function stripeDelete(path:string,idempotencyKey?:string){return stripeRequest('DELETE',path,{},idempotencyKey);}

export function verifyStripeWebhook(rawBody:string,signatureHeader:string|null){
 const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET;if(!webhookSecret||!signatureHeader)return false;
 const parts=signatureHeader.split(',').map(part=>part.split('='));const timestamp=parts.find(([k])=>k==='t')?.[1];const signatures=parts.filter(([k])=>k==='v1').map(([,v])=>v).filter(Boolean);
 if(!timestamp||!signatures.length)return false;const age=Math.abs(Math.floor(Date.now()/1000)-Number(timestamp));if(!Number.isFinite(age)||age>300)return false;
 const expected=createHmac('sha256',webhookSecret).update(`${timestamp}.${rawBody}`).digest('hex');const expectedBuffer=Buffer.from(expected,'hex');
 return signatures.some(sig=>{try{const actual=Buffer.from(sig,'hex');return actual.length===expectedBuffer.length&&timingSafeEqual(actual,expectedBuffer);}catch{return false;}});
}
