import React, { useState } from 'react';
import { formatCurrency } from '../lib/utils';
import { Edit2, Trash2, Download, Receipt } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import './ExpenseList.css';

/* ── Category pill helper ─────────────────────────────────────── */
const PILL_CLASS = {
  Food:          'cat-pill cat-food',
  Transport:     'cat-pill cat-transport',
  Bills:         'cat-pill cat-bills',
  Entertainment: 'cat-pill cat-entertainment',
  Shopping:      'cat-pill cat-shopping',
  Other:         'cat-pill cat-other',
};
const getCatClass = (cat) => PILL_CLASS[cat] || 'cat-pill cat-other';

/* ── CSV export ──────────────────────────────────────────────── */
function exportCSV(expenses) {
  if (!expenses.length) return;
  const rows = [
    ['Date', 'Category', 'Amount', 'Note'].join(','),
    ...expenses.map(e =>
      [e.date, `"${e.category}"`, e.amount, `"${e.note || ''}"`].join(',')
    ),
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Main component ──────────────────────────────────────────── */
export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (!expenses.length) {
    return (
      <div className="glass-card list-empty-card">
        <Receipt size={40} color="#1e293b" strokeWidth={1.2} />
        <p className="list-empty-text">
          No expenses found for the selected criteria
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card list-card">
      {/* Table header row */}
      <div className="list-header">
        <div className="list-header-left">
          <div className="list-icon-box">
            <Receipt size={14} color="#60A5FA" />
          </div>
          <h3 className="section-title">Expense History</h3>
          <span className="list-count-badge">
            {expenses.length}
          </span>
        </div>
        <button
          onClick={() => exportCSV(expenses)}
          className="btn-export"
          title="Export to CSV"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="list-table-container">
        <table className="list-table">
          <thead>
            <tr className="list-thead-tr">
              {['Date', 'Category', 'Amount', 'Note', 'Actions'].map((h, i) => (
                <th
                  key={h}
                  className={`list-th ${i === 4 ? 'right' : 'left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <React.Fragment key={expense.id}>
                <tr className="expense-row">
                  {/* Date */}
                  <td className="list-td list-td-date">
                    {expense.date}
                  </td>

                  {/* Category pill */}
                  <td className="list-td">
                    <span className={getCatClass(expense.category)}>
                      {expense.category}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="list-td">
                    <span className="list-td-amount">
                      {formatCurrency(expense.amount)}
                    </span>
                  </td>

                  {/* Note */}
                  <td
                    className="list-td list-td-note"
                    title={expense.note}
                  >
                    <span className="list-note-text">
                      {expense.note || <span className="list-note-empty">—</span>}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="list-td list-td-actions">
                    <div className="list-actions-wrap">
                      <ActionBtn
                        onClick={() => setEditingId(editingId === expense.id ? null : expense.id)}
                        color="#3B82F6"
                        hoverBg="rgba(59,130,246,0.12)"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </ActionBtn>
                      <ActionBtn
                        onClick={() => {
                          if (window.confirm('Delete this expense?')) onDelete(expense.id);
                        }}
                        color="#EF4444"
                        hoverBg="rgba(239,68,68,0.12)"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </ActionBtn>
                    </div>
                  </td>
                </tr>

                {/* Inline edit form */}
                {editingId === expense.id && (
                  <tr>
                    <td colSpan={5} className="list-edit-row">
                      <div className="list-edit-container">
                        <ExpenseForm
                          initialData={expense}
                          onSubmit={async (data) => {
                            await onEdit(expense.id, data);
                            setEditingId(null);
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      </div>
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

/* ── Small action icon button ─────────────────────────────────── */
function ActionBtn({ onClick, color, hoverBg, title, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: hovered ? hoverBg : 'transparent',
        border: `1px solid ${hovered ? color + '44' : 'transparent'}`,
        borderRadius: '8px',
        padding: '6px',
        cursor: 'pointer',
        color: hovered ? color : '#475569',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}
