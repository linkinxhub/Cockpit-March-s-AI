CREATE TABLE IF NOT EXISTS notification_deliveries (
  user_id text NOT NULL,
  event_id text NOT NULL,
  device_id text NOT NULL,
  provider text NOT NULL,
  status text NOT NULL,
  delivered_at bigint NOT NULL,
  PRIMARY KEY(user_id,event_id,device_id)
);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_user_time ON notification_deliveries(user_id,delivered_at DESC);
