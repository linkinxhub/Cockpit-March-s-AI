import{neon}from'@neondatabase/serverless';
import{cookies}from'next/headers';
import{createHash,createHmac,randomBytes,scryptSync,timingSafeEqual}from'node:crypto';

export type WebIdentity={id:string;email:string;displayName:string};
export const WEB_SESSION_COOKIE='cockpit_web_session';
const SESSION_TTL_SECONDS=7*24*60*60;

function dbUrl(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}
function sqlClient(){const url=dbUrl();if(!url)throw new Error('storage_not_configured');return neon(url);}
function authSecret(){return process.env.WEB_AUTH_SECRET||process.env.MOBILE_SESSION_SECRET||'';}
export function webAuthConfigured(){return Boolean(dbUrl()&&authSecret());}
export function normalizeEmail(value:string){return value.trim().toLowerCase();}
export function userIdFromEmail(email:string){return `chatgpt:${normalizeEmail(email)}`;}
function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);}

export function hashPassword(password:string){const salt=randomBytes(16),derived=scryptSync(password,salt,32);return`scrypt$${salt.toString('base64url')}$${derived.toString('base64url')}`;}
export function verifyPassword(password:string,encoded:string){try{const[scheme,salt64,hash64]=encoded.split('$');if(scheme!=='scrypt'||!salt64||!hash64)return false;const expected=Buffer.from(hash64,'base64url'),actual=scryptSync(password,Buffer.from(salt64,'base64url'),expected.length);return expected.length===actual.length&&timingSafeEqual(expected,actual);}catch{return false;}}

export async function registerWebUser(emailInput:string,password:string,displayNameInput:string):Promise<WebIdentity>{const email=normalizeEmail(emailInput),displayName=displayNameInput.trim()||email;if(!validEmail(email))throw new Error('invalid_email');if(password.length<10)throw new Error('password_too_short');if(displayName.length>120)throw new Error('display_name_too_long');const sql=sqlClient(),userId=userIdFromEmail(email),now=Date.now(),passwordHash=hashPassword(password);const existing=await sql`select user_id from web_credentials where email=${email} limit 1`;if(existing[0])throw new Error('email_already_registered');await sql`insert into user_profiles(id,email,display_name,created_at,updated_at) values(${userId},${email},${displayName},${now},${now}) on conflict(id) do update set email=excluded.email,display_name=excluded.display_name,updated_at=excluded.updated_at`;await sql`insert into web_credentials(user_id,email,password_hash,created_at,updated_at) values(${userId},${email},${passwordHash},${now},${now})`;return{id:userId,email,displayName};}

export async function authenticateWebUser(emailInput:string,password:string):Promise<WebIdentity|null>{const email=normalizeEmail(emailInput);if(!validEmail(email)||!password)return null;const sql=sqlClient(),rows=await sql`select c.user_id,c.password_hash,p.email,p.display_name from web_credentials c join user_profiles p on p.id=c.user_id where c.email=${email} limit 1`;const row=rows[0]as any;if(!row||!verifyPassword(password,String(row.password_hash)))return null;return{id:String(row.user_id),email:String(row.email),displayName:String(row.display_name)};}

function sign(value:string){const secret=authSecret();if(!secret)throw new Error('web_auth_not_configured');return createHmac('sha256',secret).update(value).digest('base64url');}
export function createWebSessionCookie(user:WebIdentity){const payload=Buffer.from(JSON.stringify({id:user.id,email:user.email,displayName:user.displayName,exp:Math.floor(Date.now()/1000)+SESSION_TTL_SECONDS})).toString('base64url');return`${payload}.${sign(payload)}`;}
export async function readWebSession():Promise<WebIdentity|null>{const token=(await cookies()).get(WEB_SESSION_COOKIE)?.value;if(!token)return null;const[payload,signature]=token.split('.');if(!payload||!signature)return null;const expected=Buffer.from(sign(payload)),actual=Buffer.from(signature);if(expected.length!==actual.length||!timingSafeEqual(expected,actual))return null;try{const data=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));if(!data.id||!data.email||Number(data.exp)<=Math.floor(Date.now()/1000))return null;return{id:String(data.id),email:String(data.email),displayName:String(data.displayName||data.email)};}catch{return null;}}
export const webSessionCookieOptions={httpOnly:true,secure:true,sameSite:'lax' as const,path:'/',maxAge:SESSION_TTL_SECONDS};

function pairingHash(code:string){return createHash('sha256').update(code).digest('hex');}
export async function createPairingCode(userId:string){const sql=sqlClient(),now=Date.now(),expiresAt=now+5*60*1000;await sql`delete from mobile_pairing_codes where user_id=${userId} or expires_at<${now}`;for(let attempt=0;attempt<5;attempt++){const code=String(Number.parseInt(randomBytes(4).toString('hex'),16)%100000000).padStart(8,'0'),hash=pairingHash(code);try{await sql`insert into mobile_pairing_codes(code_hash,user_id,expires_at,created_at) values(${hash},${userId},${expiresAt},${now})`;return{code,expiresAt};}catch{}}throw new Error('pairing_code_unavailable');}
export async function consumePairingCode(codeInput:string):Promise<WebIdentity|null>{const code=codeInput.replace(/\D/g,'');if(code.length!==8)return null;const sql=sqlClient(),hash=pairingHash(code),now=Date.now();const rows=await sql`update mobile_pairing_codes set consumed_at=${now} where code_hash=${hash} and consumed_at is null and expires_at>${now} returning user_id`;if(!rows[0])return null;const userId=String((rows[0]as any).user_id),users=await sql`select id,email,display_name from user_profiles where id=${userId} limit 1`;const user=users[0]as any;if(!user)return null;return{id:String(user.id),email:String(user.email),displayName:String(user.display_name)};}
