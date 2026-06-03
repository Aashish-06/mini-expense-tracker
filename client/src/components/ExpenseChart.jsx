import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../lib/utils';
import { PieChart as PieChartIcon } from 'lucide-react';
import './ExpenseChart.css';

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
      <div className="chart-tooltip">
        <p className="chart-tooltip-name">
          {payload[0].name}
        </p>
        <p className="chart-tooltip-value">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="chart-tooltip-percent">
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
      <div className="glass-card chart-card">
        <div className="chart-header">
          <div className="chart-icon-box">
            <PieChartIcon size={15} color="#60A5FA" />
          </div>
          <h3 className="section-title">Spending by Category</h3>
        </div>
        <div className="chart-empty-state">
          <PieChartIcon size={36} strokeWidth={1} />
          <p className="chart-empty-text">No expenses yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card chart-card">
      {/* Header */}
      <div className="chart-header chart-header-margin">
        <div className="chart-icon-box">
          <PieChartIcon size={15} color="#60A5FA" />
        </div>
        <h3 className="section-title">Spending by Category</h3>
      </div>

      {/* Donut chart with centered total */}
      <div className="chart-container">
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
        <div className="chart-center-label">
          <span className="chart-total-amount">
            {formatCurrency(totalAmount)}
          </span>
          <span className="chart-total-text">
            Total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        {data.map((entry, index) => (
          <div key={entry.name} className="chart-legend-item">
            <div className="chart-legend-left">
              <span 
                className="chart-legend-dot"
                style={{
                  background: getCategoryColor(entry.name, index),
                  boxShadow: `0 0 6px ${getCategoryColor(entry.name, index)}80`,
                }} 
              />
              <span className="chart-legend-name">
                {entry.name}
              </span>
              <span className="chart-legend-percent">
                {entry.percent}%
              </span>
            </div>
            <span className="chart-legend-value">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
