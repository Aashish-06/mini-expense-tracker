import React, { useState, useEffect, useCallback } from 'react';
import { getExpenses, getSummary, addExpense, updateExpense, deleteExpense } from '../services/api';
import SummaryPanel from './SummaryPanel';
import ExpenseChart from './ExpenseChart';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseFilters from './ExpenseFilters';
import BudgetManager from './BudgetManager';
import { Activity } from 'lucide-react';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [expensesData, summaryData] = await Promise.all([
        getExpenses(filters),
        getSummary()
      ]);
      setExpenses(expensesData);
      setSummary(summaryData);
      setError('');
    } catch (err) {
      setError('Failed to load data. Please ensure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddExpense = async (expenseData) => {
    await addExpense(expenseData);
    loadData();
  };

  const handleEditExpense = async (id, expenseData) => {
    await updateExpense(id, expenseData);
    loadData();
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    loadData();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border pb-6">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Activity className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Mini Expense Tracker</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your spending and visualize where your money goes</p>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form & Chart */}
          <div className="space-y-8">
            <ExpenseForm onSubmit={handleAddExpense} />
            <ExpenseChart summary={summary} />
            <BudgetManager budgets={summary?.budgets || {}} onBudgetUpdate={loadData} />
          </div>

          {/* Right Column - Summary & List */}
          <div className="lg:col-span-2 space-y-6">
            <SummaryPanel summary={summary} />
            <ExpenseFilters filters={filters} setFilters={setFilters} />
            
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-card rounded-2xl border border-border">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ExpenseList 
                expenses={expenses} 
                onEdit={handleEditExpense} 
                onDelete={handleDeleteExpense} 
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
