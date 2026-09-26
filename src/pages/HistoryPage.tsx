import React, { useState } from 'react';
import { HistoryItem, Problem } from '../types/index.js';
import {
  History,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  FileSearch,
  Filter,
  Layers,
  Award,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

interface HistoryPageProps {
  history: HistoryItem[];
  problems: Problem[];
  onViewEvaluation: (submissionId: string) => void;
  onTryAgain: (problemId: string) => void;
  onNavigateProblems: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  problems,
  onViewEvaluation,
  onTryAgain,
  onNavigateProblems,
}) => {
  const [filterProblemId, setFilterProblemId] = useState<string>('ALL');

  const filteredHistory = filterProblemId === 'ALL'
    ? history
    : history.filter(h => h.problemId === filterProblemId);

  // Compute analytics
  const completedAttempts = history.filter(h => h.status === 'COMPLETED' && h.score !== undefined);
  const totalAttempts = history.length;
  const avgScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedAttempts.length)
    : 0;
  const bestScore = completedAttempts.length > 0
    ? Math.max(...completedAttempts.map(h => h.score || 0))
    : 0;
  const uniqueProblemsPracticed = new Set(history.map(h => h.problemId)).size;

  // Group attempts by problem for progression analysis
  const progressionByProblem = problems.map(prob => {
    const probAttempts = history
      .filter(h => h.problemId === prob.id && h.status === 'COMPLETED' && h.score !== undefined)
      .sort((a, b) => a.attemptNumber - b.attemptNumber);
    return {
      problem: prob,
      attempts: probAttempts,
    };
  }).filter(p => p.attempts.length > 0);

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>DEVELOPER ANALYTICS &amp; REPEATED PRACTICE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Practice History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Deliberate practice yields measurable improvement. Track score trajectories across iterative design attempts.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Filter:</span>
          <select
            value={filterProblemId}
            onChange={e => setFilterProblemId(e.target.value)}
            className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Problems</option>
            {problems.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Attempts */}
        <div className="saas-card p-5 space-y-1.5 bg-white border border-slate-200 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Attempts</span>
            <History className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalAttempts}</div>
          <p className="text-[11px] text-slate-500">All practice sessions logged</p>
        </div>

        {/* Card 2: Average Score */}
        <div className="saas-card p-5 space-y-1.5 bg-white border border-slate-200 border-l-4 border-l-violet-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Average Score</span>
            <BarChart3 className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-black text-violet-700 font-mono">
            {avgScore > 0 ? `${avgScore}%` : '–'}
          </div>
          <p className="text-[11px] text-slate-500">Across completed reviews</p>
        </div>

        {/* Card 3: Best Score */}
        <div className="saas-card p-5 space-y-1.5 bg-white border border-slate-200 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Best Score</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            {bestScore > 0 ? `${bestScore}%` : '–'}
          </div>
          <p className="text-[11px] text-slate-500">Highest architectural rating</p>
        </div>

        {/* Card 4: Problems Practiced */}
        <div className="saas-card p-5 space-y-1.5 bg-white border border-slate-200 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Catalog Coverage</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {uniqueProblemsPracticed} <span className="text-base text-slate-400 font-normal">/ {problems.length}</span>
          </div>
          <p className="text-[11px] text-slate-500">Unique problems drilled</p>
        </div>
      </div>

      {/* Progression Timeline / Cards */}
      {progressionByProblem.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Score Improvement Progression
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {progressionByProblem.map(({ problem, attempts }) => {
              const latestAttempt = attempts[attempts.length - 1];
              const previousAttempt = attempts.length > 1 ? attempts[attempts.length - 2] : null;
              const delta = previousAttempt && latestAttempt.score !== undefined && previousAttempt.score !== undefined
                ? latestAttempt.score - previousAttempt.score
                : null;

              return (
                <div
                  key={problem.id}
                  className="saas-card p-6 space-y-4 flex flex-col justify-between bg-white border border-slate-200 shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-lg">{problem.title}</h3>
                      <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 font-medium">
                        {attempts.length} Attempt{attempts.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Latest attempt delta callout */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-slate-500">Latest Result:</div>
                        <div className="text-xl font-black text-slate-900 font-mono">
                          {latestAttempt.score}%
                        </div>
                      </div>

                      {delta !== null ? (
                        <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                          delta > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : delta < 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {delta > 0 ? `↑ +${delta}%` : delta < 0 ? `↓ ${delta}%` : 'Even'}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">First Attempt</span>
                      )}
                    </div>

                    {/* Step-by-step progress visualizer */}
                    <div className="space-y-2 text-xs pt-1">
                      {attempts.map(att => (
                        <div key={att.attemptId} className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-600">
                            <span>Attempt #{att.attemptNumber}</span>
                            <span className="font-bold text-emerald-600 font-mono">{att.score}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                              style={{ width: `${att.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {latestAttempt.submissionId && (
                      <button
                        onClick={() => onViewEvaluation(latestAttempt.submissionId!)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>View Feedback</span>
                      </button>
                    )}
                    <button
                      onClick={() => onTryAgain(problem.id)}
                      className="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 transition-colors ml-auto cursor-pointer"
                    >
                      <span>Try Again</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Attempts Table / Logs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            All Practice Session Logs ({filteredHistory.length})
          </h2>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="saas-card rounded-3xl p-14 text-center border-dashed border-slate-300 bg-slate-50/50 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900">Your first attempt starts here.</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Choose a Low-Level Design benchmark from the problem catalog, design your class models, and receive your first architectural audit!
              </p>
            </div>
            <button
              onClick={onNavigateProblems}
              className="btn-primary-glow px-6 py-3 rounded-xl text-white font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Explore Practice Challenges</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="saas-card overflow-hidden bg-white border border-slate-200 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3.5 px-5">Challenge</th>
                    <th className="py-3.5 px-4">Attempt #</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map(item => {
                    const statusColor =
                      item.status === 'COMPLETED'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : item.status === 'EVALUATING'
                        ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                        : item.status === 'FAILED'
                        ? 'text-red-700 bg-red-50 border-red-200'
                        : 'text-slate-600 bg-slate-50 border-slate-200';

                    return (
                      <tr key={item.attemptId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900 text-sm">
                          {item.problemTitle}
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-mono">
                          #{item.attemptNumber}
                        </td>
                        <td className="py-4 px-4 text-slate-500 text-[11px] font-mono">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${statusColor}`}>
                              {item.status}
                            </span>
                            {item.status === 'COMPLETED' && (item.isStrict || item.evaluationMode === 'STRICT') && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-0.5">
                                <Zap className="w-2.5 h-2.5 text-amber-600" />
                                <span>Strict</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {item.score !== undefined ? (
                            <span className="font-bold text-emerald-600 text-base font-mono">
                              {item.score}%
                            </span>
                          ) : (
                            <span className="text-slate-400">–</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            {item.submissionId && item.status === 'COMPLETED' && (
                              <button
                                onClick={() => onViewEvaluation(item.submissionId!)}
                                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium transition-colors flex items-center gap-1.5 border border-indigo-200 cursor-pointer"
                              >
                                <FileSearch className="w-3.5 h-3.5" />
                                <span>Feedback</span>
                              </button>
                            )}
                            <button
                              onClick={() => onTryAgain(item.problemId)}
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3 text-slate-500" />
                              <span>Try Again</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
