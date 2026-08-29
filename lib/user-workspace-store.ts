import{neon}from'@neondatabase/serverless';

export type TraderProfileState={level:string;style:string;capital:number;riskPercent:number;dailyLoss:number};
export type PriceAlertState={id:number;symbol:string;price:string};
export type PassportState=Record<string,unknown>;
export type UserWorkspaceState={profile:TraderProfileState;priceAlerts:PriceAlertState[];passports:PassportState[];updatedAt:number};

export const defaultTraderProfile:TraderProfileState={level:'Débutant',style:'Swing',capital:10000,riskPercent:1,dailyLoss:3};
export const defaultUserWorkspace:UserWorkspaceState={profile:defaultTraderProfile,priceAlerts:[],passports:[],updatedAt:0};

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}
function clampNumber(value:unknown,fallback:number,min:number,max:number){const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;}
function sanitizeProfile(value:any):TraderProfileState{return{level:String(value?.level||defaultTraderProfile.level).slice(0,40),style:String(value?.style||defaultTraderProfile.style).slice(0,40),capital:clampNumber(value?.capital,defaultTraderProfile.capital,0,1_000_000_000),riskPercent:clampNumber(value?.riskPercent,defaultTraderProfile.riskPercent,0,100),dailyLoss:clampNumber(value?.dailyLoss,defaultTraderProfile.dailyLoss,0,100)};}
function sanitizeAlerts(value:unknown):PriceAlertState[]{if(!Array.isArray(value))return[];return value.slice(0,200).flatMap((item:any)=>{const id=Number(item?.id),price=String(item?.price??'').trim(),symbol=String(item?.symbol??'').trim().slice(0,32);return Number.isFinite(id)&&symbol&&price?[{id,symbol,price}]:[];});}
function sanitizePassports(value:unknown):PassportState[]{if(!Array.isArray(value))return[];return value.slice(0,200).filter(item=>item&&typeof item==='object'&&!Array.isArray(item)).map(item=>item as PassportState);}
export function sanitizeWorkspace(value:any):Omit<UserWorkspaceState,'updatedAt'>{return{profile:sanitizeProfile(value?.profile),priceAlerts:sanitizeAlerts(value?.priceAlerts),passports:sanitizePassports(value?.passports)};}

export async function getUserWorkspace(userId:string):Promise<UserWorkspaceState>{const url=connectionString();if(!url)throw new Error('storage_not_configured');const sql=neon(url);const rows=await sql`select profile,price_alerts,passports,updated_at from user_workspace_state where user_id=${userId} limit 1`;const row=rows[0] as any|undefined;if(!row)return defaultUserWorkspace;const clean=sanitizeWorkspace({profile:row.profile,priceAlerts:row.price_alerts,passports:row.passports});return{...clean,updatedAt:Number(row.updated_at)||0};}
export async function setUserWorkspace(userId:string,value:any):Promise<UserWorkspaceState>{const url=connectionString();if(!url)throw new Error('storage_not_configured');const sql=neon(url),clean=sanitizeWorkspace(value),updatedAt=Date.now();await sql`insert into user_workspace_state(user_id,profile,price_alerts,passports,updated_at) values(${userId},${JSON.stringify(clean.profile)}::jsonb,${JSON.stringify(clean.priceAlerts)}::jsonb,${JSON.stringify(clean.passports)}::jsonb,${updatedAt}) on conflict(user_id) do update set profile=excluded.profile,price_alerts=excluded.price_alerts,passports=excluded.passports,updated_at=excluded.updated_at`;return{...clean,updatedAt};}
