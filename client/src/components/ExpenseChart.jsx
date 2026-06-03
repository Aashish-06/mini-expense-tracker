import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../lib/utils';
import { PieChart as PieChartIcon } from 'lucide-react';

const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#F43F5E', '#64748B'];

const CATEGORY_COLORS = {
  Food: '#3B82F6',
  Transport: '#10B981',
  Bills: '#F59E0B',
  Entertainment: '#F97316',
  Shopping: '#8B5CF6',
  Other: '#64748B',
};

const getCategoryColor = (name, index) =>
  CATEGORY_COLORS[name] || CHART_COLORS[index % CHART_COLORS.length];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13,19,56,0.97)',
        border: '1px solid rgba(59,130,246,0.22)',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        outline: 'none',
      }}>
        <p style={{ fontWeight: '600', color: '#ffffff', fontSize: '13px', marginBottom: '3px' }}>
          {payload[0].name}
        </p>
        <p style={{ color: '#60A5FA', fontWeight: '700', fontSize: '14px' }}>
          {formatCurrency(payload[0].value)}
        </p>
        <p style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>
          {payload[0].payload.percent}% of total
        </p>
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ summary }) {
  const { data, totalAmount } = useMemo(() => {
    if (!summary?.categoryBreakdown) return { data: [], totalAmount: 0 };
    const total = summary.categoryBreakdown.reduce((sum, item) => sum + item.total, 0);
    const sorted = summary.categoryBreakdown
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .map(item => ({
        name: item.category,
        value: item.total,
        percent: total > 0 ? Math.round((item.total / total) * 100) : 0,
      }));
    return { data: sorted, totalAmount: total };
  }, [summary]);

  // Empty state
  if (!data.length) {
    return (
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.2))',
            border: '1px solid rgba(59,130,246,0.20)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PieChartIcon size={15} color="#60A5FA" />
          </div>
          <h3 className="section-title">Spending by Category</h3>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '200px', color: '#334155',
          gap: '8px',
        }}>
          <PieChartIcon size={36} strokeWidth={1} />
          <p style={{ fontSize: '13px' }}>No expenses yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.2))',
          border: '1px solid rgba(59,130,246,0.20)',
          borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PieChartIcon size={15} color="#60A5FA" />
        </div>
        <h3 className="section-title">Spending by Category</h3>
      </div>

      {/* Donut chart with centered total */}
      <div style={{ position: 'relative', height: '210px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getCategoryColor(entry.name, index)}
                  opacity={0.92}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label — positioned over the donut hole */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontSize: '18px', fontWeight: '800',
            color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1,
          }}>
            {formatCurrency(totalAmount)}
          </span>
          <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', fontWeight: '500' }}>
            Total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '18px' }}>
        {data.map((entry, index) => (
          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                background: getCategoryColor(entry.name, index),
                boxShadow: `0 0 6px ${getCategoryColor(entry.name, index)}80`,
              }} />
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '500' }}>
                {entry.name}
              </span>
              <span style={{
                fontSize: '11px', color: '#475569',
                background: 'rgba(30,41,59,0.6)',
                padding: '1px 7px', borderRadius: '99px',
              }}>
                {entry.percent}%
              </span>
            </div>
            <span style={{ fontSize: '13px', color: '#CBD5E1', fontWeight: '600' }}>
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
