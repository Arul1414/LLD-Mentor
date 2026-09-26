import React, { useState, useEffect } from 'react';
import {
  fetchProblems,
  fetchHistory,
  createAttempt,
  fetchAttempt,
  saveSubmission,
  evaluateSubmission,
  reEvaluateSubmission,
  fetchEvaluation,
  resetDatabaseSeeds,
} from './services/api.js';
import { Problem, Attempt, Submission, Evaluation, HistoryItem } from './types/index.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { ProblemsPage } from './pages/ProblemsPage.js';
import { ProblemDetailPage } from './pages/ProblemDetailPage.js';
import { PracticeWorkspacePage } from './pages/PracticeWorkspacePage.js';
import { StatusPage } from './pages/StatusPage.js';
import { EvaluationReportPage } from './pages/EvaluationReportPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { RubricDocsPage } from './pages/RubricDocsPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { useFullscreen } from './hooks/useFullscreen.js';
import { Brain, AlertCircle } from 'lucide-react';

type ViewMode =
  | 'home'
  | 'problems'
  | 'problem-detail'
  | 'workspace'
  | 'status'
  | 'report'
  | 'history'
  | 'rubric'
  | 'login';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Fullscreen support
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Active Context State
  const [activeProblemId, setActiveProblemId] = useState<string>('prob_parking_lot');
  const [activeAttempt, setActiveAttempt] = useState<Attempt | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [activeEvaluation, setActiveEvaluation] = useState<Evaluation | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedProblems, fetchedHistory] = await Promise.all([
        fetchProblems(),
        fetchHistory(),
      ]);
      setProblems(fetchedProblems);
      setHistory(fetchedHistory);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setGlobalError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleSelectProblem = (problemId: string) => {
    setActiveProblemId(problemId);
    setCurrentView('problem-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPractice = async (problemId: string, forceNew: boolean = false) => {
    try {
      setActiveProblemId(problemId);
      setLoading(true);
      // Create new attempt (returns { attempt, submission, resumed })
      const res = await createAttempt(problemId, 'user_default', forceNew);
      setActiveAttempt(res.attempt);
      setActiveSubmission(res.submission || null);

      // If attempt has submission ID, ensure we have full details
      if (res.attempt?.submissionId && !res.submission) {
        try {
          const fetchedAttempt = await fetchAttempt(res.attempt.id);
          setActiveSubmission(fetchedAttempt.submission || null);
        } catch {
          setActiveSubmission(null);
        }
      }

      setCurrentView('workspace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to start practice attempt:', err);
      setGlobalError(err.message || 'Failed to create new practice attempt');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (data: {
    classes: any[];
    relationships: any[];
    explanation: string;
    optionalCode?: string;
  }) => {
    if (!activeAttempt) return;
    const res = await saveSubmission({
      attemptId: activeAttempt.id,
      problemId: activeProblemId,
      classes: data.classes,
      relationships: data.relationships,
      explanation: data.explanation,
      optionalCode: data.optionalCode,
      status: 'DRAFT',
    });
    setActiveSubmission(res.submission);
    return res.submission;
  };

  const handleSubmitForEvaluation = async (data: {
    classes: any[];
    relationships: any[];
    explanation: string;
    optionalCode?: string;
    evaluatorStrategy: 'AI' | 'RULE_BASED' | 'AUTO';
    isStrict?: boolean;
  }) => {
    if (!activeAttempt) return;

    // Save draft / submitted state first
    const saveRes = await saveSubmission({
      attemptId: activeAttempt.id,
      problemId: activeProblemId,
      classes: data.classes,
      relationships: data.relationships,
      explanation: data.explanation,
      optionalCode: data.optionalCode,
      status: 'SUBMITTED',
    });
    setActiveSubmission(saveRes.submission);

    // Transition to status view
    setCurrentView('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Trigger evaluation - always strict evaluation
      const evaluation = await evaluateSubmission(saveRes.submission.id, data.evaluatorStrategy || 'AUTO', true);
      setActiveEvaluation(evaluation);

      // Fetch refreshed attempt and submission
      try {
        const refreshedAttempt = await fetchAttempt(activeAttempt.id);
        if (refreshedAttempt.submission) {
          setActiveSubmission(refreshedAttempt.submission);
        }
      } catch {
        setActiveSubmission(prev => (prev ? { ...prev, status: 'COMPLETED' } : null));
      }

      // Refresh attempts history
      const updatedHistory = await fetchHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      console.warn('Evaluation notice:', err?.message || err);
      // Fetch latest state if available
      try {
        const refreshedAttempt = await fetchAttempt(activeAttempt.id);
        if (refreshedAttempt.submission) {
          setActiveSubmission(refreshedAttempt.submission);
        }
      } catch (inner) {
        console.warn('Notice: Failed to fetch failed attempt status', inner);
      }
    }
  };

  const handleReEvaluateStrict = async (submissionId: string, isStrict: boolean = true) => {
    try {
      setLoading(true);
      const evalResult = await reEvaluateSubmission(submissionId, isStrict);
      setActiveEvaluation(evalResult);
      const updatedHistory = await fetchHistory();
      setHistory(updatedHistory);
      setCurrentView('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('Re-evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluationComplete = (submissionId: string) => {
    if (activeEvaluation) {
      setCurrentView('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleViewEvaluationFromHistory(submissionId);
    }
  };

  const handleRetryEvaluation = async (submissionId: string) => {
    try {
      setLoading(true);
      const evaluation = await evaluateSubmission(submissionId, 'AUTO');
      setActiveEvaluation(evaluation);
      if (activeAttempt) {
        try {
          const refreshed = await fetchAttempt(activeAttempt.id);
          if (refreshed.submission) {
            setActiveSubmission(refreshed.submission);
          }
        } catch (inner) {
          console.warn('Notice: Failed to refresh attempt after retry', inner);
        }
      }
      const updatedHistory = await fetchHistory();
      setHistory(updatedHistory);
      setCurrentView('report');
    } catch (err: any) {
      setGlobalError(err.message || 'Retry evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvaluationFromHistory = async (submissionId: string) => {
    try {
      setLoading(true);
      const evaluation = await fetchEvaluation(submissionId);
      setActiveEvaluation(evaluation);
      setActiveProblemId(evaluation.problemId);

      // Fetch attempt and submission details
      try {
        const attemptData = await fetchAttempt(evaluation.attemptId);
        setActiveAttempt(attemptData.attempt);
        setActiveSubmission(attemptData.submission);
      } catch (inner) {
        console.warn('Could not fetch attempt details for evaluation', inner);
      }

      setCurrentView('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('Notice: Failed to load evaluation report:', err?.message || err);
      setGlobalError('Evaluation report not found or still processing.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDemoEvaluation = () => {
    // Check if an existing completed attempt exists in history
    const completed = history.find(h => h.status === 'COMPLETED' && h.submissionId);
    if (completed && completed.submissionId) {
      handleViewEvaluationFromHistory(completed.submissionId);
    } else {
      // Jump to problems
      setCurrentView('problems');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo data back to default initial seed state?')) {
      await resetDatabaseSeeds();
      await loadData();
      setCurrentView('home');
    }
  };

  const activeProblem = problems.find(p => p.id === activeProblemId) || problems[0];

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
          {/* Subtle Ambient Light Gradients (Light SaaS) */}
          <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-50/60 via-slate-50/40 to-transparent rounded-full blur-[100px]" />
            <div className="absolute top-[30%] -left-36 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[120px]" />
            <div className="absolute top-[50%] -right-36 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[120px]" />
          </div>

          {/* Navigation Bar */}
          <Navbar
            currentTab={currentView}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onNavigate={(tab) => {
              setCurrentView(tab as ViewMode);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetData={handleResetData}
            onStartPracticeClick={() => {
              if (activeProblem) {
                handleStartPractice(activeProblem.id);
              } else {
                setCurrentView('problems');
              }
            }}
          />

          {/* Global Error Notice */}
          {globalError && (
            <div className="border-b border-rose-200 bg-rose-50 text-rose-800 text-xs py-2.5 px-4 text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{globalError}</span>
              <button
                onClick={() => setGlobalError(null)}
                className="text-rose-900 hover:underline ml-2 font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Main Content Area */}
          <main
            className={`flex-1 px-3 sm:px-6 lg:px-8 mx-auto w-full py-4 relative z-0 transition-all duration-300 ${
              isFullscreen ? 'max-w-none' : currentView === 'workspace' ? 'max-w-[1600px]' : 'max-w-7xl'
            }`}
          >
            {loading && !activeProblem ? (
              <div className="min-h-[55vh] flex flex-col items-center justify-center space-y-4 text-xs">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm animate-pulse">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-slate-800 font-semibold">Initializing LLD Mentor System...</p>
                  <p className="text-slate-500 text-[11px]">Loading problem benchmarks and domain schemas</p>
                </div>
              </div>
            ) : (
              <>
                {currentView === 'home' && (
                  <HomePage
                    problems={problems}
                    onSelectProblem={handleSelectProblem}
                    onNavigate={(view) => {
                      setCurrentView(view as ViewMode);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onViewDemoEvaluation={handleViewDemoEvaluation}
                  />
                )}

                {currentView === 'problems' && (
                  <ProblemsPage
                    problems={problems}
                    history={history}
                    onSelectProblem={handleSelectProblem}
                    onStartPractice={handleStartPractice}
                  />
                )}

                {currentView === 'problem-detail' && activeProblem && (
                  <ProblemDetailPage
                    problem={activeProblem}
                    history={history}
                    onBack={() => setCurrentView('problems')}
                    onStartPractice={handleStartPractice}
                    onViewEvaluation={handleViewEvaluationFromHistory}
                  />
                )}

                {currentView === 'workspace' && activeProblem && activeAttempt && (
                  <PracticeWorkspacePage
                    problem={activeProblem}
                    attemptId={activeAttempt.id}
                    attemptNumber={activeAttempt.attemptNumber}
                    initialSubmission={activeSubmission}
                    onBack={() => setCurrentView('problems')}
                    onSaveDraft={handleSaveDraft}
                    onSubmitForEvaluation={handleSubmitForEvaluation}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                  />
                )}

                {currentView === 'status' && activeProblem && activeAttempt && activeSubmission && (
                  <StatusPage
                    attempt={activeAttempt}
                    submission={activeSubmission}
                    problem={activeProblem}
                    onEvaluationComplete={handleEvaluationComplete}
                    onRetryEvaluation={handleRetryEvaluation}
                    onBackToWorkspace={() => setCurrentView('workspace')}
                  />
                )}

                {currentView === 'report' && activeProblem && activeEvaluation && (
                  <EvaluationReportPage
                    evaluation={activeEvaluation}
                    problem={activeProblem}
                    submission={activeSubmission}
                    allProblems={problems}
                    onTryAgain={(problemId, forceNew) => handleStartPractice(problemId, forceNew ?? true)}
                    onViewHistory={() => setCurrentView('history')}
                    onBackToProblems={() => setCurrentView('problems')}
                    onSelectProblem={handleSelectProblem}
                    onReEvaluateStrict={handleReEvaluateStrict}
                  />
                )}

                {currentView === 'history' && (
                  <HistoryPage
                    history={history}
                    problems={problems}
                    onViewEvaluation={handleViewEvaluationFromHistory}
                    onTryAgain={handleStartPractice}
                    onNavigateProblems={() => setCurrentView('problems')}
                  />
                )}

                {currentView === 'rubric' && <RubricDocsPage />}

                {currentView === 'login' && (
                  <LoginPage
                    onLoginSuccess={() => setCurrentView('home')}
                    onCancel={() => setCurrentView('home')}
                  />
                )}
              </>
            )}
          </main>

          {/* Global Footer (hidden during fullscreen workspace for distraction-free canvas) */}
          {(!isFullscreen || currentView !== 'workspace') && <Footer />}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
