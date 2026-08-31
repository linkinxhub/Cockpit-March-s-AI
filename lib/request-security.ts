import{headers}from'next/headers';

export async function requireSameOrigin(){
 const h=await headers(),origin=h.get('origin'),host=h.get('x-forwarded-host')||h.get('host');
 if(!origin||!host)throw new Error('invalid_request_origin');
 let originHost='';try{originHost=new URL(origin).host;}catch{throw new Error('invalid_request_origin');}
 if(originHost!==host)throw new Error('invalid_request_origin');
}
