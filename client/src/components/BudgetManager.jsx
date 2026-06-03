import React, { useState } from 'react';
import { CATEGORIES, formatCurrency } from '../lib/utils';
import { setBudget } from '../services/api';
import { Target, CheckCircle2 } from 'lucide-react';

export default function BudgetManager({ budgets = {}, onBudgetUpdate }) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount < 0) return;
    
    setLoading(true);
    setMessage('');
    try {
      await setBudget(selectedCategory, parseFloat(amount));
      setMessage('Budget saved!');
      onBudgetUpdate(); // Trigger a data reload
      setAmount('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const currentBudget = budgets[selectedCategory] || 0;

  return (
    <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-border mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-emerald-500" size={24} />
        <h3 className="text-lg font-semibold text-white">Set Category Budgets</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setAmount(budgets[e.target.value] || '');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Monthly Limit (Current: {formatCurrency(currentBudget)})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Limit amount"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Set Budget'}
          </button>
          {message && (
            <span className="text-sm flex items-center gap-1 text-emerald-400">
              <CheckCircle2 size={16} /> {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
