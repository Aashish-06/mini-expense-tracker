const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializeDb } = require('./database');
const expensesRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB and start server
initializeDb().then((db) => {
  console.log('Connected to SQLite database');
  
  // Register routes
  app.use('/api/expenses', expensesRoutes(db));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
