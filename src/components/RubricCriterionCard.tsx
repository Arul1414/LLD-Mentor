import React from 'react';
import { EvaluationCriterionResult } from '../types/index.js';
import { Search, AlertTriangle, Lightbulb, Compass } from 'lucide-react';

interface RubricCriterionCardProps {
  criterion: EvaluationCriterionResult;
  index: number;
}

export const RubricCriterionCard: React.FC<RubricCriterionCardProps> = ({ criterion, index }) => {
  const score = criterion.score;
  const isHigh = score >= 8;
  const isMid = score >= 6 && score < 8;

  const scoreBadgeClass = isHigh
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isMid
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';

  const progressGradient = isHigh
    ? 'from-emerald-500 to-teal-500'
    : isMid
    ? 'from-amber-500 to-yellow-500'
    : 'from-rose-500 to-pink-500';

  return (
    <div className="saas-card saas-card-hover p-5 sm:p-6 flex flex-col justify-between bg-white border border-slate-200 shadow-2xs">
      <div>
        {/* Card Header: Index, Title, Score */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center border border-slate-200">
              {index + 1}
            </span>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
              {criterion.name}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">Score:</span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${scoreBadgeClass}`}>
              {score} / 10
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progressGradient} transition-all duration-700 ease-out`}
            style={{ width: `${score * 10}%` }}
          />
        </div>

        {/* Feedback Section 1: Evidence */}
        <div className="mb-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span className="uppercase text-[10px] tracking-wider text-slate-600">Evidence</span>
          </div>
          <p className="text-xs text-slate-700 font-mono leading-relaxed pl-5">
            {criterion.evidence}
          </p>
        </div>

        {/* Feedback Section 2: Concern */}
        <div className="mb-3 rounded-xl bg-amber-50/60 border border-amber-200/80 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="uppercase text-[10px] tracking-wider text-amber-700">Concern</span>
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed pl-5">
            {criterion.concern}
          </p>
        </div>

        {/* Feedback Section 3: Suggested Improvement */}
        <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/80 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase text-[10px] tracking-wider text-emerald-700">Suggested Improvement</span>
          </div>
          <p className="text-xs text-emerald-900/90 leading-relaxed pl-5">
            {criterion.suggestion}
          </p>
        </div>
      </div>

      {/* Confidence Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span>Confidence</span>
        </span>
        <span className="text-slate-800 font-semibold px-2 py-0.5 rounded bg-slate-50 border border-slate-200 font-mono">
          {Math.round(criterion.confidence * 100)}%
        </span>
      </div>
    </div>
  );
};
