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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(26,16,51,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="max-w-lg w-full overflow-hidden flex flex-col gap-4 relative animate-scale-in"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid rgba(255,255,255,0.8)',
        }}
      >
        
        {/* Top Header */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: 'var(--clr-primary-lt)',
            borderBottom: '1px solid var(--border-base)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 text-white flex items-center justify-center shadow-md"
              style={{
                background: 'var(--grad-accent)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-purple-950 flex items-center gap-1.5">
                Ecom ERP AI Magic
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <span className="text-[11px] text-purple-700 font-bold flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-purple-600" />
                Live Firestore Database NLQ Engine
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-purple-700 hover:bg-purple-200/50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Output Area */}
        <div className="px-6 flex flex-col gap-4">
          <div
            className="p-4 min-h-[160px] max-h-[300px] overflow-y-auto text-xs text-purple-950 whitespace-pre-line font-semibold leading-relaxed shadow-inner"
            style={{
              background: 'var(--surface-base)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-base)',
            }}
          >
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2.5 text-purple-700 font-bold">
                <Zap className="w-6 h-6 text-purple-600 animate-bounce" />
                <span>Querying Live Firestore Database Telemetry...</span>
              </div>
            ) : (
              response
            )}
          </div>

          {/* Natural Language Query Form */}
          <form onSubmit={handleGenerate} className="flex items-center gap-2 pb-6 pt-1">
            <input
              type="text"
              placeholder="Ask NLQ (e.g., 'Who created Amazon?', 'Show low stock')..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="flex-1 bg-slate-50 border-2 border-slate-200 px-4 py-2.5 text-xs text-slate-800 font-bold outline-none focus:border-purple-600 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-medium"
              style={{ borderRadius: 'var(--radius-pill)' }}
            />
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="py-2.5 px-5 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
              style={{
                background: 'var(--grad-primary)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-btn-primary)',
              }}
            >
              <span>Ask</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
