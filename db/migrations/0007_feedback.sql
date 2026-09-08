CREATE TABLE IF NOT EXISTS feedback (id text PRIMARY KEY,email text NOT NULL,message text NOT NULL,category text NOT NULL,page text NOT NULL,status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','resolved')),created_at bigint NOT NULL,image text,updated_by text,updated_at bigint);
CREATE INDEX IF NOT EXISTS feedback_created_idx ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_email_time_idx ON feedback(email,created_at);
