import React from 'react';
import { formatCurrency } from '../lib/utils';
import { Wallet, TrendingUp, ShieldAlert, AlertCircle } from 'lucide-react';
import './SummaryPanel.css';

export default function SummaryPanel({ summary, error }) {
  if (error) {
    return (
      <div className="summary-error">
        <AlertCircle size={17} />
        <span>Failed to load summary: {error}</span>
      </div>
    );
  }

  const {
    totalThisMonth = 0,
    highestExpense = null,
    categoryBreakdown = [],
    budgets = {},
  } = summary || {};

  const overBudget = categoryBreakdown.filter(
    item => budgets[item.category] && item.total > budgets[item.category]
  );

  return (
    <div className="summary-container">

      {/* ── Budget Alert Banner ─────────────────────────────────────── */}
      {overBudget.length > 0 && (
        <div className="alert-banner summary-alert-banner">
          <div className="summary-alert-header">
            <div className="icon-box icon-red summary-alert-icon">
              <ShieldAlert size={16} color="#FCA5A5" />
            </div>
            <span className="summary-alert-title">
              Budget Exceeded Alert
            </span>
          </div>

          <div className="summary-alert-list">
            {overBudget.map(item => {
              const pct = Math.round((item.total / budgets[item.category]) * 100);
              return (
                <div key={item.category}>
                  <div className="summary-alert-item-header">
                    <span className="summary-alert-category">
                      {item.category}
                    </span>
                    <div className="summary-alert-stats">
                      <span className="summary-alert-amounts">
                        <span className="summary-alert-spent">
                          {formatCurrency(item.total)}
                        </span>
                        {' '}/ {formatCurrency(budgets[item.category])}
                      </span>
                      <span className="summary-alert-pct">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill progress-danger summary-alert-progress"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="summary-grid">

        {/* Total spent */}
        <div className="glass-card summary-card">
          <div>
            <p className="summary-card-label">
              Total Spent This Month
            </p>
            <h3 className="summary-card-value">
              {formatCurrency(totalThisMonth)}
            </h3>
            <div className="summary-trend">
              <TrendingUp size={12} color="#34D399" />
              <span className="summary-trend-text">This month</span>
            </div>
          </div>
          <div className="icon-box icon-blue">
            <Wallet size={22} color="#60A5FA" />
          </div>
        </div>

        {/* Highest expense */}
        <div className="glass-card summary-card">
          <div>
            <p className="summary-card-label">
              Highest Single Expense
            </p>
            {highestExpense ? (
              <>
                <h3 className="summary-card-value">
                  {formatCurrency(highestExpense.amount)}
                </h3>
                <p className="summary-card-sub">
                  {highestExpense.category} • {highestExpense.date}
                </p>
              </>
            ) : (
              <h3 className="summary-card-value-none">None</h3>
            )}
          </div>
          <div className="icon-box icon-purple">
            <TrendingUp size={22} color="#A78BFA" />
          </div>
        </div>
      </div>
    </div>
  );
}
