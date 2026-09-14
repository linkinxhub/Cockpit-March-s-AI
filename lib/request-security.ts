import{headers}from'next/headers';

export class RequestSecurityError extends Error{constructor(public status:number,message:string){super(message);}}

export function requireTrustedMutation(request:Request){
 const authorization=request.headers.get('authorization')||'';
 if(/^Bearer\s+\S+$/i.test(authorization))return;
 const origin=request.headers.get('origin'),host=request.headers.get('x-forwarded-host')||request.headers.get('host')||new URL(request.url).host;
 if(request.headers.get('sec-fetch-site')==='cross-site'||!origin)throw new RequestSecurityError(403,'invalid_request_origin');
 let originHost='';try{originHost=new URL(origin).host;}catch{throw new RequestSecurityError(403,'invalid_request_origin');}
 if(originHost!==host)throw new RequestSecurityError(403,'invalid_request_origin');
}

export async function readBoundedJson(request:Request,limit=64_000):Promise<unknown>{
 requireTrustedMutation(request);
 if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))throw new RequestSecurityError(415,'json_required');
 const reader=request.body?.getReader();if(!reader)throw new RequestSecurityError(400,'invalid_json');
 const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const{done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new RequestSecurityError(413,'payload_too_large');}chunks.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new RequestSecurityError(400,'invalid_json');}
}

export async function requireSameOrigin(){
 const h=await headers(),origin=h.get('origin'),host=h.get('x-forwarded-host')||h.get('host');
 if(!origin||!host)throw new Error('invalid_request_origin');
 let originHost='';try{originHost=new URL(origin).host;}catch{throw new Error('invalid_request_origin');}
 if(originHost!==host)throw new Error('invalid_request_origin');
}
