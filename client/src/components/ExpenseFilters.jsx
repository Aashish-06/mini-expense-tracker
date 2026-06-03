import React from 'react';
import { CATEGORIES } from '../lib/utils';
import { Filter, Calendar, X } from 'lucide-react';

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
    <div className="glass-card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>

        {/* Category filter */}
        <div style={{ flex: '1 1 160px', minWidth: '140px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={12} color="#64748B" /> Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={e => setCategory(e.target.value)}
            className="premium-input"
            style={{ height: '44px' }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Period quick-select */}
        <div style={{ flex: '2 1 260px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={12} color="#64748B" /> Period
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
          <div style={{ flexShrink: 0, paddingBottom: '1px' }}>
            <button
              id="clear-filters"
              onClick={reset}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(239,68,68,0.10)',
                border: '1px solid rgba(239,68,68,0.22)',
                borderRadius: '10px',
                padding: '9px 14px',
                color: '#FCA5A5',
                fontSize: '13px', fontWeight: '500',
                cursor: 'pointer',
                height: '44px',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.10)'; }}
            >
              <X size={14} /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Custom date range */}
      {filters.period === PERIODS.CUSTOM && (
        <div style={{ marginTop: '16px' }}>
          <div className="gradient-divider" style={{ marginBottom: '16px', marginTop: '0' }} />
          <label className="form-label">Custom Date Range</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              id="filter-start-date"
              type="date"
              value={filters.startDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setCustomRange(e.target.value, filters.endDate)}
              className="premium-input"
              style={{ flex: 1, height: '44px' }}
            />
            <span style={{ color: '#334155', fontSize: '13px', flexShrink: 0, padding: '0 4px' }}>to</span>
            <input
              id="filter-end-date"
              type="date"
              value={filters.endDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setCustomRange(filters.startDate, e.target.value)}
              className="premium-input"
              style={{ flex: 1, height: '44px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
