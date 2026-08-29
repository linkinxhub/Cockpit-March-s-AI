CREATE TABLE IF NOT EXISTS billing_subscriptions (
  user_id text PRIMARY KEY,
  plan text NOT NULL DEFAULT 'FREE',
  status text NOT NULL DEFAULT 'free',
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text,
  current_period_end bigint,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  updated_at bigint NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_customer ON billing_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_subscription ON billing_subscriptions(stripe_subscription_id);
