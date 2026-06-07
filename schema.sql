-- Status catalog for normalized order lifecycle
CREATE TABLE status_catalog (
  id SERIAL PRIMARY KEY,
  status_name VARCHAR(100) NOT NULL UNIQUE
);

-- Seed statuses used across restaurant, delivery, and customer flows
INSERT INTO status_catalog (id, status_name) VALUES
  (1, 'Order Placed'),
  (2, 'Preparing'),
  (3, 'Out for Delivery'),
  (4, 'Delivered'),
  (5, 'Cancelled'),
  (6, 'Ready for Pickup')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  cuisine TEXT,
  rating DECIMAL(2,1),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  items JSONB,
  total DECIMAL(10,2),
  status_id INTEGER REFERENCES status_catalog(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE placed_order (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  restaurant_id INTEGER,
  customer_id INTEGER,
  customer_email TEXT,
  total DECIMAL(10,2),
  total_price DECIMAL(10,2),
  price DECIMAL(10,2),
  discount DECIMAL(10,2),
  delivery_fee DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  gst_amount DECIMAL(10,2),
  packing_charge DECIMAL(10,2),
  order_time TIMESTAMP DEFAULT NOW(),
  delivery_address TEXT,
  status_id INTEGER REFERENCES status_catalog(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);