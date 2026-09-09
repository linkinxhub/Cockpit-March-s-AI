const encoder=new TextEncoder();
const aad=encoder.encode('cockpit-ai-settings/v1');
function base64(bytes:Uint8Array){return btoa(String.fromCharCode(...bytes));}
function bytes(s:string){return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}
async function key(secret:string){if(secret.length<32)throw Error('encryption_unavailable');const hash=await crypto.subtle.digest('SHA-256',encoder.encode('cockpit-ai-settings/v1:'+secret));return crypto.subtle.importKey('raw',hash,{name:'AES-GCM'},false,['encrypt','decrypt']);}
export async function sealKey(value:string,secret:string){const iv=crypto.getRandomValues(new Uint8Array(12));const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad},await key(secret),encoder.encode(value));return ['v1',base64(iv),base64(new Uint8Array(encrypted))].join('.');}
export async function openKey(value:string,secret:string){const [version,iv,data]=value.split('.');if(version!=='v1')throw Error('invalid_ciphertext');const result=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(iv),additionalData:aad},await key(secret),bytes(data));return new TextDecoder().decode(result);}
