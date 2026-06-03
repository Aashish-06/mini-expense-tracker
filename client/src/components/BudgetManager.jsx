import React, { useState } from 'react';
import { CATEGORIES, formatCurrency } from '../lib/utils';
import { setBudget } from '../services/api';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';

function BudgetProgressBar({ category, budget, spent }) {
  if (!budget) return null;
  const pct = Math.min((spent / budget) * 100, 100);
  const over = spent > budget;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-slate-300">{category}</span>
        <span className={over ? 'text-red-400 font-semibold' : 'text-slate-400'}>
          {formatCurrency(spent)} / {formatCurrency(budget)}
          {over && <AlertTriangle className="inline ml-1" size={12} />}
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-xs text-slate-500">{pct.toFixed(0)}% used</div>
    </div>
  );
}

export default function BudgetManager({ budgets = {}, categoryBreakdown = [], onBudgetUpdate }) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Build a spending map from the summary breakdown
  const spending = {};
  categoryBreakdown.forEach(item => { spending[item.category] = item.total; });

  const categoriesWithBudgets = CATEGORIES.filter(c => budgets[c]);
  const currentBudget = budgets[selectedCategory] || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) return;

    setSaving(true);
    setMessage('');
    try {
      await setBudget(selectedCategory, parsedAmount);
      setMessage('Budget saved!');
      onBudgetUpdate();
      setAmount('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-border space-y-6">
      <div className="flex items-center gap-2">
        <Target className="text-emerald-500" size={22} />
        <h3 className="text-lg font-semibold text-white">Budget Tracker</h3>
      </div>

      {/* Progress bars for categories that have budgets */}
      {categoriesWithBudgets.length > 0 ? (
        <div className="space-y-4">
          {categoriesWithBudgets.map(cat => (
            <BudgetProgressBar
              key={cat}
              category={cat}
              budget={budgets[cat]}
              spent={spending[cat] || 0}
            />
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm text-center py-2">
          No budgets set yet. Set a budget below to track spending.
        </p>
      )}

      <hr className="border-border" />

      {/* Budget setter form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm font-medium text-slate-300">Set / Update Budget</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            id="budget-category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setAmount(budgets[e.target.value] || '');
            }}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
            <input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={currentBudget ? currentBudget : 'Limit'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-5 rounded-lg transition-colors disabled:opacity-50 shrink-0"
          >
            {saving ? '...' : 'Save'}
          </button>
        </div>

        {message && (
          <p className="text-sm text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={14} /> {message}
          </p>
        )}
      </form>
    </div>
  );
}
