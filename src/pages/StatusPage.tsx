import React, { useEffect, useState } from 'react';
import { Submission, Attempt, Problem } from '../types/index.js';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Cpu,
  ArrowRight,
  RotateCcw,
  Layers,
  ShieldCheck,
  FileSearch,
  Sparkles,
  Bot,
  Brain,
} from 'lucide-react';

interface StatusPageProps {
  attempt: Attempt;
  submission: Submission;
  problem: Problem;
  onEvaluationComplete: (submissionId: string) => void;
  onRetryEvaluation: (submissionId: string) => void;
  onBackToWorkspace: () => void;
}

export const StatusPage: React.FC<StatusPageProps> = ({
  attempt,
  submission,
  problem,
  onEvaluationComplete,
  onRetryEvaluation,
  onBackToWorkspace,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(submission.status === 'COMPLETED' ? 4 : 2);

  useEffect(() => {
    if (submission.status === 'COMPLETED') {
      setCurrentStep(4);
      const timer = setTimeout(() => {
        onEvaluationComplete(submission.id);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (submission.status === 'EVALUATING') {
      setCurrentStep(2);
      const timer1 = setTimeout(() => setCurrentStep(3), 1200);
      return () => clearTimeout(timer1);
    }
  }, [submission.status, submission.id, onEvaluationComplete]);

  const steps = [
    {
      id: 1,
      title: 'Deterministic Pre-Validation',
      desc: 'Checking problem schema, entity presence, and explanation length.',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Zero-Loss Persistence',
      desc: 'Submission permanently stored in client database prior to evaluation.',
      status: currentStep >= 2 ? 'completed' : 'pending',
    },
    {
      id: 3,
      title: 'Rubric Analysis Engine',
      desc: 'Evaluating class responsibilities, coupling, patterns, and concurrency invariants.',
      status:
        submission.status === 'FAILED'
          ? 'failed'
          : currentStep >= 3
          ? submission.status === 'COMPLETED'
            ? 'completed'
            : 'active'
          : 'pending',
    },
    {
      id: 4,
      title: 'Evidence Synthesis & Audit Report',
      desc: 'Generating explainable citations, architectural concerns, and remediation advice.',
      status: submission.status === 'COMPLETED' ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      {/* Header with animated AI Brain/CPU icon */}
      <div className="text-center space-y-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shadow-sm">
            {submission.status === 'COMPLETED' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            ) : submission.status === 'FAILED' ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : (
              <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-indigo-200/60 bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>EVALUATION PIPELINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            {submission.status === 'COMPLETED'
              ? 'Evaluation Complete!'
              : submission.status === 'FAILED'
              ? "Evaluation couldn't be completed."
              : 'Analyzing your low-level design...'}
          </h1>

          <p className="text-xs text-slate-500 font-mono">
            Problem: <span className="text-slate-800 font-semibold">{problem?.title || 'System Problem'}</span> | Submission ID:{' '}
            <span className="text-slate-700 font-medium">{submission?.id ? `${submission.id.slice(0, 16)}...` : 'Processing...'}</span>
          </p>
        </div>
      </div>

      {/* Stepper Card */}
      <div className="saas-card p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
        <div className="space-y-6">
          {steps.map(step => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            const isFailed = step.status === 'failed';

            return (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : isFailed
                        ? 'bg-red-50 text-red-700 border border-red-300'
                        : isActive
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-300 animate-pulse'
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isFailed ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {step.id !== 4 && (
                    <div
                      className={`w-0.5 h-8 mt-1.5 ${
                        isCompleted ? 'bg-emerald-200' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>

                <div className="pt-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        isCompleted
                          ? 'text-slate-900'
                          : isActive
                          ? 'text-indigo-600'
                          : isFailed
                          ? 'text-red-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                      {isCompleted ? 'Done' : isActive ? 'Processing' : isFailed ? 'Failed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* State Notice if Failed */}
        {submission.status === 'FAILED' && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Evaluation couldn't be completed.</span>
            </div>
            <p className="text-xs text-red-800 leading-relaxed pl-6">
              {submission.failureReason ||
                'Evaluation engine was unable to parse the submission. Your submission is safely stored in the database and has not been lost.'}
            </p>
            <div className="pt-2 pl-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onRetryEvaluation(submission.id)}
                className="btn-primary-glow px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Evaluation</span>
              </button>
              <button
                type="button"
                onClick={onBackToWorkspace}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        )}

        {/* Completed button */}
        {submission.status === 'COMPLETED' && (
          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => onEvaluationComplete(submission.id)}
              className="btn-primary-glow px-7 py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-sm cursor-pointer"
            >
              <span>View Full Evaluation Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
