import React from 'react';
import { ShieldCheck, Cpu, Code2, Brain, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/80 text-slate-500 py-10 px-4 text-xs font-sans transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight">LLD MENTOR</span>
              <span className="text-[10px] text-indigo-700 font-semibold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/60">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Low-Level Design Practice &amp; Evidence-Grounded Rubric Evaluation
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-medium">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dual Engine: Rule-Based &amp; Gemini 3.8 Flash</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deterministic Pre-Validation</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
