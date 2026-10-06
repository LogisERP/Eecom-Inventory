import React from 'react';
import { TrendingUp, ArrowDown } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-10">
      
      <div className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[28px] border border-slate-200/80 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">Financial & Performance Reports</h2>
            <p className="text-xs text-slate-500 font-medium">Executive overview of costs, margins, and sales revenue</p>
          </div>
          <button 
            onClick={() => alert('Generating full PDF audit report...')}
            className="py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs shadow-md self-start sm:self-auto"
          >
            Download PDF Report
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500">Gross Sales Revenue</span>
            <h3 className="text-2xl font-black text-slate-900">$ 55,420.00</h3>
            <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +25% vs target
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500">Total Expenditure</span>
            <h3 className="text-2xl font-black text-slate-900">$ 39,462.00</h3>
            <span className="text-xs font-extrabold text-slate-600 flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 text-rose-500" /> Spent in Q1
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500">Net Profit Margin</span>
            <h3 className="text-2xl font-black text-[#2563eb]">$ 15,958.00</h3>
            <span className="text-xs font-extrabold text-blue-600">28.7% Margin Rate</span>
          </div>
        </div>
      </div>

    </div>
  );
};
