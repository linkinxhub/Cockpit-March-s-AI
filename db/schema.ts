import{bigint,boolean,index,integer,jsonb,pgTable,primaryKey,text,uniqueIndex}from'drizzle-orm/pg-core';

export const userProfiles=pgTable('user_profiles',{
 id:text('id').primaryKey(),
 stableUserId:text('stable_user_id').notNull(),
 email:text('email').notNull(),
 displayName:text('display_name').notNull(),
 role:text('role').notNull().default('USER'),
 accountStatus:text('account_status').notNull().default('ACTIVE'),
 locale:text('locale').notNull().default('fr'),
 avatarUrl:text('avatar_url'),
 lastLoginAt:bigint('last_login_at',{mode:'number'}),
 onboardingCompletedAt:bigint('onboarding_completed_at',{mode:'number'}),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
},t=>[uniqueIndex('user_profiles_stable_user_id_uidx').on(t.stableUserId),index('user_profiles_role_idx').on(t.role),index('user_profiles_account_status_idx').on(t.accountStatus)]);

export const subscriptions=pgTable('subscriptions',{
 id:text('id').primaryKey(),
 userId:text('user_id').notNull().references(()=>userProfiles.id,{onDelete:'cascade'}),
 plan:text('plan').notNull().default('DISCOVERY'),
 status:text('status').notNull().default('ACTIVE'),
 stripeCustomerId:text('stripe_customer_id'),
 stripeSubscriptionId:text('stripe_subscription_id'),
 stripePriceId:text('stripe_price_id'),
 currentPeriodEnd:bigint('current_period_end',{mode:'number'}),
 cancelAtPeriodEnd:boolean('cancel_at_period_end').notNull().default(false),
 trialEndsAt:bigint('trial_ends_at',{mode:'number'}),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
},t=>[uniqueIndex('subscriptions_user_uidx').on(t.userId),uniqueIndex('subscriptions_stripe_customer_uidx').on(t.stripeCustomerId),uniqueIndex('subscriptions_stripe_subscription_uidx').on(t.stripeSubscriptionId),index('subscriptions_plan_status_idx').on(t.plan,t.status)]);

export const planEntitlements=pgTable('plan_entitlements',{
 plan:text('plan').notNull(),
 feature:text('feature').notNull(),
 enabled:boolean('enabled').notNull().default(true),
 limits:jsonb('limits').notNull().default({}),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
},t=>[primaryKey({columns:[t.plan,t.feature]}),index('plan_entitlements_feature_idx').on(t.feature)]);

export const usageCounters=pgTable('usage_counters',{
 id:text('id').primaryKey(),
 userId:text('user_id').notNull().references(()=>userProfiles.id,{onDelete:'cascade'}),
 feature:text('feature').notNull(),
 windowStart:bigint('window_start',{mode:'number'}).notNull(),
 windowEnd:bigint('window_end',{mode:'number'}).notNull(),
 usageCount:bigint('usage_count',{mode:'number'}).notNull().default(0),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
},t=>[uniqueIndex('usage_counters_window_uidx').on(t.userId,t.feature,t.windowStart),index('usage_counters_user_window_idx').on(t.userId,t.windowEnd)]);

export const adminAuditLogs=pgTable('admin_audit_logs',{
 id:text('id').primaryKey(),
 actorUserId:text('actor_user_id').notNull().references(()=>userProfiles.id,{onDelete:'restrict'}),
 targetUserId:text('target_user_id').references(()=>userProfiles.id,{onDelete:'restrict'}),
 action:text('action').notNull(),
 before:jsonb('before'),
 after:jsonb('after'),
 reason:text('reason').notNull(),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
},t=>[index('admin_audit_logs_actor_idx').on(t.actorUserId),index('admin_audit_logs_target_idx').on(t.targetUserId),index('admin_audit_logs_created_idx').on(t.createdAt)]);

export const watchlistItems=pgTable('watchlist_items',{
 userId:text('user_id').notNull(),
 assetKey:text('asset_key').notNull(),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
},t=>[primaryKey({columns:[t.userId,t.assetKey]})]);

export const notificationPreferences=pgTable('notification_preferences',{
 userId:text('user_id').primaryKey(),
 minimumSeverity:text('minimum_severity').notNull().default('IMPORTANT'),
 watchedOnly:boolean('watched_only').notNull().default(true),
 pushEnabled:boolean('push_enabled').notNull().default(false),
 quietHoursStart:text('quiet_hours_start'),
 quietHoursEnd:text('quiet_hours_end'),
 timeZone:text('time_zone'),
 utcOffsetMinutes:integer('utc_offset_minutes'),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
});

export const notificationReads=pgTable('notification_reads',{
 userId:text('user_id').notNull(),
 eventId:text('event_id').notNull(),
 readAt:bigint('read_at',{mode:'number'}).notNull(),
},t=>[primaryKey({columns:[t.userId,t.eventId]})]);

export const notificationDevices=pgTable('notification_devices',{
 id:text('id').primaryKey(),
 userId:text('user_id').notNull(),
 platform:text('platform').notNull(),
 provider:text('provider').notNull(),
 token:text('token'),
 endpoint:text('endpoint'),
 p256dh:text('p256dh'),
 auth:text('auth'),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
});

export const paperTrades=pgTable('paper_trades',{
 id:text('id').primaryKey(),
 userId:text('user_id').notNull(),
 assetKey:text('asset_key').notNull(),
 side:text('side').notNull(),
 quantity:text('quantity').notNull(),
 entryPrice:text('entry_price').notNull(),
 exitPrice:text('exit_price'),
 openedAt:bigint('opened_at',{mode:'number'}).notNull(),
 closedAt:bigint('closed_at',{mode:'number'}),
 note:text('note'),
});

export const decisionNotes=pgTable('decision_notes',{
 id:text('id').primaryKey(),
 userId:text('user_id').notNull(),
 assetKey:text('asset_key'),
 noteText:text('note_text').notNull(),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
});

export const userWorkspaceState=pgTable('user_workspace_state',{
 userId:text('user_id').primaryKey(),
 profile:jsonb('profile').notNull().default({}),
 priceAlerts:jsonb('price_alerts').notNull().default([]),
 passports:jsonb('passports').notNull().default([]),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
});
