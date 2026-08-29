CREATE TABLE IF NOT EXISTS notification_devices (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  platform text NOT NULL,
  provider text NOT NULL,
  token text,
  endpoint text,
  p256dh text,
  auth text,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);

CREATE INDEX IF NOT EXISTS notification_devices_user_idx ON notification_devices(user_id);
CREATE INDEX IF NOT EXISTS notification_devices_provider_idx ON notification_devices(provider);
