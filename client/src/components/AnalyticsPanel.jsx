import React from 'react';
import { formatCurrency } from '../lib/utils';
import { CreditCard, Hash, BarChart2 } from 'lucide-react';
import './AnalyticsPanel.css';

function getDaysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export default function AnalyticsPanel({ summary, expenseCount }) {
  const totalThisMonth = summary?.totalThisMonth ?? 0;
  const daysInMonth    = getDaysInCurrentMonth();
  const dailyAvg       = expenseCount > 0 ? totalThisMonth / daysInMonth : 0;

  const cards = [
    {
      id: 'monthly-spending',
      label: 'Monthly Spending',
      value: formatCurrency(totalThisMonth),
      sub: 'Total spend this month',
      icon: <CreditCard size={22} color="#34D399" />,
      iconClass: 'icon-box icon-green',
      accentColor: '#10B981',
    },
    {
      id: 'transactions-count',
      label: 'Transactions',
      value: expenseCount,
      sub: 'Recorded this period',
      icon: <Hash size={22} color="#FB923C" />,
      iconClass: 'icon-box icon-orange',
      accentColor: '#F59E0B',
    },
    {
      id: 'daily-average',
      label: 'Daily Average',
      value: formatCurrency(dailyAvg),
      sub: `Based on ${daysInMonth} days`,
      icon: <BarChart2 size={22} color="#60A5FA" />,
      iconClass: 'icon-box icon-blue',
      accentColor: '#3B82F6',
    },
  ];

  return (
    <div className="analytics-grid">
      {cards.map(card => (
        <div
          key={card.id}
          id={card.id}
          className="glass-card analytics-card"
        >
          {/* Icon + label */}
          <div className="analytics-header">
            <p className="analytics-label">
              {card.label}
            </p>
            <div className={card.iconClass}>
              {card.icon}
            </div>
          </div>

          {/* Big metric */}
          <div>
            <p className="analytics-value">
              {card.value}
            </p>
            <p className="analytics-sub">
              {card.sub}
            </p>
          </div>

          {/* Bottom accent line */}
          <div 
            className="analytics-accent"
            style={{
              background: `linear-gradient(90deg, ${card.accentColor}55, transparent)`,
            }} 
          />
        </div>
      ))}
    </div>
  );
}
