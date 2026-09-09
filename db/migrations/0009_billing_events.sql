ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS billing_event_at bigint NOT NULL DEFAULT 0;
