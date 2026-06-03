/**
 * Integration tests for the Expense API endpoints.
 * Uses an in-memory SQLite database so no data is persisted between test runs.
 */
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const expensesRoutes = require('../routes/expenses');

let app;
let db;

beforeAll(async () => {
  // Open an in-memory SQLite database for isolated testing
  db = await open({ filename: ':memory:', driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE budgets (
      category TEXT PRIMARY KEY,
      amount REAL NOT NULL
    );
  `);

  app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/expenses', expensesRoutes(db));
});

afterAll(async () => {
  await db.close();
});

// ── POST /api/expenses ─────────────────────────────────────────────

describe('POST /api/expenses', () => {
  it('creates a valid expense and returns 201', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: 250, category: 'Food', date: '2024-01-15', note: 'Lunch' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      amount: 250,
      category: 'Food',
      date: '2024-01-15',
      note: 'Lunch',
    });
    expect(res.body.data.id).toBeDefined();
  });

  it('rejects a negative amount with 400', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: -50, category: 'Food', date: '2024-01-15' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('rejects a future date with 400', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: 100, category: 'Food', date: futureDate.toISOString().split('T')[0] });

    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toMatch(/future/i);
  });

  it('rejects a missing category with 400', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: 100, date: '2024-01-15' });

    expect(res.status).toBe(400);
  });
});

// ── GET /api/expenses ──────────────────────────────────────────────

describe('GET /api/expenses', () => {
  it('returns all expenses sorted by date desc', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('filters by category', async () => {
    // Add a Transport expense
    await request(app)
      .post('/api/expenses')
      .send({ amount: 80, category: 'Transport', date: '2024-01-10' });

    const res = await request(app).get('/api/expenses?category=Transport');
    expect(res.status).toBe(200);
    expect(res.body.data.every(e => e.category === 'Transport')).toBe(true);
  });
});

// ── PUT /api/expenses/:id ──────────────────────────────────────────

describe('PUT /api/expenses/:id', () => {
  it('updates an existing expense', async () => {
    const created = await request(app)
      .post('/api/expenses')
      .send({ amount: 500, category: 'Bills', date: '2024-01-01' });

    const id = created.body.data.id;
    const res = await request(app)
      .put(`/api/expenses/${id}`)
      .send({ amount: 600, category: 'Bills', date: '2024-01-01', note: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.data.amount).toBe(600);
    expect(res.body.data.note).toBe('Updated');
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app)
      .put('/api/expenses/999999')
      .send({ amount: 100, category: 'Food', date: '2024-01-01' });
    expect(res.status).toBe(404);
  });
});

// ── DELETE /api/expenses/:id ───────────────────────────────────────

describe('DELETE /api/expenses/:id', () => {
  it('deletes an expense and returns 204', async () => {
    const created = await request(app)
      .post('/api/expenses')
      .send({ amount: 99, category: 'Other', date: '2024-01-05' });
    const id = created.body.data.id;

    const delRes = await request(app).delete(`/api/expenses/${id}`);
    expect(delRes.status).toBe(204);

    const getRes = await request(app).get(`/api/expenses/${id}`);
    expect(getRes.status).toBe(404);
  });
});
