CREATE TABLE IF NOT EXISTS ai_settings (id text PRIMARY KEY,encrypted_key text NOT NULL,model text NOT NULL,updated_by text NOT NULL,updated_at bigint NOT NULL);
