import React from 'react';
import { formatCurrency } from '../lib/utils';
import { CreditCard, Hash, BarChart2 } from 'lucide-react';

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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {cards.map(card => (
        <div
          key={card.id}
          id={card.id}
          className="glass-card"
          style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Icon + label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{
              fontSize: '12px', fontWeight: '600', color: '#64748B',
              textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              {card.label}
            </p>
            <div className={card.iconClass}>
              {card.icon}
            </div>
          </div>

          {/* Big metric */}
          <div>
            <p style={{
              fontSize: '26px', fontWeight: '800', color: '#ffffff',
              letterSpacing: '-0.04em', lineHeight: 1,
            }}>
              {card.value}
            </p>
            <p style={{ fontSize: '12px', color: '#475569', marginTop: '6px', fontWeight: '400' }}>
              {card.sub}
            </p>
          </div>

          {/* Bottom accent line */}
          <div style={{
            height: '2px',
            borderRadius: '99px',
            background: `linear-gradient(90deg, ${card.accentColor}55, transparent)`,
          }} />
        </div>
      ))}
    </div>
  );
}
