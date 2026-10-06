import React, { useState } from 'react';
import { Bot, Sparkles, X, ArrowRight, Zap, Database } from 'lucide-react';
import { processNlqQuery } from '../services/nlqEngine';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(
    '🤖 Hello! I am your AI Database & Inventory Assistant for Ecom ERP.\n\nAsk me any Natural Language Query (NLQ) about users, low stock items, marketplace channels, or role permissions!'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = prompt.trim();
    if (!q || isGenerating) return;

    try {
      setIsGenerating(true);
      const resText = await processNlqQuery(q);
      setResponse(resText);
      setIsGenerating(false);
      setPrompt('');
    } catch (err: any) {
      console.error("NLQ Engine Error:", err);
      setResponse(`⚠️ Error executing NLQ query: ${err.message || 'Database query failed'}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                Ecom ERP AI Magic
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                <Database className="w-3 h-3 text-blue-600" />
                Live Firestore Database NLQ Engine
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Output Area */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 min-h-[160px] max-h-[300px] overflow-y-auto text-xs text-slate-800 whitespace-pre-line font-medium leading-relaxed shadow-inner">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2.5 text-slate-600 font-bold">
              <Zap className="w-6 h-6 text-blue-600 animate-bounce" />
              <span>Querying Live Firestore Database Telemetry...</span>
            </div>
          ) : (
            response
          )}
        </div>

        {/* Natural Language Query Form */}
        <form onSubmit={handleGenerate} className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            placeholder="Ask NLQ (e.g., 'Who created Amazon?', 'Show low stock')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>Ask</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
