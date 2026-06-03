import React, { useState } from 'react';
import { formatCurrency } from '../lib/utils';
import { Edit2, Trash2, Download, Receipt } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

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
      <div className="glass-card" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '56px 24px', gap: '12px',
      }}>
        <Receipt size={40} color="#1e293b" strokeWidth={1.2} />
        <p style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>
          No expenses found for the selected criteria
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      {/* Table header row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(30,41,59,0.8)',
        background: 'rgba(5,13,37,0.40)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg,rgba(59,130,246,0.22),rgba(139,92,246,0.16))',
            border: '1px solid rgba(59,130,246,0.18)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Receipt size={14} color="#60A5FA" />
          </div>
          <h3 className="section-title">Expense History</h3>
          <span style={{
            fontSize: '11px', fontWeight: '600', color: '#64748B',
            background: 'rgba(30,41,59,0.7)',
            border: '1px solid rgba(51,65,85,0.5)',
            borderRadius: '99px', padding: '2px 9px',
          }}>
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
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{
              background: 'rgba(5,13,37,0.30)',
              borderBottom: '1px solid rgba(30,41,59,0.7)',
            }}>
              {['Date', 'Category', 'Amount', 'Note', 'Actions'].map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textAlign: i === 4 ? 'right' : 'left',
                    whiteSpace: 'nowrap',
                  }}
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
                  <td style={{ padding: '14px 20px', whiteSpace: 'nowrap', fontSize: '13px', color: '#94A3B8', fontWeight: '500' }}>
                    {expense.date}
                  </td>

                  {/* Category pill */}
                  <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                    <span className={getCatClass(expense.category)}>
                      {expense.category}
                    </span>
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.01em' }}>
                      {formatCurrency(expense.amount)}
                    </span>
                  </td>

                  {/* Note */}
                  <td
                    style={{ padding: '14px 20px', fontSize: '13px', color: '#64748B', maxWidth: '220px' }}
                    title={expense.note}
                  >
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {expense.note || <span style={{ color: '#1e293b' }}>—</span>}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
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
                    <td colSpan={5} style={{
                      padding: '0',
                      background: 'rgba(5,13,37,0.6)',
                      borderLeft: '3px solid #3B82F6',
                    }}>
                      <div style={{ padding: '20px 24px' }}>
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
