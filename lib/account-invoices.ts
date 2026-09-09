import 'server-only';
import {getBillingAccount} from './plan-billing-store';
import {billingConfig} from './plan-billing-config';
import {stripeRequest} from './plan-billing-core';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie'};
const amount=(v:unknown)=>typeof v==='number'&&Number.isSafeInteger(v)?v:null;
function stripeLink(v:unknown){if(typeof v!=='string')return null;try{const u=new URL(v);return u.protocol==='https:'&&['invoice.stripe.com','pay.stripe.com','files.stripe.com'].includes(u.hostname)&&!u.username&&!u.password?v:null;}catch{return null;}}
export async function accountInvoices(request:Request){try{
 const account=await getBillingAccount();if(!account)return Response.json({error:'auth_required'},{status:401,headers});
 const cursor=new URL(request.url).searchParams.get('after');if(cursor&&!/^in_[A-Za-z0-9]{1,180}$/.test(cursor))return Response.json({error:'invalid_cursor'},{status:400,headers});
 if(!account.customerId)return Response.json({invoices:[],next:null},{headers});
 if(!/^cus_[A-Za-z0-9]+$/.test(account.customerId))throw Error();
 const config=await billingConfig();if(!config.ready)throw Error();
 const query=new URLSearchParams({customer:account.customerId,limit:'10'});if(cursor)query.set('starting_after',cursor);
 const result=await stripeRequest('invoices?'+query);if(!Array.isArray(result.data))throw Error();
 // Fail closed if upstream ever returns records outside the authenticated customer or mode.
 if(result.data.some((i:any)=>(typeof i.customer==='string'?i.customer:i.customer?.id)!==account.customerId||i.livemode!==config.live))throw Error();
 const invoices=result.data.map((i:any)=>({id:i.id,number:i.number||i.id,status:i.status,created:amount(i.created),paidAt:amount(i.status_transitions?.paid_at),currency:i.currency,total:amount(i.total),paid:amount(i.amount_paid),remaining:amount(i.amount_remaining),tax:Array.isArray(i.total_taxes)?i.total_taxes.reduce((s:number,t:any)=>s+(amount(t.amount)||0),0):null,discount:Array.isArray(i.total_discount_amounts)?i.total_discount_amounts.reduce((s:number,t:any)=>s+(amount(t.amount)||0),0):null,credit:amount(i.post_payment_credit_notes_amount),test:!i.livemode,url:stripeLink(i.hosted_invoice_url),pdf:stripeLink(i.invoice_pdf),moreLines:!!i.lines?.has_more,lines:(i.lines?.data||[]).slice(0,10).map((l:any)=>({description:String(l.description||'').slice(0,500),amount:amount(l.amount),quantity:amount(l.quantity),start:amount(l.period?.start),end:amount(l.period?.end)}))}));
 return Response.json({invoices,next:result.has_more&&invoices.length?invoices[invoices.length-1].id:null},{headers});
 }catch{return Response.json({error:'invoices_unavailable'},{status:503,headers});}}
