import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../lib/utils';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#64748b'];

export default function ExpenseChart({ summary }) {
  const data = useMemo(() => {
    if (!summary || !summary.categoryBreakdown) return [];
    return summary.categoryBreakdown
      .filter(item => item.total > 0)
      .map(item => ({
        name: item.category,
        value: item.total
      }))
      .sort((a, b) => b.value - a.value);
  }, [summary]);

  if (!data.length) {
    return (
      <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-border flex flex-col items-center justify-center h-80">
        <p className="text-slate-400">No data available for chart</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-white text-sm">
          <p className="font-semibold mb-1">{payload[0].name}</p>
          <p className="text-blue-400 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-border h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
