import React from 'react';
import { CATEGORIES } from '../lib/utils';
import { Filter, Calendar, X } from 'lucide-react';

const PERIOD_LABELS = {
  all: 'All Time',
  'this-month': 'This Month',
  'last-month': 'Last Month',
  custom: 'Custom',
};

export default function ExpenseFilters({ filters, apiFilters, setCategory, setPeriod, setCustomRange, reset, hasActiveFilters, PERIODS }) {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl shadow-md border border-border mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category filter */}
        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1">
            <Filter size={16} /> Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Period quick select */}
        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1">
            <Calendar size={16} /> Period
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PERIOD_LABELS).filter(([k]) => k !== 'custom').map(([value, label]) => (
              <button
                key={value}
                id={`period-${value}`}
                onClick={() => setPeriod(value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  filters.period === value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom date range — only shown when period = custom */}
      {filters.period === PERIODS.CUSTOM && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Custom Date Range</label>
          <div className="flex items-center gap-2">
            <input
              id="filter-start-date"
              type="date"
              value={filters.startDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setCustomRange(e.target.value, filters.endDate)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [color-scheme:dark]"
            />
            <span className="text-slate-500 shrink-0">to</span>
            <input
              id="filter-end-date"
              type="date"
              value={filters.endDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setCustomRange(filters.startDate, e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [color-scheme:dark]"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => setPeriod(PERIODS.CUSTOM)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            filters.period === PERIODS.CUSTOM
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
          }`}
        >
          Custom Range
        </button>

        {hasActiveFilters && (
          <button
            id="clear-filters"
            onClick={reset}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors ml-auto"
          >
            <X size={14} /> Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
