const API_URL = 'http://localhost:5000/api/expenses';

export const getExpenses = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_URL}?${query}`);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
};

export const getSummary = async () => {
  const res = await fetch(`${API_URL}/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
};

export const addExpense = async (expense) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to add expense');
  }
  return res.json();
};

export const updateExpense = async (id, expense) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update expense');
  }
  return res.json();
};

export const deleteExpense = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete expense');
  return true;
};

export const setBudget = async (category, amount) => {
  const res = await fetch(`${API_URL}/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, amount }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to set budget');
  }
  return res.json();
};
