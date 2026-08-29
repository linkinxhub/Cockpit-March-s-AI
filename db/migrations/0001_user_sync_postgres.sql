BEGIN;

CREATE TABLE IF NOT EXISTS user_profiles (
  id text PRIMARY KEY,
  email text NOT NULL,
  display_name text NOT NULL,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS watchlist_items (
  user_id text NOT NULL,
  asset_key text NOT NULL,
  created_at bigint NOT NULL,
  PRIMARY KEY (user_id, asset_key)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id text PRIMARY KEY,
  minimum_severity text NOT NULL DEFAULT 'IMPORTANT',
  watched_only boolean NOT NULL DEFAULT true,
  push_enabled boolean NOT NULL DEFAULT false,
  quiet_hours_start text,
  quiet_hours_end text,
  updated_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_reads (
  user_id text NOT NULL,
  event_id text NOT NULL,
  read_at bigint NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS paper_trades (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  asset_key text NOT NULL,
  side text NOT NULL,
  quantity text NOT NULL,
  entry_price text NOT NULL,
  exit_price text,
  opened_at bigint NOT NULL,
  closed_at bigint,
  note text
);

CREATE INDEX IF NOT EXISTS watchlist_items_user_idx ON watchlist_items(user_id);
CREATE INDEX IF NOT EXISTS notification_reads_user_idx ON notification_reads(user_id);
CREATE INDEX IF NOT EXISTS paper_trades_user_idx ON paper_trades(user_id);

COMMIT;
