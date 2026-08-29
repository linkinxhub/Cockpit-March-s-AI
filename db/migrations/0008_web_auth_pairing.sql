BEGIN;

CREATE TABLE IF NOT EXISTS web_credentials (
  user_id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS mobile_pairing_codes (
  code_hash text PRIMARY KEY,
  user_id text NOT NULL,
  expires_at bigint NOT NULL,
  consumed_at bigint,
  created_at bigint NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mobile_pairing_user ON mobile_pairing_codes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mobile_pairing_expiry ON mobile_pairing_codes(expires_at);

COMMIT;
