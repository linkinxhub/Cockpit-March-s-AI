import{integer,primaryKey,sqliteTable,text}from'drizzle-orm/sqlite-core';

export const userProfiles=sqliteTable('user_profiles',{
 id:text('id').primaryKey(),
 email:text('email').notNull(),
 displayName:text('display_name').notNull(),
 createdAt:integer('created_at').notNull(),
 updatedAt:integer('updated_at').notNull(),
});

export const watchlistItems=sqliteTable('watchlist_items',{
 userId:text('user_id').notNull(),
 assetKey:text('asset_key').notNull(),
 createdAt:integer('created_at').notNull(),
},{pk:t=>[primaryKey({columns:[t.userId,t.assetKey]})]});

export const notificationPreferences=sqliteTable('notification_preferences',{
 userId:text('user_id').primaryKey(),
 minimumSeverity:text('minimum_severity').notNull().default('IMPORTANT'),
 watchedOnly:integer('watched_only',{mode:'boolean'}).notNull().default(true),
 pushEnabled:integer('push_enabled',{mode:'boolean'}).notNull().default(false),
 quietHoursStart:text('quiet_hours_start'),
 quietHoursEnd:text('quiet_hours_end'),
 updatedAt:integer('updated_at').notNull(),
});

export const notificationReads=sqliteTable('notification_reads',{
 userId:text('user_id').notNull(),
 eventId:text('event_id').notNull(),
 readAt:integer('read_at').notNull(),
},{pk:t=>[primaryKey({columns:[t.userId,t.eventId]})]});

export const paperTrades=sqliteTable('paper_trades',{
 id:text('id').primaryKey(),
 userId:text('user_id').notNull(),
 assetKey:text('asset_key').notNull(),
 side:text('side').notNull(),
 quantity:text('quantity').notNull(),
 entryPrice:text('entry_price').notNull(),
 exitPrice:text('exit_price'),
 openedAt:integer('opened_at').notNull(),
 closedAt:integer('closed_at'),
 note:text('note'),
});
