import React, { useState } from 'react';
import { Bot, Sparkles, X, ArrowRight, Zap } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(
    'Hello! I am your AI Inventory Assistant for Ecom ERP. How can I optimize your stock levels today?'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (queryStr?: string) => {
    const q = queryStr || prompt;
    if (!q) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setResponse(
        `AI Analysis for "${q}":\n\n• Stock Recommendation: Increase "Woman High Heels" stock by 45 units to meet high February demand (+35% trend).\n• Cost Efficiency: Dead stock (20 units) can be discounted by 15% to recover $2,800 in locked capital.\n• Sales Forecast: Estimated weekly revenue expected to hit $68K (+23% growth).`
      );
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                Ecom ERP AI Magic
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Empowering decisions with machine learning</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Output Area */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 min-h-[140px] text-xs text-slate-700 whitespace-pre-line font-medium leading-relaxed">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-500 font-bold">
              <Zap className="w-4 h-4 text-blue-500 animate-bounce" />
              Analyzing inventory telemetry...
            </div>
          ) : (
            response
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleGenerate('Forecast reorder point for low stock')}
            className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
          >
            ⚡ Reorder Forecast
          </button>

          <button
            onClick={() => handleGenerate('Analyze Dead Stock clearance strategy')}
            className="text-[11px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors"
          >
            📦 Dead Stock Audit
          </button>

          <button
            onClick={() => handleGenerate('Suggest pricing optimizations')}
            className="text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors"
          >
            📈 Price Optimization
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            placeholder="Ask AI anything about inventory or sales..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563eb]"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt}
            className="py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
          >
            <span>Ask</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
