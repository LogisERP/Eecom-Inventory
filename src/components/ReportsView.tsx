import React from 'react';
import { TrendingUp, ArrowDown, BarChart3, Download } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const metrics = [
    {
      label: 'Gross Sales Revenue', value: '$ 55,420.00',
      sub: '+25% vs target', subColor: 'var(--clr-success)', subIcon: <TrendingUp className="w-3.5 h-3.5" />,
      accentBg: 'var(--clr-success-lt)', accentColor: 'var(--clr-success)',
    },
    {
      label: 'Total Expenditure', value: '$ 39,462.00',
      sub: 'Spent in Q1', subColor: 'var(--clr-error)', subIcon: <ArrowDown className="w-3.5 h-3.5" />,
      accentBg: 'var(--clr-error-lt)', accentColor: 'var(--clr-error)',
    },
    {
      label: 'Net Profit Margin', value: '$ 15,958.00',
      sub: '28.7% Margin Rate', subColor: 'var(--clr-primary)', subIcon: <BarChart3 className="w-3.5 h-3.5" />,
      accentBg: 'var(--clr-primary-lt)', accentColor: 'var(--clr-primary)',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-5 animate-fade-in pb-10" style={{ fontFamily: 'var(--font-game)' }}>

      {/* Header card */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)', padding: '20px 24px' }}
        className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black mb-2"
              style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}>
              <BarChart3 className="w-3 h-3" /> FINANCIAL ANALYTICS
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: 'var(--txt-primary)' }}>
              Financial & Performance Reports
            </h2>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--txt-secondary)' }}>
              Executive overview of costs, margins, and sales revenue
            </p>
          </div>
          <button
            onClick={() => alert('Generating full PDF audit report...')}
            className="flex items-center gap-2 font-black text-xs text-white transition-all self-start sm:self-auto"
            style={{ background: 'var(--grad-primary)', borderRadius: 'var(--radius-pill)', padding: '10px 20px', boxShadow: 'var(--shadow-btn)', border: 'none', cursor: 'pointer' }}
          >
            <Download className="w-4 h-4" />
            Download PDF Report
          </button>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label}
              className="p-5 flex flex-col gap-2 transition-all hover:-translate-y-0.5"
              style={{ background: m.accentBg, borderRadius: 'var(--radius-lg)', border: `1.5px solid ${m.accentColor}30` }}>
              <span className="text-xs font-bold" style={{ color: m.accentColor }}>{m.label}</span>
              <h3 className="text-2xl font-black" style={{ color: 'var(--txt-primary)' }}>{m.value}</h3>
              <span className="text-xs font-extrabold flex items-center gap-1" style={{ color: m.subColor }}>
                {m.subIcon} {m.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
