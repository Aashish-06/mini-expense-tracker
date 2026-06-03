import React, { useState } from 'react';
import { CATEGORIES, formatCurrency } from '../lib/utils';
import { setBudget } from '../services/api';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import './BudgetManager.css';

function BudgetProgressBar({ category, budget, spent }) {
  if (!budget) return null;
  const rawPct = (spent / budget) * 100;
  const pct    = Math.min(rawPct, 100);
  const over   = spent > budget;
  const warn   = !over && rawPct > 75;

  return (
    <div className="budget-progress-container">
      <div className="budget-progress-header">
        <span className="budget-category-label">{category}</span>
        <div className="budget-amounts-container">
          <span className={`budget-amounts-text ${over ? 'over' : 'normal'}`}>
            {formatCurrency(spent)} / {formatCurrency(budget)}
          </span>
          {over && <AlertTriangle size={12} color="#EF4444" />}
        </div>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill ${over ? 'progress-danger' : warn ? 'progress-warning' : 'progress-success'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="budget-status-row">
        <span className={`budget-used-text ${over ? 'danger' : warn ? 'warning' : 'success'}`}>
          {rawPct.toFixed(0)}% used
        </span>
        {over && (
          <span className="budget-over-text">
            Over by {formatCurrency(spent - budget)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BudgetManager({ budgets = {}, categoryBreakdown = [], onBudgetUpdate }) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
    } catch {
      setMessage('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card budget-card">
      {/* Header */}
      <div className="budget-header">
        <div className="budget-icon">
          <Target size={15} color="#34D399" />
        </div>
        <h3 className="section-title">Set Category Budget</h3>
      </div>

      {/* Active budget progress bars */}
      {categoriesWithBudgets.length > 0 ? (
        <div className="budget-list">
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
        <p className="budget-empty">
          No budgets set yet. Set one below to start tracking.
        </p>
      )}

      <div className="gradient-divider" />

      {/* Budget setter form */}
      <form onSubmit={handleSubmit} className="budget-form">
        <p className="budget-form-label">Set / Update Budget</p>

        <div className="budget-form-row">
          <select
            id="budget-category"
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setAmount(budgets[e.target.value] || '');
            }}
            className="premium-input budget-form-select"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="input-wrap budget-form-input-wrap">
            <span className="input-prefix">₹</span>
            <input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={currentBudget ? String(currentBudget) : 'Limit'}
              className="premium-input"
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-success">
          {saving ? 'Saving…' : 'Set Budget'}
        </button>

        {message && (
          <p className="success-flash">
            <CheckCircle2 size={14} />
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
