-- Create admin_accounts table
CREATE TABLE IF NOT EXISTS admin_accounts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  api_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  weight_kg DECIMAL(10, 2) NOT NULL,
  delivery_option VARCHAR(50) NOT NULL,
  priority BOOLEAN DEFAULT FALSE,
  insurance BOOLEAN DEFAULT FALSE,
  base_rate_label VARCHAR(100) NOT NULL,
  base_rate_amount DECIMAL(10, 2) NOT NULL,
  add_on_total DECIMAL(10, 2) DEFAULT 0,
  grand_total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'queued',
  timeline JSONB DEFAULT '[]',
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on orders.reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference);
-- Create index on orders.status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
-- Create index on orders.created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
