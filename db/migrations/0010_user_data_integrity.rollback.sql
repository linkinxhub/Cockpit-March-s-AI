BEGIN;
ALTER TABLE watchlist_items DROP CONSTRAINT IF EXISTS watchlist_items_user_fk;
ALTER TABLE notification_preferences DROP CONSTRAINT IF EXISTS notification_preferences_user_fk;
ALTER TABLE notification_reads DROP CONSTRAINT IF EXISTS notification_reads_user_fk;
ALTER TABLE notification_devices DROP CONSTRAINT IF EXISTS notification_devices_user_fk;
ALTER TABLE paper_trades DROP CONSTRAINT IF EXISTS paper_trades_user_fk;
ALTER TABLE decision_notes DROP CONSTRAINT IF EXISTS decision_notes_user_fk;
ALTER TABLE user_workspace_state DROP CONSTRAINT IF EXISTS user_workspace_state_user_fk;
COMMIT;
