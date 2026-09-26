import React, { useState, useEffect } from 'react';
import { Evaluation, Problem, Submission, Attempt } from '../types/index.js';
import { ScoreGauge } from '../components/ScoreGauge.js';
import { RubricCriterionCard } from '../components/RubricCriterionCard.js';
import { fetchProblemAttempts } from '../services/api.js';
import {
  ArrowLeft,
  RotateCcw,
  History,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  FileCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Award,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Info,
  Check,
  Zap,
  ShieldAlert,
} from 'lucide-react';

interface EvaluationReportPageProps {
  evaluation: Evaluation;
  problem: Problem;
  submission: Submission | null;
  allProblems?: Problem[];
  onTryAgain: (problemId: string, forceNew?: boolean) => void;
  onViewHistory: () => void;
  onBackToProblems: () => void;
  onSelectProblem?: (problemId: string) => void;
  onReEvaluateStrict?: (submissionId: string, isStrict?: boolean) => Promise<void> | void;
}

export const EvaluationReportPage: React.FC<EvaluationReportPageProps> = ({
  evaluation,
  problem,
  submission,
  allProblems = [],
  onTryAgain,
  onViewHistory,
  onBackToProblems,
  onSelectProblem,
  onReEvaluateStrict,
}) => {
  const [showSubmissionDrawer, setShowSubmissionDrawer] = useState(false);
  const [problemAttempts, setProblemAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [isReEvaluating, setIsReEvaluating] = useState<boolean>(false);

  const isStrict = evaluation.isStrict ?? (evaluation.evaluationMode === 'STRICT');

  const handleTriggerReEvaluate = async (targetStrict: boolean) => {
    const subId = submission?.id || evaluation.submissionId;
    if (!subId || !onReEvaluateStrict) return;
    try {
      setIsReEvaluating(true);
      await onReEvaluateStrict(subId, targetStrict);
    } catch (err) {
      console.warn('Re-evaluation notification:', err);
    } finally {
      setIsReEvaluating(false);
    }
  };

  // Load previous attempts for this problem to show improvement
  useEffect(() => {
    let isMounted = true;
    const loadAttempts = async () => {
      try {
        setLoadingAttempts(true);
        const atts = await fetchProblemAttempts(problem.id);
        if (isMounted) {
          // Sort by attempt number
          atts.sort((a, b) => a.attemptNumber - b.attemptNumber);
          setProblemAttempts(atts);
        }
      } catch (err) {
        console.warn('Could not load problem attempts:', err);
      } finally {
        if (isMounted) setLoadingAttempts(false);
      }
    };

    loadAttempts();
    return () => {
      isMounted = false;
    };
  }, [problem.id, evaluation.id]);

  const evaluatorLabel =
    evaluation.evaluatorType === 'AI_GEMINI'
      ? 'Gemini 3.8 Flash AI Model'
      : evaluation.evaluatorType === 'RULE_BASED'
      ? 'Deterministic Rubric Evaluator'
      : 'Peer Design Review';

  // Determine next problem suggestion
  const nextProblem = allProblems.find(p => p.id !== problem.id) || {
    id: problem.id === 'prob_parking_lot' ? 'prob_vending_machine' : 'prob_elevator_system',
    title: problem.id === 'prob_parking_lot' ? 'Vending Machine' : 'Elevator System',
  };

  const submittedClassesCount = submission?.classes?.length ?? 0;
  const submittedRelCount = submission?.relationships?.length ?? 0;

  // Clean Next Practice suggestion copy
  const getNextPracticeDisplay = () => {
    if (evaluation.nextPracticeSuggestion) {
      let text = evaluation.nextPracticeSuggestion;
      // Replace legacy phrases like "Try the Vending Machine problem next to practice..."
      text = text.replace(/Try the\s+/i, 'Continue with another LLD problem such as ');
      text = text.replace(/Try:\s+/i, 'Continue with ');
      return text;
    }
    return `Continue with another LLD problem such as ${nextProblem.title} to practice additional design concepts.`;
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Top navigation row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBackToProblems}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Problems</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewHistory}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>Attempt History</span>
          </button>
          <button
            onClick={() => onTryAgain(problem.id, true)}
            className="btn-primary-glow px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Create New Attempt →</span>
          </button>
        </div>
      </div>

      {/* Main Header / Score Gauge Section */}
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>DESIGN EVALUATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Design Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Objective learning feedback report assessed across 8 foundational low-level design dimensions, citing concrete evidence directly from your submitted design models.
          </p>
        </div>

        {/* Score Ring & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Large Radial Score Gauge */}
          <div className="md:col-span-1">
            <ScoreGauge score={evaluation.overallScore} size="lg" />
          </div>

          {/* Right Meta & Scope Panel */}
          <div className="md:col-span-2 saas-card p-6 sm:p-7 flex flex-col justify-between space-y-4 bg-white border border-slate-200 shadow-sm">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
                  {problem.title}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  {evaluatorLabel}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold border bg-amber-50 text-amber-800 border-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Strict Interview Bar</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Evaluation Date: {new Date(evaluation.evaluatedAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {evaluation.overallScore >= 80
                  ? 'Strong Foundation – Good LLD Practice Design'
                  : evaluation.overallScore >= 65
                  ? 'Solid Baseline – Good LLD Practice Design'
                  : 'Developing Design – Key Areas to Refactor'}
              </h2>

              {/* Strict Evaluation Callout Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider font-mono text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Strict Evaluation Calibration Active</span>
                  </div>
                  <span className="text-[10px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                    FAANG / Tier-1 Bar
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed pt-0.5">
                  Assessed under strict senior technical interview rigor: hard score caps are enforced if core domain abstractions are omitted (&lt;4 classes capped at 62%), encapsulation leaks are flagged, concurrency guards must be explicit, and behavioral patterns are required for domain state variations.
                </p>
              </div>

              {/* Evaluation Scope Callout */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Evaluation Scope</span>
                </div>
                <div className="text-xs text-slate-800 font-medium">
                  {submittedClassesCount} {submittedClassesCount === 1 ? 'class' : 'classes'} • {submittedRelCount} {submittedRelCount === 1 ? 'relationship' : 'relationships'}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                  The evaluation is based on the classes, relationships, methods, and explanations submitted in this attempt.
                  {submittedClassesCount < 3 && (
                    <span className="block mt-0.5 text-slate-500 italic">
                      Evaluation Scope: {submittedClassesCount} {submittedClassesCount === 1 ? 'class' : 'classes'} and {submittedRelCount} {submittedRelCount === 1 ? 'relationship were' : 'relationships were'} submitted. The score reflects only this submitted design.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Next Practice Callout */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3 mt-2">
              <Compass className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-indigo-900">Next Practice: </span>
                <span className="text-slate-700">{getNextPracticeDisplay()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          PREVIOUS ATTEMPTS & PROGRESS TRAJECTORY
         ==================================================== */}
      {problemAttempts.length > 0 && (
        <div className="saas-card p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
                PREVIOUS ATTEMPTS ({problemAttempts.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Preserved in history
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {problemAttempts.map(att => {
              const isCurrent = att.id === evaluation.attemptId;
              const hasScore = typeof att.score === 'number';

              return (
                <div
                  key={att.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/50 border-indigo-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      Attempt #{att.attemptNumber}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {hasScore ? att.score : '--'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="capitalize">{att.status.toLowerCase().replace('_', ' ')}</span>
                    <span>{new Date(att.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual improvement line if multiple attempts */}
          {problemAttempts.filter(a => typeof a.score === 'number').length > 1 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-xs font-mono">
              <span className="font-bold text-slate-700">Score Progression:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {problemAttempts
                  .filter(a => typeof a.score === 'number')
                  .map((a, idx, arr) => (
                    <React.Fragment key={a.id}>
                      <span className="font-bold text-indigo-700">
                        Attempt #{a.attemptNumber} → {a.score}
                      </span>
                      {idx < arr.length - 1 && <span className="text-slate-400">➔</span>}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Strengths & Priority Improvements 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✓ STRENGTHS */}
        <div className="saas-card p-6 space-y-4 border border-emerald-200 bg-emerald-50/40 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>✓ STRENGTHS</span>
          </div>
          <ul className="space-y-2.5">
            {evaluation.strengths.map((str, i) => (
              <li key={i} className="text-xs text-emerald-900 flex items-start gap-2.5 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ⚠ AREAS TO IMPROVE */}
        <div className="saas-card p-6 space-y-4 border border-amber-200 bg-amber-50/40 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>⚠ AREAS TO IMPROVE</span>
          </div>
          <ul className="space-y-2.5">
            {evaluation.priorityImprovements.map((imp, i) => (
              <li key={i} className="text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  →
                </span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 💡 SUGGESTED IMPROVEMENTS BREAKDOWN */}
      <div className="saas-card p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
            💡 SUGGESTED IMPROVEMENTS
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold uppercase font-mono text-slate-500">What to Change</div>
            <p className="text-xs text-slate-800 leading-relaxed">
              Refactor large classes into single-purpose components. Delegate algorithmic logic (e.g. searching, pricing, or dispatching) to independent strategy interfaces.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold uppercase font-mono text-slate-500">Why</div>
            <p className="text-xs text-slate-800 leading-relaxed">
              Decoupling eliminates tight dependencies, isolates responsibilities, and adheres to Open/Closed and Single Responsibility principles.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold uppercase font-mono text-slate-500">How</div>
            <p className="text-xs text-slate-800 leading-relaxed">
              Create a dedicated Strategy or State interface and inject it into the manager class to encapsulate variable behavior.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable: Inspect Submitted Design Drawer */}
      {submission && (
        <div className="saas-card overflow-hidden bg-white border border-slate-200 shadow-2xs rounded-2xl">
          <button
            type="button"
            onClick={() => setShowSubmissionDrawer(!showSubmissionDrawer)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>Inspect Evaluated Design ({submission.classes.length} classes, {submission.relationships.length} relationships)</span>
            </div>
            {showSubmissionDrawer ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showSubmissionDrawer && (
            <div className="p-5 sm:p-6 border-t border-slate-200 space-y-6 bg-slate-50/50 font-mono text-xs">
              {/* Classes */}
              <div className="space-y-3">
                <span className="text-slate-700 font-bold uppercase text-[11px] tracking-wider font-sans">
                  Submitted Classes:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {submission.classes.map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="font-bold text-slate-900 text-sm font-mono flex items-center justify-between">
                        <span>{c.name}</span>
                        {c.type && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {c.type}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-600 text-xs font-sans">{c.responsibility}</div>
                      {c.attributes.length > 0 && (
                        <div className="text-[11px] text-blue-700 pt-1 font-mono">
                          Attributes: {c.attributes.join(', ')}
                        </div>
                      )}
                      {c.methods.length > 0 && (
                        <div className="text-[11px] text-emerald-700 font-mono">
                          Methods: {c.methods.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationships */}
              {submission.relationships.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-slate-700 font-bold uppercase text-[11px] tracking-wider font-sans">
                    Submitted Relationships:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {submission.relationships.map(r => (
                      <div key={r.id} className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 shadow-2xs">
                        <span className="font-bold text-slate-900">{r.sourceClass}</span>
                        <span className="text-cyan-700 font-bold mx-1.5">--[{r.relationship}]--&gt;</span>
                        <span className="font-bold text-slate-900">{r.targetClass}</span>
                        {r.reason && <p className="text-[11px] text-slate-500 font-sans mt-0.5">{r.reason}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation */}
              {submission.explanation && (
                <div className="space-y-2 pt-2">
                  <span className="text-slate-700 font-bold uppercase text-[11px] tracking-wider font-sans">
                    Submitted Design Explanation:
                  </span>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-2xs">
                    {submission.explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 8-Dimension Rubric Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Detailed Dimension Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Each dimension is scored 1–10 with citations from your submitted class models.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            8/8 Criteria Scored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {evaluation.criteria.map((criterion, idx) => (
            <RubricCriterionCard key={criterion.name || idx} criterion={criterion} index={idx} />
          ))}
        </div>
      </div>

      {/* ====================================================
          TRY AGAIN & NEXT PRACTICE BOTTOM ACTIONS
         ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        {/* TRY AGAIN */}
        <div className="saas-card p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase font-mono text-slate-500">
              Refactor &amp; Improve
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">
              TRY AGAIN
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Create Attempt #{problemAttempts.length + 1}. Your previous attempts will remain permanently preserved in history.
            </p>
          </div>
          <button
            onClick={() => onTryAgain(problem.id, true)}
            className="btn-primary-glow py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Create New Attempt →</span>
          </button>
        </div>

        {/* NEXT PRACTICE */}
        <div className="saas-card p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase font-mono text-slate-500">
              Expand Catalog Knowledge
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">
              NEXT PRACTICE
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              {getNextPracticeDisplay()}
            </p>
          </div>
          <button
            onClick={() => {
              if (onSelectProblem) {
                onSelectProblem(nextProblem.id);
              } else {
                onTryAgain(nextProblem.id, false);
              }
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <span>Next Practice →</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
