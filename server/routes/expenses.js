const express = require('express');
const router = express.Router();

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

/**
 * Shared validation helper for expense fields.
 * Returns an array of error messages (empty if valid).
 */
function validateExpense({ amount, category, date }) {
  const errors = [];
  if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
    errors.push('Amount must be a positive number');
  }
  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (!date) {
    errors.push('Date is required');
  } else {
    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(expenseDate.getTime())) {
      errors.push('Date is invalid');
    } else if (expenseDate > today) {
      errors.push('Date cannot be in the future');
    }
  }
  return errors;
}

module.exports = (db) => {
  // ------------------------------------------------------------------
  // GET /api/expenses — list all expenses with optional filters
  // ------------------------------------------------------------------
  router.get('/', async (req, res) => {
    try {
      const { category, startDate, endDate } = req.query;
      let query = 'SELECT * FROM expenses WHERE 1=1';
      const params = [];

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }
      if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY date DESC, createdAt DESC';

      const expenses = await db.all(query, params);
      res.json({ success: true, data: expenses, count: expenses.length });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // GET /api/expenses/filter — dedicated filter endpoint
  // ------------------------------------------------------------------
  router.get('/filter', async (req, res) => {
    try {
      const { category, startDate, endDate, period } = req.query;
      let query = 'SELECT * FROM expenses WHERE 1=1';
      const params = [];

      // Handle quick period presets
      if (period === 'this-month') {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString().split('T')[0];
        query += ' AND date >= ?';
        params.push(firstDay);
      } else if (period === 'last-month') {
        const today = new Date();
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          .toISOString().split('T')[0];
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
          .toISOString().split('T')[0];
        query += ' AND date >= ? AND date <= ?';
        params.push(firstDayLastMonth, lastDayLastMonth);
      }

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }
      if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY date DESC, createdAt DESC';

      const expenses = await db.all(query, params);
      res.json({ success: true, data: expenses, count: expenses.length });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // GET /api/expenses/budgets/all — get all budgets
  // ------------------------------------------------------------------
  router.get('/budgets/all', async (req, res) => {
    try {
      const budgetsList = await db.all('SELECT * FROM budgets');
      const budgets = {};
      budgetsList.forEach(b => budgets[b.category] = b.amount);
      res.json({ success: true, data: budgets });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // GET /api/expenses/:id — get single expense
  // ------------------------------------------------------------------
  router.get('/:id', async (req, res) => {
    try {
      const expense = await db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
      if (!expense) {
        return res.status(404).json({ success: false, error: 'Expense not found' });
      }
      res.json({ success: true, data: expense });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // POST /api/expenses — create a new expense
  // ------------------------------------------------------------------
  router.post('/', async (req, res) => {
    const { amount, category, date, note } = req.body;
    const errors = validateExpense({ amount, category, date });
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      const createdAt = new Date().toISOString();
      const result = await db.run(
        'INSERT INTO expenses (amount, category, date, note, createdAt) VALUES (?, ?, ?, ?, ?)',
        [Number(amount), category, date, note || null, createdAt]
      );
      const newExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, data: newExpense });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // PUT /api/expenses/:id — update an expense
  // ------------------------------------------------------------------
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;
    const errors = validateExpense({ amount, category, date });
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      const result = await db.run(
        'UPDATE expenses SET amount = ?, category = ?, date = ?, note = ? WHERE id = ?',
        [Number(amount), category, date, note || null, id]
      );
      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Expense not found' });
      }
      const updatedExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);
      res.json({ success: true, data: updatedExpense });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // DELETE /api/expenses/:id — delete an expense
  // ------------------------------------------------------------------
  router.delete('/:id', async (req, res) => {
    try {
      const result = await db.run('DELETE FROM expenses WHERE id = ?', [req.params.id]);
      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Expense not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // POST /api/expenses/budgets — set/update a category budget
  // ------------------------------------------------------------------
  router.post('/budgets', async (req, res) => {
    const { category, amount } = req.body;
    if (!category || !VALID_CATEGORIES.includes(category) || amount === undefined || Number(amount) < 0) {
      return res.status(400).json({ success: false, error: 'Valid category and non-negative amount are required' });
    }
    try {
      await db.run(
        'INSERT INTO budgets (category, amount) VALUES (?, ?) ON CONFLICT(category) DO UPDATE SET amount = excluded.amount',
        [category, Number(amount)]
      );
      res.status(200).json({ success: true, data: { category, amount: Number(amount) } });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
