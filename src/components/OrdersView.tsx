import React from 'react';
import { RECENT_ORDERS } from '../data/mockData';
import { Printer } from 'lucide-react';

export const OrdersView: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 animate-fade-in pb-32 pt-2">
      
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[11px] font-black text-slate-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            DISPATCH & FULFILLMENT
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Customer Orders</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">1,254K Total Sales in Week • Real-time order status tracking</p>
        </div>

        <button 
          onClick={() => alert('Exporting orders CSV statement...')}
          className="py-3 px-6 rounded-full bg-[#121316] hover:bg-black text-white font-black text-xs shadow-md flex items-center gap-2 transition-transform active:scale-95"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Export Order Report</span>
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {RECENT_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-[#2563eb]">{ord.id}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-800">{ord.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{ord.customerEmail}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-800">{ord.productName}</td>
                  <td className="py-3.5 px-5 font-black text-slate-900">${ord.amount.toFixed(2)}</td>
                  <td className="py-3.5 px-5 font-medium text-slate-500">{ord.date}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-700">{ord.paymentMethod}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-max ${
                      ord.status === 'Received'
                        ? 'bg-[#19232d] text-white'
                        : ord.status === 'Processing'
                        ? 'bg-amber-100 text-amber-800'
                        : ord.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
