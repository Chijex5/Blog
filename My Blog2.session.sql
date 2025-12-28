CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribe_token VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_token ON subscribers(unsubscribe_token);
CREATE INDEX idx_subscribers_active ON subscribers(is_active);