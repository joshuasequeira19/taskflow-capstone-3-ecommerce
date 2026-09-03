CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_cents INTEGER NOT NULL
);

INSERT INTO products (name, description, price_cents, category, stock) VALUES
  ('Fog Linen Tote', 'Heavyweight linen tote, undyed, holds its shape.', 4800, 'Bags', 24),
  ('Ceramic Pour-Over', 'Hand-thrown stoneware dripper, fits standard filters.', 3600, 'Home', 15),
  ('Wool Throw', 'Undyed merino throw, woven in a small mill.', 9800, 'Home', 8),
  ('Brass Bottle Opener', 'Solid brass, ages with use.', 1800, 'Tools', 40),
  ('Notebook, Dot Grid', '160gsm paper, sewn binding, lies flat.', 1400, 'Stationery', 60),
  ('Enamel Camp Mug', '12oz, chip-resistant enamel over steel.', 2200, 'Home', 32),
  ('Canvas Apron', 'Waxed canvas, brass hardware, adjustable strap.', 5200, 'Tools', 18),
  ('Soy Candle, Cedar', 'Hand-poured, 40 hour burn time.', 2600, 'Home', 27)
ON CONFLICT DO NOTHING;
