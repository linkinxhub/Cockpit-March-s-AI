CREATE TABLE IF NOT EXISTS decision_notes (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  asset_key text,
  note_text text NOT NULL,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);

CREATE INDEX IF NOT EXISTS decision_notes_user_idx ON decision_notes(user_id);
CREATE INDEX IF NOT EXISTS decision_notes_asset_idx ON decision_notes(asset_key);
