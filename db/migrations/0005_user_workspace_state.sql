BEGIN;

CREATE TABLE IF NOT EXISTS user_workspace_state (
  user_id text PRIMARY KEY,
  profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_alerts jsonb NOT NULL DEFAULT '[]'::jsonb,
  passports jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at bigint NOT NULL
);

COMMIT;
