import React, { useState, useEffect } from 'react';
import { Problem } from '../types/index.js';
import { getProblemConfig } from '../config/problemConfigs.js';
import { Sparkles, HelpCircle } from 'lucide-react';

interface StructuredExplanationEditorProps {
  value: string;
  onChange: (value: string) => void;
  problem?: Problem;
}

export const StructuredExplanationEditor: React.FC<StructuredExplanationEditorProps> = ({
  value,
  onChange,
  problem,
}) => {
  const problemConfig = getProblemConfig(problem);
  const prompts = problemConfig.explanationPrompts;

  const defaultSections = {
    reasoning: '',
    assumptions: '',
    tradeOffs: '',
    extensibility: '',
    patternsUsed: '',
  };

  // Parse structured explanation string into separate fields
  const parseSections = (raw: string) => {
    if (!raw) return defaultSections;

    const reasoningMatch = raw.match(/### DESIGN REASONING\s*([\s\S]*?)(?=### ASSUMPTIONS|$)/i);
    const assumptionsMatch = raw.match(/### ASSUMPTIONS\s*([\s\S]*?)(?=### TRADE-OFFS|$)/i);
    const tradeOffsMatch = raw.match(/### TRADE-OFFS\s*([\s\S]*?)(?=### EXTENSIBILITY|$)/i);
    const extensibilityMatch = raw.match(/### EXTENSIBILITY\s*([\s\S]*?)(?=### PATTERNS USED|$)/i);
    const patternsMatch = raw.match(/### PATTERNS USED\s*([\s\S]*?)$/i);

    if (reasoningMatch || assumptionsMatch || tradeOffsMatch || extensibilityMatch || patternsMatch) {
      return {
        reasoning: reasoningMatch ? reasoningMatch[1].trim() : '',
        assumptions: assumptionsMatch ? assumptionsMatch[1].trim() : '',
        tradeOffs: tradeOffsMatch ? tradeOffsMatch[1].trim() : '',
        extensibility: extensibilityMatch ? extensibilityMatch[1].trim() : '',
        patternsUsed: patternsMatch ? patternsMatch[1].trim() : '',
      };
    }

    // Fallback: If unformatted legacy text, put in reasoning
    return {
      ...defaultSections,
      reasoning: raw.trim(),
    };
  };

  const [sections, setSections] = useState(() => parseSections(value));

  // Sync internal state if prop changes drastically from outside
  useEffect(() => {
    const currentCombined = serialize(sections);
    if (value && value !== currentCombined) {
      setSections(parseSections(value));
    }
  }, [value]);

  const serialize = (s: typeof sections): string => {
    const parts = [
      `### DESIGN REASONING\n${s.reasoning.trim() || 'Not specified'}`,
      `\n### ASSUMPTIONS\n${s.assumptions.trim() || 'Standard domain assumptions'}`,
      `\n### TRADE-OFFS\n${s.tradeOffs.trim() || 'Considered trade-offs between simplicity and extensibility'}`,
      `\n### EXTENSIBILITY\n${s.extensibility.trim() || 'Modular components allow substituting implementations'}`,
      `\n### PATTERNS USED\n${s.patternsUsed.trim() || 'Object-oriented patterns'}`,
    ];
    return parts.join('\n');
  };

  const updateSection = (field: keyof typeof sections, text: string) => {
    const next = { ...sections, [field]: text };
    setSections(next);
    onChange(serialize(next));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            Structured Design Explanation ({problemConfig.title})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Answer the 5 architectural reasoning prompts. Your explanations directly feed the rubric analysis.
          </p>
        </div>
      </div>

      {/* 1. DESIGN REASONING */}
      <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-violet-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-800 flex items-center justify-center text-[11px] font-bold">1</span>
            DESIGN REASONING
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {sections.reasoning.length} chars
          </span>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          {prompts.reasoning.question}
        </p>
        <textarea
          rows={3}
          value={sections.reasoning}
          onChange={e => updateSection('reasoning', e.target.value)}
          placeholder={prompts.reasoning.placeholder}
          className="w-full saas-input p-3 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 font-mono"
        />
      </div>

      {/* 2. ASSUMPTIONS */}
      <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-violet-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-800 flex items-center justify-center text-[11px] font-bold">2</span>
            ASSUMPTIONS
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {sections.assumptions.length} chars
          </span>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          {prompts.assumptions.question}
        </p>
        <textarea
          rows={3}
          value={sections.assumptions}
          onChange={e => updateSection('assumptions', e.target.value)}
          placeholder={prompts.assumptions.placeholder}
          className="w-full saas-input p-3 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 font-mono"
        />
      </div>

      {/* 3. TRADE-OFFS */}
      <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-violet-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-800 flex items-center justify-center text-[11px] font-bold">3</span>
            TRADE-OFFS
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {sections.tradeOffs.length} chars
          </span>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          {prompts.tradeOffs.question}
        </p>
        <textarea
          rows={3}
          value={sections.tradeOffs}
          onChange={e => updateSection('tradeOffs', e.target.value)}
          placeholder={prompts.tradeOffs.placeholder}
          className="w-full saas-input p-3 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 font-mono"
        />
      </div>

      {/* 4. EXTENSIBILITY */}
      <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-violet-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-800 flex items-center justify-center text-[11px] font-bold">4</span>
            EXTENSIBILITY
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {sections.extensibility.length} chars
          </span>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          {prompts.extensibility.question}
        </p>
        <textarea
          rows={3}
          value={sections.extensibility}
          onChange={e => updateSection('extensibility', e.target.value)}
          placeholder={prompts.extensibility.placeholder}
          className="w-full saas-input p-3 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 font-mono"
        />
      </div>

      {/* 5. PATTERNS USED */}
      <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-violet-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-800 flex items-center justify-center text-[11px] font-bold">5</span>
            PATTERNS USED
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {sections.patternsUsed.length} chars
          </span>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          {prompts.patternsUsed.question}
        </p>
        <textarea
          rows={3}
          value={sections.patternsUsed}
          onChange={e => updateSection('patternsUsed', e.target.value)}
          placeholder={prompts.patternsUsed.placeholder}
          className="w-full saas-input p-3 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 font-mono"
        />
      </div>
    </div>
  );
};
