import{bigint,boolean,integer,pgTable,primaryKey,text}from'drizzle-orm/pg-core';

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
