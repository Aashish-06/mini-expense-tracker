import React, { useState } from 'react';
import { CATEGORIES, formatCurrency } from '../lib/utils';
import { setBudget } from '../services/api';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';

function BudgetProgressBar({ category, budget, spent }) {
  if (!budget) return null;
  const rawPct = (spent / budget) * 100;
  const pct    = Math.min(rawPct, 100);
  const over   = spent > budget;
  const warn   = !over && rawPct > 75;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#CBD5E1' }}>{category}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: over ? '#FCA5A5' : '#94A3B8', fontWeight: over ? '600' : '400' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: over ? '#F87171' : warn ? '#FBBF24' : '#34D399', fontWeight: '500' }}>
          {rawPct.toFixed(0)}% used
        </span>
        {over && (
          <span style={{ fontSize: '11px', color: '#F87171', fontWeight: '500' }}>
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
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(5,150,105,0.18))',
          border: '1px solid rgba(16,185,129,0.20)',
          borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Target size={15} color="#34D399" />
        </div>
        <h3 className="section-title">Set Category Budget</h3>
      </div>

      {/* Active budget progress bars */}
      {categoriesWithBudgets.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
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
        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', textAlign: 'center', padding: '12px 0' }}>
          No budgets set yet. Set one below to start tracking.
        </p>
      )}

      <div className="gradient-divider" />

      {/* Budget setter form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ fontSize: '12.5px', fontWeight: '500', color: '#94A3B8' }}>Set / Update Budget</p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            id="budget-category"
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setAmount(budgets[e.target.value] || '');
            }}
            className="premium-input"
            style={{ flex: 1 }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="input-wrap" style={{ flex: 1 }}>
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
