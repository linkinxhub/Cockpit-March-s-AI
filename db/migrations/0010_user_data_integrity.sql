BEGIN;

-- NOT VALID preserves existing rows and prevents silent deletion. PostgreSQL
-- still enforces each constraint for every new or changed row. Validation of
-- historical rows is a separate, observable operation after an orphan audit.
DO $$ BEGIN
  ALTER TABLE watchlist_items ADD CONSTRAINT watchlist_items_user_fk FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE notification_preferences ADD CONSTRAINT notification_preferences_user_fk FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE notification_reads ADD CONSTRAINT notification_reads_user_fk FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE notification_devices ADD CONSTRAINT notification_devices_user_fk FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE paper_trades ADD CONSTRAINT paper_trades_user_fk FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE decision_notes ADD CONSTRAINT decision_notes_user_fk FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE user_workspace_state ADD CONSTRAINT user_workspace_state_user_fk FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMIT;
