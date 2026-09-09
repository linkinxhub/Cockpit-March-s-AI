import 'server-only';
// Verified against Stripe test invoice and subscription metadata on 2026-09-09.
// This allowlist restores earlier checkouts without merging customers or subscriptions.
const imports:Record<string,readonly string[]>={
 'sites:cus_VE3skKcO7rpG13':['in_1UDc85PaqMcvZjTh5qeQ0Qtc','in_1UDc63PaqMcvZjThpUveZSHF','in_1UDc0aPaqMcvZjThVBFY9BDB','in_1UDbirPaqMcvZjThwjjAPdtV']
};
export async function historicalInvoices(account:{id:string;customerId:string},host:string,live:boolean,read:(path:string)=>Promise<any>){
 if(live)return [];
 const ids=imports[host+':'+account.customerId]||[];
 return Promise.all(ids.map(async id=>{const invoice=await read('invoices/'+id);const metadata=invoice.parent?.subscription_details?.metadata;
 if(invoice.id!==id||invoice.livemode!==false||metadata?.application!=='cockpit-marches-ai'||metadata?.hosting!==host||metadata?.user_id!==account.id)throw Error('invoice_ownership');
 return invoice;
 }));
}
