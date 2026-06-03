const API_URL = 'http://localhost:5000/api';

/**
 * Generic fetch wrapper. Extracts `data` from the standard
 * { success, data } response envelope.
 */
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // 204 No Content has no body
  if (res.status === 204) return true;

  const json = await res.json();

  if (!res.ok) {
    // Server returns { errors: [] } or { error: '' }
    const message =
      (json.errors && json.errors.join(', ')) ||
      json.error ||
      'An unexpected error occurred';
    throw new Error(message);
  }

  return json.data !== undefined ? json.data : json;
}

// ── Expenses ────────────────────────────────────────────────────────

export const getExpenses = (filters = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  ).toString();
  return request(`/expenses${query ? `?${query}` : ''}`);
};

export const getExpense = (id) => request(`/expenses/${id}`);

export const getFilteredExpenses = (filters = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  ).toString();
  return request(`/expenses/filter${query ? `?${query}` : ''}`);
};

export const getSummary = () => request('/summary');

export const addExpense = (expense) =>
  request('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });

export const updateExpense = (id, expense) =>
  request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  });

export const deleteExpense = (id) =>
  request(`/expenses/${id}`, { method: 'DELETE' });

// ── Budgets ─────────────────────────────────────────────────────────

export const setBudget = (category, amount) =>
  request('/expenses/budgets', {
    method: 'POST',
    body: JSON.stringify({ category, amount }),
  });
