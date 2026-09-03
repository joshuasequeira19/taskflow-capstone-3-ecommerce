/**
 * Shopfront - small-catalog e-commerce API (Capstone 3 starter app)
 *
 * CONTRACT (this file is complete and working, do not modify it: your job is
 * to provision the infrastructure it runs on with Terraform, not to change it):
 *   GET  /health         -> 200 {"status":"healthy","timestamp":"..."}  (NEVER touches the DB)
 *   GET  /products        -> 200 [ {id,name,description,price_cents,category,stock}, ... ]
 *   GET  /products/:id     -> 200 {...} or 404
 *   POST /orders          -> 201 {id,customer_name,total_cents,created_at,items:[...]}
 *                            (body: {"customer_name": "...", "items": [{"product_id": 1, "quantity": 2}, ...]})
 *
 * Configuration comes ONLY from environment variables:
 *   PORT        (default 3000)
 *   DB_HOST     (RDS endpoint)
 *   DB_PORT     (default 5432)
 *   DB_NAME     (shopfrontdb)
 *   DB_USER     (shopfront_admin)
 *   DB_PASSWORD (set during RDS creation)
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const PORT = parseInt(process.env.PORT || '3000', 10);

const DB_HOST = process.env.DB_HOST;
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME = process.env.DB_NAME || 'shopfrontdb';
const DB_USER = process.env.DB_USER || 'shopfront_admin';
const DB_PASSWORD = process.env.DB_PASSWORD;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[pg] idle client error:', err.message);
});

// ---------------------------------------------------------------------------
// GET /health - liveness probe. Deliberately does NOT query PostgreSQL.
// ---------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// GET /products - list the catalog, newest first.
// ---------------------------------------------------------------------------
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, price_cents, category, stock FROM products ORDER BY id ASC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('[GET /products] database error:', err.message);
    res.status(500).json({ error: 'database_unavailable', message: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /products/:id - fetch one product.
// ---------------------------------------------------------------------------
app.get('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'bad_request', message: 'id must be an integer' });
  }
  try {
    const result = await pool.query(
      'SELECT id, name, description, price_cents, category, stock FROM products WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'not_found', message: `product ${id} does not exist` });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('[GET /products/:id] database error:', err.message);
    res.status(500).json({ error: 'database_unavailable', message: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /orders - place an order. Body: {"customer_name": "...", "items": [{"product_id": 1, "quantity": 2}]}
// ---------------------------------------------------------------------------
app.post('/orders', async (req, res) => {
  const customerName = (req.body && req.body.customer_name ? String(req.body.customer_name) : '').trim();
  const items = Array.isArray(req.body && req.body.items) ? req.body.items : [];

  if (!customerName) {
    return res.status(400).json({ error: 'bad_request', message: 'Field "customer_name" is required.' });
  }
  if (items.length === 0) {
    return res.status(400).json({ error: 'bad_request', message: 'At least one item is required.' });
  }
  for (const item of items) {
    if (!Number.isInteger(item.product_id) || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return res.status(400).json({ error: 'bad_request', message: 'Each item needs an integer product_id and a quantity >= 1.' });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let totalCents = 0;
    const priced = [];
    for (const item of items) {
      const productResult = await client.query(
        'SELECT id, price_cents, stock FROM products WHERE id = $1 FOR UPDATE',
        [item.product_id]
      );
      if (productResult.rowCount === 0) {
        throw Object.assign(new Error(`product ${item.product_id} does not exist`), { statusCode: 400 });
      }
      const product = productResult.rows[0];
      if (product.stock < item.quantity) {
        throw Object.assign(new Error(`not enough stock for product ${item.product_id}`), { statusCode: 400 });
      }
      totalCents += product.price_cents * item.quantity;
      priced.push({ product_id: item.product_id, quantity: item.quantity, price_cents: product.price_cents });
    }

    const orderResult = await client.query(
      'INSERT INTO orders (customer_name, total_cents) VALUES ($1, $2) RETURNING id, customer_name, total_cents, created_at',
      [customerName, totalCents]
    );
    const order = orderResult.rows[0];

    for (const item of priced) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price_cents]
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    await client.query('COMMIT');
    res.status(201).json({ ...order, items: priced });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.statusCode === 400) {
      return res.status(400).json({ error: 'bad_request', message: err.message });
    }
    console.error('[POST /orders] database error:', err.message);
    res.status(500).json({ error: 'database_unavailable', message: err.message });
  } finally {
    client.release();
  }
});

app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path }));

app.listen(PORT, '0.0.0.0', () => {
  console.log('--------------------------------------------------');
  console.log(` Shopfront API listening on 0.0.0.0:${PORT}`);
  console.log(` DB_HOST=${DB_HOST || '(unset - /products will return 500)'}`);
  console.log(` DB_NAME=${DB_NAME}  DB_USER=${DB_USER}  DB_PORT=${DB_PORT}`);
  console.log('--------------------------------------------------');
});
