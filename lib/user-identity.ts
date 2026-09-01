import { headers } from 'next/headers';

export type SharedUserIdentity={
  id:string;
  email:string;
  displayName:string;
  source:'chatgpt'|'auth0'|'mobile';
};

type MobilePayload={id:string;email:string;displayName:string;exp:number};

function stableId(email:string){return `chatgpt:${email.trim().toLowerCase()}`;}
function bytes(value:string){return new TextEncoder().encode(value);}
function b64url(input:Uint8Array){let binary='';for(const b of input)binary+=String.fromCharCode(b);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function fromB64url(value:string){const padded=value.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-value.length%4)%4);const binary=atob(padded);return Uint8Array.from(binary,c=>c.charCodeAt(0));}
async function hmac(value:string){const secret=process.env.MOBILE_SESSION_SECRET;if(!secret)throw new Error('mobile_session_not_configured');const key=await crypto.subtle.importKey('raw',bytes(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);return new Uint8Array(await crypto.subtle.sign('HMAC',key,bytes(value)));}
async function verifyHmac(value:string,signature:string){const secret=process.env.MOBILE_SESSION_SECRET;if(!secret)return false;const key=await crypto.subtle.importKey('raw',bytes(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);return crypto.subtle.verify('HMAC',key,fromB64url(signature),bytes(value));}

export async function createMobileSessionToken(user:SharedUserIdentity,ttlSeconds=7*24*60*60){
 if(user.source==='mobile')throw new Error('web_authentication_required');
 const payload:MobilePayload={id:user.id,email:user.email,displayName:user.displayName,exp:Math.floor(Date.now()/1000)+ttlSeconds};
 const encoded=b64url(bytes(JSON.stringify(payload))),signature=b64url(await hmac(encoded));
 return{token:`${encoded}.${signature}`,expiresAt:payload.exp*1000};
}

async function mobileIdentity(authorization:string|null):Promise<SharedUserIdentity|null>{
 if(!authorization?.startsWith('Bearer '))return null;
 const token=authorization.slice(7).trim(),[payloadPart,signature]=token.split('.');
 if(!payloadPart||!signature||!await verifyHmac(payloadPart,signature))return null;
 try{const payload=JSON.parse(new TextDecoder().decode(fromB64url(payloadPart))) as MobilePayload;if(!payload.id||!payload.email||payload.exp<=Math.floor(Date.now()/1000))return null;return{id:payload.id,email:payload.email,displayName:payload.displayName||payload.email,source:'mobile'};}catch{return null;}
}

export async function getSharedUserIdentity():Promise<SharedUserIdentity|null>{
  const h=await headers();
  const mobile=await mobileIdentity(h.get('authorization'));if(mobile)return mobile;
  const email=h.get('oai-authenticated-user-email');
  if(email){
    const encoded=h.get('oai-authenticated-user-full-name');
    let fullName:string|null=null;
    if(encoded&&h.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8'){
      try{fullName=decodeURIComponent(encoded);}catch{fullName=null;}
    }
    return{id:stableId(email),email,displayName:fullName||email,source:'chatgpt'};
  }
  if(process.env.AUTH0_DOMAIN&&process.env.AUTH0_CLIENT_ID&&process.env.AUTH0_CLIENT_SECRET&&process.env.AUTH0_SECRET){
    try{const{getAuth0Client}=await import('./auth0');const session=await getAuth0Client().getSession();const user=session?.user;if(user?.sub&&user.email&&user.email_verified===true)return{id:`auth0:${user.sub}`,email:String(user.email),displayName:String(user.name||user.nickname||user.email),source:'auth0'};}catch{return null;}
  }
  return null;
}

export function mobileSessionConfigured(){return Boolean(process.env.MOBILE_SESSION_SECRET);}
