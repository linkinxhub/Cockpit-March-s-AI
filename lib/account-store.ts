import{neon}from'@neondatabase/serverless';
import type{SharedUserIdentity}from'./user-identity';
import{ACCOUNT_STATUSES,COMMERCIAL_PLANS,SUPPORTED_LOCALES,USER_ROLES,type AccountMembership,type AccountStatus,type CommercialPlan,type SupportedLocale,type UserRole}from'./account-types';

function connectionString(){return process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NEON_DATABASE_URL||process.env.NEON_POSTGRES_URL||'';}
export function accountStoreConfigured(){return Boolean(connectionString());}

function typedValue<T extends readonly string[]>(values:T,value:unknown,fallback:T[number]):T[number]{return typeof value==='string'&&values.includes(value)?value as T[number]:fallback;}
function membershipFromRow(row:any):AccountMembership{return{userId:String(row.id),stableUserId:String(row.stable_user_id),email:String(row.email),displayName:String(row.display_name),role:typedValue(USER_ROLES,row.role,'USER') as UserRole,accountStatus:typedValue(ACCOUNT_STATUSES,row.account_status,'ACTIVE') as AccountStatus,locale:typedValue(SUPPORTED_LOCALES,row.locale,'fr') as SupportedLocale,avatarUrl:row.avatar_url==null?null:String(row.avatar_url),lastLoginAt:row.last_login_at==null?null:Number(row.last_login_at),onboardingCompletedAt:row.onboarding_completed_at==null?null:Number(row.onboarding_completed_at),plan:typedValue(COMMERCIAL_PLANS,row.plan,'DISCOVERY') as CommercialPlan,subscriptionStatus:typedValue(ACCOUNT_STATUSES,row.subscription_status,'ACTIVE') as AccountStatus,currentPeriodEnd:row.current_period_end==null?null:Number(row.current_period_end),cancelAtPeriodEnd:Boolean(row.cancel_at_period_end)};}

export async function ensureAccount(identity:SharedUserIdentity):Promise<AccountMembership>{
 const url=connectionString();if(!url)throw new Error('storage_not_configured');
 const bootstrapId=process.env.BOOTSTRAP_ADMIN_STABLE_USER_ID;
 const isBootstrapAdmin=bootstrapId===identity.id||(identity.source==='clerk'&&bootstrapId===identity.id.replace(/^clerk:/,''));
 const sql=neon(url),now=Date.now(),initialRole=isBootstrapAdmin?'ADMIN':'USER';
 const profiles=await sql`insert into user_profiles(id,stable_user_id,email,display_name,role,account_status,locale,last_login_at,created_at,updated_at) values(${identity.id},${identity.id},${identity.email},${identity.displayName},${initialRole},'ACTIVE','fr',${now},${now},${now}) on conflict(stable_user_id) do update set email=excluded.email,role=case when excluded.role='ADMIN' then 'ADMIN' else user_profiles.role end,last_login_at=excluded.last_login_at,updated_at=excluded.updated_at returning id`;
 const userId=String(profiles[0].id),subscriptionId=`subscription:${userId}`;
 await sql`insert into subscriptions(id,user_id,plan,status,created_at,updated_at) values(${subscriptionId},${userId},'DISCOVERY','ACTIVE',${now},${now}) on conflict(user_id) do nothing`;
 return getAccountByUserId(userId);
}

export async function getAccountByUserId(userId:string):Promise<AccountMembership>{
 const url=connectionString();if(!url)throw new Error('storage_not_configured');const sql=neon(url);
 const rows=await sql`select p.id,p.stable_user_id,p.email,p.display_name,p.role,p.account_status,p.locale,p.avatar_url,p.last_login_at,p.onboarding_completed_at,s.plan,s.status as subscription_status,s.current_period_end,s.cancel_at_period_end from user_profiles p join subscriptions s on s.user_id=p.id where p.id=${userId} limit 1`;
 if(!rows[0])throw new Error('account_not_found');return membershipFromRow(rows[0]);
}

export async function updateOwnProfile(userId:string,value:{displayName:string;locale:SupportedLocale;avatarUrl:string|null}):Promise<AccountMembership>{
 const url=connectionString();if(!url)throw new Error('storage_not_configured');const sql=neon(url),now=Date.now();
 const rows=await sql`update user_profiles set display_name=${value.displayName},locale=${value.locale},avatar_url=${value.avatarUrl},onboarding_completed_at=coalesce(onboarding_completed_at,${now}),updated_at=${now} where id=${userId} returning id`;
 if(!rows[0])throw new Error('account_not_found');return getAccountByUserId(userId);
}
