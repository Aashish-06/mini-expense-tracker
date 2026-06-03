import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../lib/utils';
import { X, Plus } from 'lucide-react';
import './ExpenseForm.css';

export default function ExpenseForm({ onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date,
        note: initialData.note || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) return setError('Amount must be a positive number');
    if (!formData.category) return setError('Category is required');
    if (!formData.date) return setError('Date is required');

    const expenseDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (expenseDate > today) return setError('Date cannot be in the future');

    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, amount: amountNum });
      if (!initialData) {
        setFormData({
          amount: '',
          category: CATEGORIES[0],
          date: new Date().toISOString().split('T')[0],
          note: '',
        });
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card form-card">
      {/* Card header */}
      <div className="form-header">
        <div className="form-header-left">
          <div className="form-icon-box">
            <Plus size={16} color="#60A5FA" strokeWidth={2.5} />
          </div>
          <h3 className="section-title">
            {initialData ? 'Edit Expense' : 'Add New Expense'}
          </h3>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="form-cancel-btn"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Error */}
      {error && <div className="error-msg form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-body">

        {/* Amount */}
        <div>
          <label className="form-label">Amount *</label>
          <div className="input-wrap">
            <span className="input-prefix">₹</span>
            <input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              className="premium-input"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="form-label">Category *</label>
          <select
            id="expense-category"
            required
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="premium-input"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="form-label">Date *</label>
          <input
            id="expense-date"
            type="date"
            required
            max={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className="premium-input"
          />
        </div>

        {/* Note */}
        <div>
          <label className="form-label">Note (Optional)</label>
          <input
            id="expense-note"
            type="text"
            value={formData.note}
            onChange={e => setFormData({ ...formData, note: e.target.value })}
            className="premium-input"
            placeholder="e.g. Lunch with team"
            maxLength={100}
          />
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting} className="btn-primary form-submit-btn">
          {isSubmitting ? 'Saving…' : initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}
