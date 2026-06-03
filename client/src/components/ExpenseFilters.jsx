import React from 'react';
import { CATEGORIES } from '../lib/utils';
import { Filter, Calendar, X } from 'lucide-react';
import './ExpenseFilters.css';

const PERIOD_LABELS = {
  all: 'All Time',
  'this-month': 'This Month',
  'last-month': 'Last Month',
  custom: 'Custom',
};

export default function ExpenseFilters({
  filters, setCategory, setPeriod, setCustomRange,
  reset, hasActiveFilters, PERIODS,
}) {
  return (
    <div className="glass-card filters-card">
      <div className="filters-row">

        {/* Category filter */}
        <div className="filters-group-category">
          <label className="form-label filters-label-wrap">
            <Filter size={12} color="#64748B" /> Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={e => setCategory(e.target.value)}
            className="premium-input filters-input"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Period quick-select */}
        <div className="filters-group-period">
          <label className="form-label filters-label-wrap">
            <Calendar size={12} color="#64748B" /> Period
          </label>
          <div className="filters-chips">
            {Object.entries(PERIOD_LABELS).map(([value, label]) => (
              <button
                key={value}
                id={`period-${value}`}
                onClick={() => setPeriod(value)}
                className={`period-chip ${filters.period === value ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <div className="filters-clear-wrap">
            <button
              id="clear-filters"
              onClick={reset}
              className="filters-clear-btn"
            >
              <X size={14} /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Custom date range */}
      {filters.period === PERIODS.CUSTOM && (
        <div className="filters-custom-range">
          <div className="gradient-divider filters-custom-divider" />
          <label className="form-label">Custom Date Range</label>
          <div className="filters-custom-inputs">
            <input
              id="filter-start-date"
              type="date"
              value={filters.startDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setCustomRange(e.target.value, filters.endDate)}
              className="premium-input filters-custom-input"
            />
            <span className="filters-custom-to">to</span>
            <input
              id="filter-end-date"
              type="date"
              value={filters.endDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setCustomRange(filters.startDate, e.target.value)}
              className="premium-input filters-custom-input"
            />
          </div>
        </div>
      )}
    </div>
  );
}
