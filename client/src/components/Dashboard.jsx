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
      <div className="app-content" style={{ maxWidth: '1500px', margin: '0 auto', padding: '32px' }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="logo-icon">
              <Activity color="#ffffff" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{
                fontSize: '24px', fontWeight: '800', color: '#ffffff',
                letterSpacing: '-0.03em', lineHeight: 1.2,
              }}>
                Mini Expense Tracker
              </h1>
              <p style={{ fontSize: '13px', color: '#475569', marginTop: '3px', fontWeight: '400' }}>
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
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(239,68,68,0.10)',
            border: '1px solid rgba(239,68,68,0.30)',
            borderRadius: '14px', padding: '14px 18px',
            marginBottom: '24px', color: '#FCA5A5', fontSize: '14px',
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── 2-column dashboard grid ──────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}>

          {/* ── LEFT SIDEBAR ───────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ExpenseForm onSubmit={handleAdd} />
            <ExpenseChart summary={summary} />
            <BudgetManager
              budgets={summary?.budgets || {}}
              categoryBreakdown={summary?.categoryBreakdown || []}
              onBudgetUpdate={reload}
            />
          </div>

          {/* ── RIGHT MAIN CONTENT ──────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

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
              <div className="glass-card" style={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center', height: '200px',
              }}>
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
            <div className="tip-card">
              <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                Keep tracking your expenses to stay on top of your budget! 🎯
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
