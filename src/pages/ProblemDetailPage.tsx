import React from 'react';
import { Problem, HistoryItem } from '../types/index.js';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Layers,
  Sparkles,
  History,
  FileCheck,
  BookOpen,
  Cpu,
} from 'lucide-react';

interface ProblemDetailPageProps {
  problem: Problem;
  history: HistoryItem[];
  onBack: () => void;
  onStartPractice: (problemId: string) => void;
  onViewEvaluation: (submissionId: string) => void;
}

export const ProblemDetailPage: React.FC<ProblemDetailPageProps> = ({
  problem,
  history,
  onBack,
  onStartPractice,
  onViewEvaluation,
}) => {
  const problemHistory = history.filter(h => h.problemId === problem.id);
  const completedHistory = problemHistory.filter(h => h.status === 'COMPLETED' && h.score !== undefined);

  const diffBadge =
    problem.difficulty === 'EASY'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : problem.difficulty === 'MEDIUM'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      {/* Top back navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Problems Catalog</span>
      </button>

      {/* Split Layout: Left Content (2 cols) & Right Highlighted Panel (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Panel: Specifications, Requirements, Constraints */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="saas-card p-6 sm:p-8 space-y-4 bg-white border border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${diffBadge}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200 font-medium">
                Low-Level Design Benchmark
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {problem.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {/* Functional Requirements Checklist */}
          <div className="saas-card p-6 sm:p-8 space-y-4 bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Functional Requirements ({problem.functionalRequirements.length})</span>
            </div>

            <div className="space-y-3">
              {problem.functionalRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {req}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints & Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Constraints */}
            <div className="saas-card p-5 sm:p-6 space-y-3 bg-amber-50/40 border border-amber-200/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Physical &amp; System Constraints</span>
              </div>
              <ul className="space-y-2">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="text-xs text-amber-900/90 flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assumptions */}
            <div className="saas-card p-5 sm:p-6 space-y-3 bg-cyan-50/40 border border-cyan-200/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-800">
                <Cpu className="w-4 h-4 text-cyan-600" />
                <span>Architectural Assumptions</span>
              </div>
              <ul className="space-y-2">
                {problem.assumptions.map((a, i) => (
                  <li key={i} className="text-xs text-cyan-900/90 flex items-start gap-2 leading-relaxed">
                    <span className="text-cyan-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Highlighted Panel: Start Practice & Metas */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20">
          <div className="saas-card p-6 sm:p-7 space-y-5 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                DELIBERATE PRACTICE WORKBENCH
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Ready to Architect?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Define classes, establish object relationships, handle concurrency invariants, and submit for instant explainable rubric scoring.
              </p>
            </div>

            {/* Details Table */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Estimated Time:
                </span>
                <span className="text-slate-900 font-bold font-mono">45 – 60 mins</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600" />
                  Design Areas:
                </span>
                <span className="text-slate-900 font-bold font-mono">{problem.expectedDesignAreas.length} Areas</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-600" />
                  Evaluation Criteria:
                </span>
                <span className="text-slate-900 font-bold font-mono">8 Dimensions</span>
              </div>
            </div>

            {/* Expected Design Areas List */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Expected Design Components:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {problem.expectedDesignAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/60 text-[11px] font-medium text-indigo-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Glowing CTA */}
            <button
              onClick={() => onStartPractice(problem.id)}
              className="btn-primary-glow w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-sm"
            >
              <span>Start Practice Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Past Attempts on this problem */}
          {completedHistory.length > 0 && (
            <div className="saas-card p-5 space-y-3 bg-white border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <History className="w-4 h-4 text-indigo-600" />
                <span>Your Attempts ({completedHistory.length})</span>
              </div>

              <div className="space-y-2">
                {completedHistory.map(att => (
                  <div
                    key={att.attemptId}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-slate-900 font-bold font-mono">Attempt #{att.attemptNumber}</span>
                      <span className="text-slate-500 text-[11px] ml-2 font-mono">
                        {new Date(att.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-600 font-mono">{att.score}%</span>
                      {att.submissionId && (
                        <button
                          onClick={() => onViewEvaluation(att.submissionId!)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-600 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Feedback →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
