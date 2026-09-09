export class AISettingsError extends Error {constructor(public status:number,public code:string){super(code);}}
export async function readAISettingsBody(r:Request){
 const origin=r.headers.get('origin'),host=r.headers.get('x-forwarded-host')||r.headers.get('host')||new URL(r.url).host;
 try{if(!origin||new URL(origin).host!==host)throw Error();}catch{throw new AISettingsError(403,'forbidden');}
 const reader=r.body?.getReader();if(!reader)throw new AISettingsError(400,'invalid_input');let text='',size=0;const decoder=new TextDecoder();while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>6000){await reader.cancel();throw new AISettingsError(413,'invalid_input');}text+=decoder.decode(part.value,{stream:true});}text+=decoder.decode();
 let b:any;try{b=JSON.parse(text);}catch{throw new AISettingsError(400,'invalid_input');}
 if(!b||!['test','save'].includes(b.action)||typeof b.model!=='string'||!/^[-a-zA-Z0-9._]{1,100}$/.test(b.model)||typeof b.apiKey!=='string'||b.apiKey.length>1024||(b.apiKey&&!/^sk-[A-Za-z0-9_-]+$/.test(b.apiKey.trim())))throw new AISettingsError(400,'invalid_input');
 return {action:b.action,apiKey:b.apiKey.trim(),model:b.model};
}
export async function testAICredentials(apiKey:string,model:string){
 let response:Response;try{response=await fetch('https://api.openai.com/v1/responses',{method:'POST',signal:AbortSignal.timeout(35000),headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,store:false,input:'Reply with OK.',max_output_tokens:512})});}catch{throw new AISettingsError(502,'connection_failed');}
 // Never forward provider errors: they can contain credential fragments.
 if(!response.ok){await response.body?.cancel();throw new AISettingsError(response.status===429?429:400,response.status===401?'invalid_key':response.status===429?'quota_or_rate_limit':response.status===403?'access_denied':response.status===404?'model_unavailable':'test_failed');}
 const data=await response.json();if(data.status!=='completed')throw new AISettingsError(400,'test_incomplete');
}
