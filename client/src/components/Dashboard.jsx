import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useFilters } from '../hooks/useFilters';
import SummaryPanel from './SummaryPanel';
import ExpenseChart from './ExpenseChart';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseFilters from './ExpenseFilters';
import BudgetManager from './BudgetManager';
import { Activity, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { filters, apiFilters, setCategory, setPeriod, setCustomRange, reset, hasActiveFilters, PERIODS } = useFilters();
  const { expenses, summary, loading, error, reload, handleAdd, handleUpdate, handleDelete } = useExpenses(apiFilters);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="flex items-center gap-3 border-b border-border pb-6">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Activity className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Mini Expense Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Track daily spending • Visualize categories • Stay on budget
            </p>
          </div>
        </header>

        {/* ── Connection error ────────────────────────────────────── */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl"
          >
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ─────────────────────────────────────── */}
          <div className="space-y-8">
            <ExpenseForm onSubmit={handleAdd} />
            <ExpenseChart summary={summary} />
            <BudgetManager
              budgets={summary?.budgets || {}}
              categoryBreakdown={summary?.categoryBreakdown || []}
              onBudgetUpdate={reload}
            />
          </div>

          {/* ── Right column ────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <SummaryPanel summary={summary} />

            <ExpenseFilters
              filters={filters}
              apiFilters={apiFilters}
              setCategory={setCategory}
              setPeriod={setPeriod}
              setCustomRange={setCustomRange}
              reset={reset}
              hasActiveFilters={hasActiveFilters}
              PERIODS={PERIODS}
            />

            {loading ? (
              <div className="flex justify-center items-center h-64 bg-card rounded-2xl border border-border">
                <div
                  role="status"
                  aria-label="Loading expenses"
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                />
              </div>
            ) : (
              <ExpenseList
                expenses={expenses}
                onEdit={handleUpdate}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
