import React from 'react';
import { CATEGORIES } from '../lib/utils';
import { Filter, Calendar, X } from 'lucide-react';

export default function ExpenseFilters({ filters, setFilters }) {
  const handleReset = () => {
    setFilters({ category: '', startDate: '', endDate: '' });
  };

  const hasActiveFilters = filters.category || filters.startDate || filters.endDate;

  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl shadow-md border border-border mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        
        <div className="flex-1 w-full">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1">
            <Filter size={16} /> Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1">
            <Calendar size={16} /> Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [color-scheme:dark]"
              title="Start Date"
            />
            <span className="self-center text-slate-500">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [color-scheme:dark]"
              title="End Date"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-lg transition-colors border border-slate-700"
          >
            <X size={16} /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
