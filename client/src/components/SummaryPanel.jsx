import React from 'react';
import { formatCurrency } from '../lib/utils';
import { Wallet, TrendingUp, AlertCircle, ShieldAlert } from 'lucide-react';

export default function SummaryPanel({ summary, error }) {
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl flex items-center gap-2">
        <AlertCircle size={20} />
        <span>Failed to load summary: {error}</span>
      </div>
    );
  }

  const { totalThisMonth = 0, highestExpense = null, categoryBreakdown = [], budgets = {} } = summary || {};

  // Check for budget alerts
  const overBudgetCategories = categoryBreakdown.filter(
    item => budgets[item.category] && item.total > budgets[item.category]
  );

  return (
    <div className="mb-6 space-y-4">
      {overBudgetCategories.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-red-400 font-semibold">
            <ShieldAlert size={20} />
            <span>Budget Exceeded Alerts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {overBudgetCategories.map(item => (
              <div key={item.category} className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center text-sm border border-red-500/20">
                <span className="text-slate-300">{item.category}</span>
                <div className="text-right">
                  <span className="text-red-400 font-bold">{formatCurrency(item.total)}</span>
                  <span className="text-slate-500 text-xs ml-1">/ {formatCurrency(budgets[item.category])}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium mb-1">Total Spent This Month</p>
            <h3 className="text-3xl font-bold text-white">{formatCurrency(totalThisMonth)}</h3>
          </div>
          <div className="bg-blue-500/20 p-4 rounded-full">
            <Wallet className="text-blue-500" size={28} />
          </div>
        </div>
        
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium mb-1">Highest Single Expense</p>
            {highestExpense ? (
              <>
                <h3 className="text-2xl font-bold text-white">{formatCurrency(highestExpense.amount)}</h3>
                <p className="text-xs text-slate-400 mt-1">{highestExpense.category} - {highestExpense.date}</p>
              </>
            ) : (
              <h3 className="text-2xl font-bold text-slate-500">None</h3>
            )}
          </div>
          <div className="bg-purple-500/20 p-4 rounded-full">
            <TrendingUp className="text-purple-400" size={28} />
          </div>
        </div>
      </div>
    </div>
  );
}
