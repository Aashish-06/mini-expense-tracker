import React from 'react';
import { formatCurrency } from '../lib/utils';
import { Wallet, TrendingUp, ShieldAlert, AlertCircle } from 'lucide-react';

export default function SummaryPanel({ summary, error }) {
  if (error) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)',
        borderRadius: '14px', padding: '14px 18px', color: '#FCA5A5', fontSize: '14px',
      }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Budget Alert Banner ─────────────────────────────────────── */}
      {overBudget.length > 0 && (
        <div className="alert-banner" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div className="icon-box icon-red" style={{ padding: '8px' }}>
              <ShieldAlert size={16} color="#FCA5A5" />
            </div>
            <span style={{ fontWeight: '700', color: '#FCA5A5', fontSize: '15px' }}>
              Budget Exceeded Alert
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {overBudget.map(item => {
              const pct = Math.round((item.total / budgets[item.category]) * 100);
              return (
                <div key={item.category}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '7px',
                  }}>
                    <span style={{ fontSize: '14px', color: '#E2E8F0', fontWeight: '500' }}>
                      {item.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                        <span style={{ color: '#FCA5A5', fontWeight: '700' }}>
                          {formatCurrency(item.total)}
                        </span>
                        {' '}/ {formatCurrency(budgets[item.category])}
                      </span>
                      <span style={{
                        fontSize: '12px', fontWeight: '700',
                        color: '#EF4444',
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.28)',
                        borderRadius: '6px', padding: '2px 8px',
                      }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill progress-danger"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Total spent */}
        <div className="glass-card" style={{ padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#64748B', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Total Spent This Month
            </p>
            <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {formatCurrency(totalThisMonth)}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
              <TrendingUp size={12} color="#34D399" />
              <span style={{ fontSize: '12px', color: '#34D399', fontWeight: '500' }}>This month</span>
            </div>
          </div>
          <div className="icon-box icon-blue">
            <Wallet size={22} color="#60A5FA" />
          </div>
        </div>

        {/* Highest expense */}
        <div className="glass-card" style={{ padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#64748B', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Highest Single Expense
            </p>
            {highestExpense ? (
              <>
                <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {formatCurrency(highestExpense.amount)}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px', fontWeight: '500' }}>
                  {highestExpense.category} • {highestExpense.date}
                </p>
              </>
            ) : (
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#334155', lineHeight: 1 }}>None</h3>
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
