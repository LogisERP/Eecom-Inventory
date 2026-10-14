import React from 'react';
import { RECENT_ORDERS } from '../data/mockData';
import { Printer, ShoppingBag } from 'lucide-react';

const ORDER_STATUS: Record<string, { bg: string; color: string }> = {
  'Received':   { bg: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' },
  'Processing': { bg: 'var(--clr-warning-lt)',  color: 'var(--clr-warning)'  },
  'Shipped':    { bg: 'var(--clr-secondary-lt)', color: 'var(--clr-secondary)' },
  'Delivered':  { bg: 'var(--clr-success-lt)',  color: 'var(--clr-success)'  },
};

export const OrdersView: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 sm:gap-6 animate-fade-in pb-32 pt-2"
      style={{ fontFamily: 'var(--font-game)' }}>

      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7"
        style={{
          background: 'linear-gradient(135deg,#1A1033 0%,#231547 60%,#1D1B4B 100%)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
        }}>
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(37,99,235,0.20)' }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black mb-2"
            style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.70)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--clr-secondary)' }} />
            DISPATCH & FULFILLMENT
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Customer Orders
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full"
              style={{ background: 'rgba(37,99,235,0.25)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.30)' }}>
              Live Tracking
            </span>
          </h2>
          <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            1,254K Total Sales in Week · Real-time order status tracking
          </p>
        </div>

        <button
          onClick={() => alert('Exporting orders CSV statement...')}
          className="relative z-10 flex items-center justify-center gap-2 font-black text-xs transition-all self-start sm:self-auto"
          style={{
            background: 'var(--grad-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-pill)',
            padding: '12px 24px',
            boxShadow: 'var(--shadow-btn)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Printer className="w-4 h-4" />
          <span>Export Order Report</span>
        </button>
      </div>

      {/* Table Card */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider"
                style={{ background: 'var(--clr-primary-lt)', borderBottom: '2px solid var(--border-strong)', color: 'var(--clr-primary)' }}>
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5">Order Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((ord, idx) => {
                const badge = ORDER_STATUS[ord.status] || { bg: '#F1F5F9', color: '#64748B' };
                return (
                  <tr key={ord.id}
                    className="transition-colors group"
                    style={{ borderBottom: '1px solid var(--border-base)', background: idx % 2 === 0 ? '#fff' : '#FAFBFF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#FAFBFF'; }}
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg"
                        style={{ background: 'var(--clr-primary-lt)', color: 'var(--clr-primary)' }}>
                        {ord.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-sm" style={{ color: 'var(--txt-primary)' }}>{ord.customerName}</span>
                        <span className="text-[10px] font-medium" style={{ color: 'var(--txt-muted)' }}>{ord.customerEmail}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-xs" style={{ color: 'var(--txt-secondary)' }}>{ord.productName}</td>
                    <td className="py-3.5 px-5 font-black text-sm" style={{ color: 'var(--txt-primary)' }}>${ord.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-5 font-medium text-xs" style={{ color: 'var(--txt-muted)' }}>{ord.date}</td>
                    <td className="py-3.5 px-5 font-bold text-xs" style={{ color: 'var(--txt-secondary)' }}>{ord.paymentMethod}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black"
                        style={{ background: badge.bg, color: badge.color }}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {RECENT_ORDERS.length === 0 && (
        <div className="p-16 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-3xl flex items-center justify-center"
            style={{ background: 'var(--clr-primary-lt)' }}>
            <ShoppingBag className="w-6 h-6" style={{ color: 'var(--clr-primary)' }} />
          </div>
          <p className="text-sm font-bold" style={{ color: 'var(--txt-secondary)' }}>No orders found.</p>
        </div>
      )}
    </div>
  );
};
