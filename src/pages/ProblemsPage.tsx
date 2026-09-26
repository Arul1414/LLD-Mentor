import React, { useState } from 'react';
import { Problem, HistoryItem } from '../types/index.js';
import {
  ArrowRight,
  Award,
  Layers,
  Car,
  Store,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface ProblemsPageProps {
  problems: Problem[];
  history: HistoryItem[];
  onSelectProblem: (problemId: string) => void;
  onStartPractice: (problemId: string) => void;
}

export const ProblemsPage: React.FC<ProblemsPageProps> = ({
  problems,
  history,
  onSelectProblem,
  onStartPractice,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');

  const filteredProblems = problems.filter(p => {
    if (filterDifficulty === 'ALL') return true;
    return p.difficulty === filterDifficulty;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200/60 mb-2">
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            <span>CURATED LLD INTERVIEW PROBLEMS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Practice Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Select an engineering challenge below to model classes, establish relationships, define concurrency guarantees, and evaluate against our 8-dimension rubric.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-medium self-start sm:self-auto">
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterDifficulty === diff
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff === 'ALL' ? 'All Problems' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProblems.map(problem => {
          const problemHistory = history.filter(h => h.problemId === problem.id);
          const completedAttempts = problemHistory.filter(h => h.status === 'COMPLETED' && h.score !== undefined);
          const bestScore = completedAttempts.length > 0
            ? Math.max(...completedAttempts.map(h => h.score!))
            : null;

          const isParking = problem.slug.includes('parking');
          const isVending = problem.slug.includes('vending');
          const isElevator = problem.slug.includes('elevator');

          let ProblemIcon = Car;
          let theme = {
            borderAccent: 'border-l-4 border-l-blue-600 hover:border-blue-300',
            iconBg: 'bg-blue-50 text-blue-600 border-blue-200/80',
            primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondaryBtn: 'border-blue-200 text-blue-700 hover:bg-blue-50/50',
            pill: 'bg-blue-50 text-blue-700 border-blue-200',
          };

          if (isParking) {
            ProblemIcon = Car;
            theme = {
              borderAccent: 'border-l-4 border-l-blue-600 hover:border-blue-400',
              iconBg: 'bg-blue-50 text-blue-600 border-blue-200/80',
              primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
              secondaryBtn: 'border-slate-200 text-slate-700 hover:bg-slate-50',
              pill: 'bg-blue-50 text-blue-700 border-blue-200',
            };
          } else if (isVending) {
            ProblemIcon = Store;
            theme = {
              borderAccent: 'border-l-4 border-l-amber-500 hover:border-amber-400',
              iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
              primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
              secondaryBtn: 'border-slate-200 text-slate-700 hover:bg-slate-50',
              pill: 'bg-amber-50 text-amber-700 border-amber-200',
            };
          } else if (isElevator) {
            ProblemIcon = Building2;
            theme = {
              borderAccent: 'border-l-4 border-l-emerald-600 hover:border-emerald-400',
              iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
              primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
              secondaryBtn: 'border-slate-200 text-slate-700 hover:bg-slate-50',
              pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            };
          }

          const diffBadge =
            problem.difficulty === 'EASY'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : problem.difficulty === 'MEDIUM'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200';

          return (
            <div
              key={problem.id}
              className={`saas-card saas-card-hover p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white border border-slate-200 transition-all ${theme.borderAccent}`}
            >
              <div className="space-y-4 max-w-3xl">
                {/* Header row with Icon, Badges, and Stats */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${theme.iconBg}`}>
                    <ProblemIcon className="w-5 h-5" />
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${diffBadge}`}>
                    {problem.difficulty}
                  </span>

                  <span className="text-xs text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200 font-medium">
                    {problem.functionalRequirements.length} Requirements
                  </span>

                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    30 min
                  </span>

                  {bestScore !== null && (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Best: {bestScore}% ({problemHistory.length} attempt{problemHistory.length > 1 ? 's' : ''})
                    </span>
                  )}
                </div>

                {/* Title & Short Description */}
                <div>
                  <button
                    onClick={() => onSelectProblem(problem.id)}
                    className="text-xl sm:text-2xl font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left flex items-center gap-2 cursor-pointer"
                  >
                    <span>{problem.title}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-all" />
                  </button>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                    {problem.shortDescription}
                  </p>
                </div>

                {/* Expected Design Areas */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Key Architectural Areas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.expectedDesignAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right CTA Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px] shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button
                  onClick={() => onStartPractice(problem.id)}
                  className={`w-full py-3 px-5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer ${theme.primaryBtn}`}
                >
                  <span>Start Practice →</span>
                </button>

                <button
                  onClick={() => onSelectProblem(problem.id)}
                  className={`w-full py-2.5 px-4 rounded-xl border font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${theme.secondaryBtn}`}
                >
                  <span>View Details &amp; Bounds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
