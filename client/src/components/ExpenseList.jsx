import React, { useState } from 'react';
import { formatCurrency } from '../lib/utils';
import { Edit2, Trash2, Download } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  const handleExportCSV = () => {
    if (!expenses.length) return;
    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(e => [
        e.date,
        `"${e.category}"`,
        e.amount,
        `"${e.note || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!expenses.length) {
    return (
      <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-lg border border-border text-center">
        <p className="text-slate-400">No expenses found for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-lg border border-border overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border flex justify-between items-center bg-slate-800/50">
        <h3 className="text-lg font-semibold text-white">Expense History</h3>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 py-1.5 px-3 rounded-lg transition-colors border border-blue-500/20"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 text-slate-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Note</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.map((expense) => (
              <React.Fragment key={expense.id}>
                <tr className="hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4 whitespace-nowrap text-slate-300">{expense.date}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                      {expense.category}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap font-semibold text-white">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="p-4 text-slate-400 max-w-[200px] truncate" title={expense.note}>
                    {expense.note || '-'}
                  </td>
                  <td className="p-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingId(expense.id)}
                        className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this expense?')) {
                            onDelete(expense.id);
                          }
                        }}
                        className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                {editingId === expense.id && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-slate-800/40 border-l-4 border-blue-500">
                      <ExpenseForm
                        initialData={expense}
                        onSubmit={async (data) => {
                          await onEdit(expense.id, data);
                          setEditingId(null);
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
