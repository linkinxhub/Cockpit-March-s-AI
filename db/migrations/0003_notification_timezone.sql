ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS time_zone text;
ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS utc_offset_minutes integer;
