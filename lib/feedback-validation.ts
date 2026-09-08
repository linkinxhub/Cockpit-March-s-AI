export const statuses = ['open','in_progress','resolved'] as const;
export class FeedbackError extends Error { constructor(public status:number, message:string){super(message);} }
export async function readFeedbackBody(request:Request){
 const origin=request.headers.get('origin'),host=request.headers.get('x-forwarded-host')||request.headers.get('host')||new URL(request.url).host;
 try{if(!origin||new URL(origin).host!==host)throw Error();}catch{throw new FeedbackError(403,'origin');}
 const reader=request.body?.getReader();if(!reader)throw new FeedbackError(400,'body');
 let size=0;const chunks:Uint8Array[]=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>800000){await reader.cancel();throw new FeedbackError(413,'size');}chunks.push(value);}
 const bytes=new Uint8Array(size);let pos=0;for(const c of chunks){bytes.set(c,pos);pos+=c.length;}
 try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new FeedbackError(400,'json');}
}
export function validateFeedback(value:any){
 if(!value||typeof value.message!=='string'||value.message.trim().length<10||value.message.length>4000||!['bug','idea','data','other'].includes(value.category))throw new FeedbackError(400,'fields');
 let image:string|null=null;
 if(value.image){
  if(typeof value.image!=='string'||value.image.length>700000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value.image))throw new FeedbackError(400,'image');
  let raw:string;try{raw=atob(value.image.split(',')[1]);}catch{throw new FeedbackError(400,'image');}if(!raw.startsWith('\xff\xd8\xff')||!raw.endsWith('\xff\xd9'))throw new FeedbackError(400,'image');image=value.image;
 }
 return {message:value.message.trim(),category:value.category as string,image,page:typeof value.page==='string'?value.page.split(/[?#]/)[0].slice(0,200):'/',id:crypto.randomUUID(),createdAt:Date.now()};
}
export const privateHeaders={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
