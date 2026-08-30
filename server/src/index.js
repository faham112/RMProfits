require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

app.get('/health', (req, res) => {
  res.json({ ok: true, app: 'RM PROFITS' });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email',
      [name, email.toLowerCase(), hash]
    );
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ user: rows[0], token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      user: { id: rows[0].id, name: rows[0].name, email: rows[0].email },
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/summary', auth, async (req, res) => {
  const from = req.query.from || '1970-01-01';
  const to = req.query.to || '2999-12-31';
  const { rows } = await query(
    `SELECT
       COALESCE(SUM(CASE WHEN type='income' THEN amount END),0)::float AS income,
       COALESCE(SUM(CASE WHEN type='expense' THEN amount END),0)::float AS expense,
       COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END),0)::float AS profit
     FROM transactions
     WHERE user_id = $1 AND occurred_on BETWEEN $2 AND $3`,
    [req.user.id, from, to]
  );
  res.json(rows[0]);
});

app.get('/transactions', auth, async (req, res) => {
  const { rows } = await query(
    `SELECT t.*, c.name AS category
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = $1
     ORDER BY t.occurred_on DESC, t.created_at DESC
     LIMIT 100`,
    [req.user.id]
  );
  res.json(rows);
});

app.post('/transactions', auth, async (req, res) => {
  const { type, amount, note, occurred_on, category_id } = req.body;
  const { rows } = await query(
    `INSERT INTO transactions (user_id, type, amount, note, occurred_on, category_id)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [req.user.id, type, amount, note || null, occurred_on, category_id || null]
  );
  res.status(201).json(rows[0]);
});

const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log('RM PROFITS API on ' + port);
});
