# Mini Expense Tracker

This is the solution for the **Mini Expense Tracker** exercise. It is a full-stack application built with React (frontend) and Node.js with Express and SQLite (backend) that allows a user to track daily spending across different categories.

## Tech Stack

- **Frontend**: React (Vite) with functional components and hooks.
- **Styling**: Tailwind CSS v4 for a highly responsive, modern, and dark-themed UI. Lucide-React for icons, and Recharts for the pie chart visualization.
- **Backend**: Node.js with Express.
- **Storage**: SQLite (`sqlite3` and `sqlite` packages). Chosen because it offers persistent relational data storage without the need for installing PostgreSQL or MongoDB, keeping the setup process extremely simple.

## Project Structure

This is a monorepo structure containing both the client and server.

```
expense-tracker/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # UI Components (Dashboard, ExpenseForm, Chart, etc.)
│   │   ├── lib/            # Utility functions (formatting, tailwind helpers)
│   │   ├── services/       # API integration layer
│   │   ├── App.jsx         # Main App entry
│   │   └── main.jsx        # React root
│   ├── package.json
│   └── vite.config.js      # Vite and Tailwind config
├── server/                 # Backend Express Application
│   ├── routes/
│   │   └── expenses.js     # API route handlers
│   ├── database.js         # SQLite initialization and schema
│   ├── server.js           # Express app entry point
│   └── package.json
└── README.md
```

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)

### 1. Start the Backend
Open a terminal and navigate to the project root, then into the `server` directory:
```bash
cd server
npm install
npm run dev
```
The backend will start on `http://localhost:5000` and automatically create the SQLite database file (`expenses.sqlite`) if it doesn't exist.

### 2. Start the Frontend
Open a **new** terminal window, navigate to the project root, then into the `client` directory:
```bash
cd client
npm install
npm run dev
```
The frontend will typically start on `http://localhost:5173`. Open this URL in your browser.

## API Documentation

The backend API is served at `http://localhost:5000/api/expenses`.

### `GET /api/expenses`
Retrieves a list of expenses.
- **Query Parameters**:
  - `category` (optional): Filter by category.
  - `startDate` (optional): Filter by dates >= startDate (YYYY-MM-DD).
  - `endDate` (optional): Filter by dates <= endDate (YYYY-MM-DD).
- **Response**: `[ { id, amount, category, date, note } ]`

### `GET /api/expenses/summary`
Retrieves an aggregation of spending.
- **Response**: 
  ```json
  {
    "totalThisMonth": 1250.50,
    "highestExpense": { "id": 1, "amount": 800, "category": "Food", ... },
    "categoryBreakdown": [
      { "category": "Food", "total": 800 },
      ...
    ]
  }
  ```

### `POST /api/expenses`
Creates a new expense.
- **Request Body**: `{ "amount": 100, "category": "Food", "date": "2023-10-01", "note": "Lunch" }`
- **Response**: The newly created expense object.

### `PUT /api/expenses/:id`
Updates an existing expense.
- **Request Body**: `{ "amount": 150, "category": "Food", "date": "2023-10-01", "note": "Dinner" }`
- **Response**: The updated expense object.

### `DELETE /api/expenses/:id`
Deletes an expense.
- **Response**: Status `204 No Content`.

## Next Steps / What I would build next

- **Tests**: Due to time constraints, I focused heavily on core functionality and UI polish. Next steps would include writing unit tests for components using Vitest and integration tests for the Express endpoints using Supertest.
- **Pagination**: The expense list currently renders everything at once. For large datasets, implementing cursor-based pagination would improve performance.
- **Budget Alerts**: The bonus requirement of visual indicators for exceeding budget limits was left out, but could easily be added by expanding the summary API endpoint to track limits per category.
- **Deployment**: I would configure a GitHub Action to deploy the server to Render and the client to Vercel.
