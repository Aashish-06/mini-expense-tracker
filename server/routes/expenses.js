const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all expenses (with optional filters)
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

      query += ' ORDER BY date DESC';

      const expenses = await db.all(query, params);
      res.json(expenses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get summary
  router.get('/summary', async (req, res) => {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      
      const totalThisMonthQuery = await db.get('SELECT SUM(amount) as total FROM expenses WHERE date >= ?', [firstDayOfMonth]);
      const totalThisMonth = totalThisMonthQuery.total || 0;

      const highestExpenseQuery = await db.get('SELECT * FROM expenses ORDER BY amount DESC LIMIT 1');
      
      const categoryBreakdown = await db.all('SELECT category, SUM(amount) as total FROM expenses GROUP BY category');

      const budgetsList = await db.all('SELECT * FROM budgets');
      const budgets = {};
      budgetsList.forEach(b => budgets[b.category] = b.amount);

      res.json({
        totalThisMonth,
        highestExpense: highestExpenseQuery || null,
        categoryBreakdown,
        budgets
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add new expense
  router.post('/', async (req, res) => {
    const { amount, category, date, note } = req.body;
    
    // Validation
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Amount must be a positive number' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!date) return res.status(400).json({ error: 'Date is required' });
    
    // Check if date is in the future
    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (expenseDate > today) return res.status(400).json({ error: 'Date cannot be in the future' });

    try {
      const result = await db.run(
        'INSERT INTO expenses (amount, category, date, note) VALUES (?, ?, ?, ?)',
        [amount, category, date, note]
      );
      const newExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [result.lastID]);
      res.status(201).json(newExpense);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Edit expense
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;
    
    // Validation
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Amount must be a positive number' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!date) return res.status(400).json({ error: 'Date is required' });
    
    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (expenseDate > today) return res.status(400).json({ error: 'Date cannot be in the future' });

    try {
      const result = await db.run(
        'UPDATE expenses SET amount = ?, category = ?, date = ?, note = ? WHERE id = ?',
        [amount, category, date, note, id]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      const updatedExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);
      res.json(updatedExpense);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete expense
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.run('DELETE FROM expenses WHERE id = ?', [id]);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all budgets
  router.get('/budgets/all', async (req, res) => {
    try {
      const budgetsList = await db.all('SELECT * FROM budgets');
      const budgets = {};
      budgetsList.forEach(b => budgets[b.category] = b.amount);
      res.json(budgets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Set budget
  router.post('/budgets', async (req, res) => {
    const { category, amount } = req.body;
    if (!category || amount === undefined || amount < 0) {
      return res.status(400).json({ error: 'Valid category and positive amount are required' });
    }
    try {
      await db.run(
        'INSERT INTO budgets (category, amount) VALUES (?, ?) ON CONFLICT(category) DO UPDATE SET amount = excluded.amount',
        [category, amount]
      );
      res.status(200).json({ success: true, category, amount });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
