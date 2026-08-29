import{bigint,boolean,integer,jsonb,pgTable,primaryKey,text}from'drizzle-orm/pg-core';

export const userProfiles=pgTable('user_profiles',{
 id:text('id').primaryKey(),
 email:text('email').notNull(),
 displayName:text('display_name').notNull(),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
});

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

export const notificationDeliveries=pgTable('notification_deliveries',{
 userId:text('user_id').notNull(),
 eventId:text('event_id').notNull(),
 deviceId:text('device_id').notNull(),
 provider:text('provider').notNull(),
 status:text('status').notNull(),
 deliveredAt:bigint('delivered_at',{mode:'number'}).notNull(),
},t=>[primaryKey({columns:[t.userId,t.eventId,t.deviceId]})]);

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

export const billingSubscriptions=pgTable('billing_subscriptions',{
 userId:text('user_id').primaryKey(),
 plan:text('plan').notNull().default('FREE'),
 status:text('status').notNull().default('free'),
 stripeCustomerId:text('stripe_customer_id').unique(),
 stripeSubscriptionId:text('stripe_subscription_id').unique(),
 stripePriceId:text('stripe_price_id'),
 currentPeriodEnd:bigint('current_period_end',{mode:'number'}),
 cancelAtPeriodEnd:boolean('cancel_at_period_end').notNull().default(false),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
});

export const billingWebhookEvents=pgTable('billing_webhook_events',{
 eventId:text('event_id').primaryKey(),
 eventType:text('event_type').notNull(),
 processedAt:bigint('processed_at',{mode:'number'}).notNull(),
});

export const webCredentials=pgTable('web_credentials',{
 userId:text('user_id').primaryKey(),
 email:text('email').notNull().unique(),
 passwordHash:text('password_hash').notNull(),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
 updatedAt:bigint('updated_at',{mode:'number'}).notNull(),
});

export const mobilePairingCodes=pgTable('mobile_pairing_codes',{
 codeHash:text('code_hash').primaryKey(),
 userId:text('user_id').notNull(),
 expiresAt:bigint('expires_at',{mode:'number'}).notNull(),
 consumedAt:bigint('consumed_at',{mode:'number'}),
 createdAt:bigint('created_at',{mode:'number'}).notNull(),
});
