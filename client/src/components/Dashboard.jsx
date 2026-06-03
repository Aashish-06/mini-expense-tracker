import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useFilters } from '../hooks/useFilters';
import SummaryPanel from './SummaryPanel';
import ExpenseChart from './ExpenseChart';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseFilters from './ExpenseFilters';
import BudgetManager from './BudgetManager';
import AnalyticsPanel from './AnalyticsPanel';
import { Activity, AlertCircle, Calendar } from 'lucide-react';
import './Dashboard.css';

function formatHeaderDate(date) {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const {
    filters, apiFilters,
    setCategory, setPeriod, setCustomRange,
    reset, hasActiveFilters, PERIODS,
  } = useFilters();

  const {
    expenses, summary, loading, error,
    reload, handleAdd, handleUpdate, handleDelete,
  } = useExpenses(apiFilters);

  return (
    <div className="app-bg">
      <div className="app-content dash-wrap">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="dash-header">
          <div className="dash-logo-group">
            <div className="logo-icon">
              <Activity color="#ffffff" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="dash-title">
                Mini Expense Tracker
              </h1>
              <p className="dash-subtitle">
                Track your spending. Stay on budget.
              </p>
            </div>
          </div>

          <div className="date-badge">
            <Calendar size={14} color="#3B82F6" />
            <span>{formatHeaderDate(new Date())}</span>
          </div>
        </header>

        {/* ── API Error banner ─────────────────────────────────────────── */}
        {error && (
          <div className="dash-error">
            <AlertCircle size={17} className="dash-error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* ── 2-column dashboard grid ──────────────────────────────────── */}
        <div className="dash-grid">

          {/* ── LEFT SIDEBAR ───────────────────────────────────────────── */}
          <div className="dash-sidebar">
            <ExpenseForm onSubmit={handleAdd} />
            <ExpenseChart summary={summary} />
            <BudgetManager
              budgets={summary?.budgets || {}}
              categoryBreakdown={summary?.categoryBreakdown || []}
              onBudgetUpdate={reload}
            />
          </div>

          {/* ── RIGHT MAIN CONTENT ──────────────────────────────────────── */}
          <div className="dash-main">

            {/* Summary: alert + stat cards */}
            <SummaryPanel summary={summary} />

            {/* Filters */}
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

            {/* Expense table */}
            {loading ? (
              <div className="glass-card dash-loading">
                <div className="spinner" role="status" aria-label="Loading expenses" />
              </div>
            ) : (
              <ExpenseList
                expenses={expenses}
                onEdit={handleUpdate}
                onDelete={handleDelete}
              />
            )}

            {/* Analytics summary cards */}
            <AnalyticsPanel summary={summary} expenseCount={expenses.length} />

            {/* Tip banner */}
            <div className="dash-tip">
              <span className="dash-tip-emoji">💡</span>
              <p className="dash-tip-text">
                Keep tracking your expenses to stay on top of your budget! 🎯
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
