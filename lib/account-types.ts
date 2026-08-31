export const USER_ROLES=['USER','SUPPORT','ADMIN'] as const;
export const COMMERCIAL_PLANS=['DISCOVERY','PRO','EXPERT'] as const;
export const ACCOUNT_STATUSES=['TRIALING','ACTIVE','PAST_DUE','CANCELED','SUSPENDED'] as const;
export const SUPPORTED_LOCALES=['fr','en','de','nl'] as const;

export type UserRole=(typeof USER_ROLES)[number];
export type CommercialPlan=(typeof COMMERCIAL_PLANS)[number];
export type AccountStatus=(typeof ACCOUNT_STATUSES)[number];
export type SupportedLocale=(typeof SUPPORTED_LOCALES)[number];

export type AccountMembership={
 userId:string;
 stableUserId:string;
 email:string;
 displayName:string;
 role:UserRole;
 accountStatus:AccountStatus;
 locale:SupportedLocale;
 avatarUrl:string|null;
 lastLoginAt:number|null;
 onboardingCompletedAt:number|null;
 plan:CommercialPlan;
 subscriptionStatus:AccountStatus;
 currentPeriodEnd:number|null;
 cancelAtPeriodEnd:boolean;
};
