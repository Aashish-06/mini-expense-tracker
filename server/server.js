const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializeDb } = require('./database');
const expensesRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Mini Expense Tracker API is running' });
});

let db;

// Initialize DB and start server
initializeDb().then((database) => {
  db = database;
  console.log('Connected to SQLite database');

  // Register expense routes
  app.use('/api/expenses', expensesRoutes(db));

  // GET /api/summary — top-level summary endpoint (alias)
  app.get('/api/summary', async (_req, res) => {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString().split('T')[0];

      const totalThisMonthRow = await db.get(
        'SELECT SUM(amount) as total FROM expenses WHERE date >= ?',
        [firstDayOfMonth]
      );
      const totalThisMonth = totalThisMonthRow.total || 0;

      const highestExpense = await db.get(
        'SELECT * FROM expenses ORDER BY amount DESC LIMIT 1'
      );

      const categoryBreakdown = await db.all(
        'SELECT category, SUM(amount) as total FROM expenses GROUP BY category ORDER BY total DESC'
      );

      const budgetsList = await db.all('SELECT * FROM budgets');
      const budgets = {};
      budgetsList.forEach(b => budgets[b.category] = b.amount);

      res.json({
        success: true,
        data: {
          totalThisMonth,
          highestExpense: highestExpense || null,
          categoryBreakdown,
          budgets
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = app; // exported for testing
