import { useState, useEffect, useCallback } from 'react';
import { getFilteredExpenses, getSummary, addExpense, updateExpense, deleteExpense } from '../services/api';

/**
 * Custom hook that owns all expense data-fetching and mutation logic.
 * Components just call handlers and read state — no fetch logic needed inside components.
 */
export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [expensesData, summaryData] = await Promise.all([
        getFilteredExpenses(filters),
        getSummary(),
      ]);
      setExpenses(expensesData);
      setSummary(summaryData);
    } catch (err) {
      setError('Failed to load data. Is the backend server running on port 5000?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reload();
  }, [reload]);

  const handleAdd = async (data) => {
    await addExpense(data);
    await reload();
  };

  const handleUpdate = async (id, data) => {
    await updateExpense(id, data);
    await reload();
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    await reload();
  };

  return {
    expenses,
    summary,
    loading,
    error,
    reload,
    handleAdd,
    handleUpdate,
    handleDelete,
  };
}
