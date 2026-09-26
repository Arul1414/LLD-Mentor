import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Problem, Submission, ClassDesign, RelationshipDesign } from '../types/index.js';
import { ClassEditor } from '../components/ClassEditor.js';
import { RelationshipEditor } from '../components/RelationshipEditor.js';
import { StructuredExplanationEditor } from '../components/StructuredExplanationEditor.js';
import { getProblemConfig } from '../config/problemConfigs.js';
import {
  ArrowLeft,
  Save,
  Send,
  Layers,
  Sliders,
  FileCode,
  Code2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Car,
  Coffee,
  Building2,
  Clock,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  Maximize2,
  Minimize2,
  GitFork,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Compass,
  Lightbulb,
} from 'lucide-react';

interface PracticeWorkspacePageProps {
  problem: Problem;
  attemptId: string;
  attemptNumber: number;
  initialSubmission: Submission | null;
  onBack: () => void;
  onSaveDraft: (data: {
    classes: ClassDesign[];
    relationships: RelationshipDesign[];
    explanation: string;
    optionalCode?: string;
  }) => Promise<any>;
  onSubmitForEvaluation: (data: {
    classes: ClassDesign[];
    relationships: RelationshipDesign[];
    explanation: string;
    optionalCode?: string;
    evaluatorStrategy: 'AI' | 'RULE_BASED' | 'AUTO';
    isStrict?: boolean;
  }) => Promise<void>;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

type WorkspaceTab = 'classes' | 'relationships' | 'explanation' | 'code';

export const PracticeWorkspacePage: React.FC<PracticeWorkspacePageProps> = ({
  problem,
  attemptId,
  attemptNumber,
  initialSubmission,
  onBack,
  onSaveDraft,
  onSubmitForEvaluation,
  isFullscreen,
  onToggleFullscreen,
}) => {
  // Resolve problem-specific configuration
  const problemConfig = useMemo(() => getProblemConfig(problem), [problem]);

  // Core learner design state
  const [classes, setClasses] = useState<ClassDesign[]>(initialSubmission?.classes || []);
  const [relationships, setRelationships] = useState<RelationshipDesign[]>(initialSubmission?.relationships || []);
  const [explanation, setExplanation] = useState<string>(initialSubmission?.explanation || '');
  const [optionalCode, setOptionalCode] = useState<string>(initialSubmission?.optionalCode || '');

  // UI state
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('classes');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showMobileBrief, setShowMobileBrief] = useState(false);

  // Dirty tracking & saved status
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // Sync if initial submission loads or refreshes
  useEffect(() => {
    if (initialSubmission && isInitialMount.current) {
      if (initialSubmission.classes && initialSubmission.classes.length > 0) {
        setClasses(initialSubmission.classes);
      }
      if (initialSubmission.relationships && initialSubmission.relationships.length > 0) {
        setRelationships(initialSubmission.relationships);
      }
      if (initialSubmission.explanation) {
        setExplanation(initialSubmission.explanation);
      }
      if (initialSubmission.optionalCode) {
        setOptionalCode(initialSubmission.optionalCode);
      }
      if (initialSubmission.updatedAt) {
        setLastSavedTime(new Date(initialSubmission.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
      isInitialMount.current = false;
    }
  }, [initialSubmission]);

  // Mark dirty on changes after initial mount
  const handleClassesChange = (newClasses: ClassDesign[]) => {
    setClasses(newClasses);
    setIsDirty(true);
  };

  const handleRelationshipsChange = (newRelationships: RelationshipDesign[]) => {
    setRelationships(newRelationships);
    setIsDirty(true);
  };

  const handleExplanationChange = (newExplanation: string) => {
    setExplanation(newExplanation);
    setIsDirty(true);
  };

  const handleCodeChange = (newCode: string) => {
    setOptionalCode(newCode);
    setIsDirty(true);
  };

  // Dynamic Problem Icon
  const getProblemIcon = () => {
    const s = problem.slug.toLowerCase();
    if (s.includes('parking')) return <Car className="w-5 h-5 text-blue-600" />;
    if (s.includes('vending')) return <Coffee className="w-5 h-5 text-amber-600" />;
    return <Building2 className="w-5 h-5 text-indigo-600" />;
  };

  // Estimated Time
  const estimatedTime = useMemo(() => {
    if (problem.estimatedTime) return problem.estimatedTime;
    const s = problem.slug.toLowerCase();
    if (s.includes('parking')) return '30 min';
    if (s.includes('vending')) return '25 min';
    return '45 min';
  }, [problem]);

  // Dynamic Summary Metrics
  const summaryMetrics = useMemo(() => {
    const classCount = classes.length;
    const relCount = relationships.length;
    const attrCount = classes.reduce((acc, c) => acc + (c.attributes?.length || 0), 0);
    const methodCount = classes.reduce((acc, c) => acc + (c.methods?.length || 0), 0);
    const isExplComplete = explanation.trim().length >= 40;
    const hasCode = optionalCode.trim().length > 0;

    return {
      classes: classCount,
      relationships: relCount,
      attributes: attrCount,
      methods: methodCount,
      explanationStatus: isExplComplete ? 'Complete' : 'Incomplete',
      codeStatus: hasCode ? 'Added' : 'Optional',
    };
  }, [classes, relationships, explanation, optionalCode]);

  // Problem-specific architectural invariants for reference
  const architecturalCheckpoints = useMemo(() => {
    const s = problem.slug.toLowerCase();
    if (s.includes('parking')) {
      return [
        {
          title: 'Decoupled Pricing Strategy',
          desc: 'Use the Strategy Pattern for hourly, vehicle-type, or surge fee calculation without altering the ParkingLot coordinator.',
          tag: 'Strategy Pattern',
        },
        {
          title: 'Thread-Safe Spot Allocation',
          desc: 'Guard parking spot assignments against race conditions when multiple entry gates allocate spots simultaneously.',
          tag: 'Concurrency',
        },
        {
          title: 'Independent Ticket Lifecycle',
          desc: 'Track entry timestamp, vehicle reference, and payment settlement independently from physical spot occupancy.',
          tag: 'Lifecycle',
        },
      ];
    }
    if (s.includes('vending')) {
      return [
        {
          title: 'Explicit State Machine',
          desc: 'Model states (Idle, HasMoney, Dispensing, SoldOut) using the State Pattern to prevent invalid transition actions.',
          tag: 'State Pattern',
        },
        {
          title: 'Atomic Dispense & Payment',
          desc: 'Ensure inventory decrement and balance capture occur atomically; rollback safely if canceled or coins jammed.',
          tag: 'Atomicity',
        },
        {
          title: 'Change Return & Validation',
          desc: 'Decouple cash/card payment handlers from product slots, validating machine change balance before accepting cash.',
          tag: 'Payment',
        },
      ];
    }
    return [
      {
        title: 'Dispatch Scheduling Strategy',
        desc: 'Decouple request scheduling algorithms (LOOK / SCAN / FCFS) from physical elevator car movement mechanics.',
        tag: 'Strategy Pattern',
      },
      {
        title: 'Door Motion Safety Invariant',
        desc: 'Strictly enforce safety invariants: doors must remain locked while the elevator is moving between floors.',
        tag: 'Safety Guard',
      },
      {
        title: 'Unified Request Arbitration',
        desc: 'Combine internal cabin floor selections and external hall calls into an efficient, prioritized dispatch queue.',
        tag: 'Arbitration',
      },
    ];
  }, [problem.slug]);

  // Deterministic Validation Engine (Generic Checks + Problem-Specific Behavioral Guidance)
  const validationResults = useMemo(() => {
    const checks: {
      id: string;
      label: string;
      status: 'PASSED' | 'WARNING' | 'FAILED';
      detail?: string;
    }[] = [];
    const blockingErrors: string[] = [];

    // 1. Problem selected
    checks.push({
      id: 'problem_selected',
      label: 'Problem selected',
      status: problem ? 'PASSED' : 'FAILED',
    });

    // 2. At least one class exists
    if (classes.length === 0) {
      checks.push({
        id: 'class_exists',
        label: 'At least one class exists',
        status: 'FAILED',
        detail: 'Define at least one domain class',
      });
      blockingErrors.push('Define at least one class in your design.');
    } else {
      checks.push({
        id: 'class_exists',
        label: `${classes.length} class${classes.length > 1 ? 'es' : ''} created`,
        status: 'PASSED',
      });
    }

    // 3. Every class has a name
    const unnamedClasses = classes.filter(c => !c.name || !c.name.trim());
    if (unnamedClasses.length > 0) {
      checks.push({
        id: 'class_names',
        label: 'Every class has a name',
        status: 'FAILED',
        detail: `${unnamedClasses.length} unnamed class${unnamedClasses.length > 1 ? 'es' : ''}`,
      });
      blockingErrors.push(`Provide a name for all classes (${unnamedClasses.length} unnamed).`);
    } else if (classes.length > 0) {
      checks.push({
        id: 'class_names',
        label: 'All classes named',
        status: 'PASSED',
      });
    }

    // 4. Every class has responsibility
    const missingResponsibility = classes.filter(c => !c.responsibility || c.responsibility.trim().length < 8);
    if (classes.length > 0 && missingResponsibility.length > 0) {
      checks.push({
        id: 'class_resp',
        label: 'Every class has responsibility',
        status: 'FAILED',
        detail: `Missing for ${missingResponsibility.map(c => c.name || 'unnamed').join(', ')}`,
      });
      missingResponsibility.forEach(c => {
        blockingErrors.push(`Add responsibility for "${c.name || 'unnamed class'}" (min 8 chars).`);
      });
    } else if (classes.length > 0) {
      checks.push({
        id: 'class_resp',
        label: 'Responsibilities defined',
        status: 'PASSED',
      });
    }

    // 5. Classes have methods or attributes
    const emptyClasses = classes.filter(c => (!c.attributes || c.attributes.length === 0) && (!c.methods || c.methods.length === 0));
    if (classes.length > 0 && emptyClasses.length > 0) {
      checks.push({
        id: 'class_members',
        label: 'Classes have methods or attributes',
        status: 'WARNING',
        detail: `${emptyClasses.map(c => c.name || 'unnamed').join(', ')} has no members`,
      });
    } else if (classes.length > 0) {
      checks.push({
        id: 'class_members',
        label: 'Classes have attributes & methods',
        status: 'PASSED',
      });
    }

    // 6. Relationships are valid
    if (classes.length > 1 && relationships.length === 0) {
      checks.push({
        id: 'rel_valid',
        label: 'Add at least one relationship',
        status: 'WARNING',
        detail: 'Connecting classes demonstrates coupling & cohesion',
      });
    } else if (relationships.length > 0) {
      const invalidRel = relationships.find(r => !r.sourceClass || !r.targetClass);
      if (invalidRel) {
        checks.push({
          id: 'rel_valid',
          label: 'Relationships are valid',
          status: 'FAILED',
          detail: 'Source or target class missing',
        });
        blockingErrors.push('Ensure all relationships specify both source and target classes.');
      } else {
        checks.push({
          id: 'rel_valid',
          label: `${relationships.length} relationship${relationships.length > 1 ? 's' : ''} defined`,
          status: 'PASSED',
        });
      }
    } else {
      checks.push({
        id: 'rel_valid',
        label: 'Relationships valid',
        status: 'PASSED',
      });
    }

    // 7. Design explanation exists
    if (!explanation || explanation.trim().length < 25) {
      checks.push({
        id: 'explanation_check',
        label: 'Design explanation exists',
        status: 'FAILED',
        detail: 'Minimum 25 characters required',
      });
      blockingErrors.push('Complete the design explanation explaining your architectural decisions.');
    } else {
      checks.push({
        id: 'explanation_check',
        label: 'Explanation provided',
        status: 'PASSED',
      });
    }

    // 8. Problem-Specific Domain Checks (Guidance/Warnings - Non-blocking)
    if (classes.length > 0) {
      const classSummaries = classes.map(c => ({
        name: c.name || '',
        methods: c.methods || [],
        attributes: c.attributes || [],
      }));

      problemConfig.domainValidationRules.behaviors.forEach((b, idx) => {
        const passes = b.check(classSummaries);
        checks.push({
          id: `domain_check_${idx}`,
          label: b.name,
          status: passes ? 'PASSED' : 'WARNING',
          detail: passes ? 'Domain concept recognized in design' : b.hint,
        });
      });
    }

    const canSubmit = blockingErrors.length === 0 && classes.length > 0;

    return {
      checks,
      blockingErrors,
      canSubmit,
    };
  }, [problem, classes, relationships, explanation, problemConfig]);

  // Save Draft Action
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSaveDraft({
        classes,
        relationships,
        explanation,
        optionalCode,
      });
      setIsDirty(false);
      setLastSavedTime('just now');
    } catch (err: any) {
      console.warn('Draft save notice:', err?.message || err);
    } finally {
      setIsSaving(false);
    }
  };

  // Open submit confirmation modal or alert validation errors
  const handleInitiateSubmit = () => {
    if (!validationResults.canSubmit) {
      setActiveTab('classes');
      return;
    }
    setShowSubmitModal(true);
  };

  // Confirmed Submission - automatically applies strict evaluation
  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false);
    try {
      setIsSubmitting(true);
      await onSubmitForEvaluation({
        classes,
        relationships,
        explanation,
        optionalCode,
        evaluatorStrategy: 'AUTO',
        isStrict: true,
      });
    } catch (err: any) {
      console.warn('Submission notice:', err?.message || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* ====================================================
          1 & 2. TOP WORKSPACE HEADER BAR
         ==================================================== */}
      <header className="saas-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 shadow-2xs rounded-2xl">
        {/* Left: Back + Problem Meta */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Problem Selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              {getProblemIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {problem.title}
                </h1>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                    problem.difficulty === 'EASY'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : problem.difficulty === 'HARD'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Attempt #{attemptNumber}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span>{problem.functionalRequirements.length} Requirements</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {estimatedTime}
                </span>
                {lastSavedTime && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Saved {lastSavedTime}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions (Fullscreen, Save Draft, Submit) */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>
          )}

          {/* Toggle Brief for Mobile */}
          <button
            type="button"
            onClick={() => setShowMobileBrief(!showMobileBrief)}
            className="lg:hidden px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Brief</span>
            {showMobileBrief ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Save className={`w-3.5 h-3.5 ${isDirty ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>{isSaving ? 'Saving...' : isDirty ? 'Save Draft*' : 'Draft Saved'}</span>
          </button>

          {/* Submit For Evaluation Button */}
          <button
            type="button"
            onClick={handleInitiateSubmit}
            disabled={!validationResults.canSubmit || isSubmitting}
            title={
              !validationResults.canSubmit
                ? `Fix issues to enable evaluation (${validationResults.blockingErrors[0] || 'Incomplete'})`
                : 'Submit your LLD attempt for rigorous multi-evaluator scoring'
            }
            className={`btn-primary-glow px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              !validationResults.canSubmit ? 'opacity-85' : 'cursor-pointer'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Attempt →'}</span>
          </button>
        </div>
      </header>

      {/* ====================================================
          3-COLUMN RESPONSIVE WORKSPACE LAYOUT
          LEFT (260-300px): Problem Brief
          CENTER (1fr, min 500px): Design Workspace Canvas
          RIGHT (280-320px): Validation + Design Summary
         ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,300px)_minmax(500px,1fr)_minmax(280px,320px)] gap-5 items-start">
        {/* ====================================================
            LEFT PANEL — PROBLEM BRIEF
           ==================================================== */}
        <aside
          className={`w-full lg:sticky lg:top-4 self-start space-y-4 ${
            showMobileBrief ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-2xs max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                PROBLEM BRIEF
              </h2>
              <span className="text-[10px] font-mono text-slate-400">LLD Specs</span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
                Overview
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {problem.description || problem.shortDescription}
              </p>
            </div>

            {/* Functional Requirements */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center justify-between">
                <span>Functional Requirements</span>
                <span className="text-[10px] text-indigo-700 font-mono">
                  {problem.functionalRequirements.length}
                </span>
              </div>
              <ul className="space-y-2">
                {problem.functionalRequirements.map((req, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/70 font-sans"
                  >
                    <span className="font-mono text-indigo-600 font-bold text-[11px] shrink-0 mt-0.5">
                      R{i + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assumptions & Edge Cases */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono">
                Assumptions &amp; Scope
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {problem.assumptions && problem.assumptions.length > 0 ? (
                  problem.assumptions.map((asm, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed font-sans">
                      <span className="text-slate-400 shrink-0">•</span>
                      <span>{asm}</span>
                    </li>
                  ))
                ) : (
                  <li className="italic text-slate-400">Standard single-instance in-memory concurrency model.</li>
                )}
              </ul>
            </div>

            {/* Constraints */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono">
                Key Constraints
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {problem.constraints && problem.constraints.length > 0 ? (
                  problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed font-sans">
                      <span className="text-slate-400 shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))
                ) : (
                  <li className="italic text-slate-400">Thread-safe concurrent spot allocation.</li>
                )}
              </ul>
            </div>
          </div>
        </aside>

        {/* ====================================================
            CENTER CANVAS — TABS (Classes, Relationships, Explanation, Code)
           ==================================================== */}
        <main className="w-full min-w-0 space-y-4">
          <div className="saas-card bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
            {/* Tab Navigation Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-2 bg-slate-50/50">
              <div className="flex items-center gap-1 overflow-x-auto py-1 text-xs">
                {/* Classes Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('classes')}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'classes'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Classes</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
                    {classes.length}
                  </span>
                </button>

                {/* Relationships Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('relationships')}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'relationships'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GitFork className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Relationships</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
                    {relationships.length}
                  </span>
                </button>

                {/* Explanation Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('explanation')}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'explanation'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>Explanation</span>
                  {explanation.trim().length >= 40 && (
                    <Check className="w-3 h-3 text-emerald-600" />
                  )}
                </button>

                {/* Code Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Code (Optional)</span>
                  {optionalCode.trim().length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-6 min-h-0 h-auto">
              {/* TAB 1: CLASSES */}
              {activeTab === 'classes' && (
                <ClassEditor classes={classes} onChange={handleClassesChange} problem={problem} />
              )}

              {/* TAB 2: RELATIONSHIPS */}
              {activeTab === 'relationships' && (
                <RelationshipEditor
                  relationships={relationships}
                  classes={classes}
                  onChange={handleRelationshipsChange}
                  problem={problem}
                />
              )}

              {/* TAB 3: EXPLANATION */}
              {activeTab === 'explanation' && (
                <StructuredExplanationEditor
                  value={explanation}
                  onChange={handleExplanationChange}
                  problem={problem}
                />
              )}

              {/* TAB 4: CODE */}
              {activeTab === 'code' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                        OPTIONAL JAVA IMPLEMENTATION ({problemConfig.title})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        You may optionally write key Java methods, class skeletons, or concurrency algorithms.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Optional
                    </span>
                  </div>
                  <textarea
                    rows={16}
                    value={optionalCode}
                    onChange={e => handleCodeChange(e.target.value)}
                    placeholder={problemConfig.codeStarter}
                    className="w-full p-4 rounded-xl saas-input text-xs font-mono leading-relaxed bg-slate-50/50"
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ====================================================
            RIGHT PANEL — DESIGN VALIDATION & SUMMARY
           ==================================================== */}
        <aside className="w-full lg:sticky lg:top-4 self-start space-y-4">
          {/* DESIGN CHECK PANEL */}
          <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                DESIGN CHECK
              </h2>
              <span className="text-[10px] font-mono font-bold text-slate-400">Deterministic</span>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {validationResults.checks.map(check => {
                const isPassed = check.status === 'PASSED';
                const isWarning = check.status === 'WARNING';

                return (
                  <div
                    key={check.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-colors ${
                      isPassed
                        ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                        : isWarning
                        ? 'bg-amber-50/60 border-amber-200/80 text-amber-900'
                        : 'bg-rose-50/60 border-rose-200/80 text-rose-900'
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{check.label}</div>
                      {check.detail && (
                        <div className="text-[11px] opacity-80 mt-0.5 leading-snug">
                          {check.detail}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Blocking issues list if cannot submit */}
            {validationResults.blockingErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Cannot submit yet. Please fix:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-2 text-[11px] text-rose-800">
                  {validationResults.blockingErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* DESIGN SUMMARY PANEL */}
          <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-800">
                DESIGN SUMMARY
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Live Metrics</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-500">Classes</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {summaryMetrics.classes}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-500">Relationships</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {summaryMetrics.relationships}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-500">Attributes</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {summaryMetrics.attributes}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-500">Methods</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {summaryMetrics.methods}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-500">Explanation</div>
                <div
                  className={`text-xs font-bold font-mono mt-1 ${
                    summaryMetrics.explanationStatus === 'Complete' ? 'text-emerald-700' : 'text-amber-600'
                  }`}
                >
                  {summaryMetrics.explanationStatus}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-500">Code</div>
                <div className="text-xs font-bold font-mono text-slate-700 mt-1">
                  {summaryMetrics.codeStatus}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ====================================================
          PRACTICE WORKSPACE BOTTOM ACTION & STATUS DOCK
         ==================================================== */}
      <div className="saas-card p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Attempt #{attemptNumber}
            </span>
            <span className="font-semibold text-slate-800">{problem.title}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            <span>{summaryMetrics.classes} Classes</span>
            <span>·</span>
            <span>{summaryMetrics.relationships} Relationships</span>
            <span>·</span>
            <span>{summaryMetrics.attributes} Attributes</span>
            <span>·</span>
            <span>{summaryMetrics.methods} Methods</span>
            <span>·</span>
            <span
              className={
                summaryMetrics.explanationStatus === 'Complete'
                  ? 'text-emerald-700 font-bold'
                  : 'text-amber-600 font-medium'
              }
            >
              {summaryMetrics.explanationStatus === 'Complete'
                ? 'Explanation Ready'
                : 'Explanation Needed'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Back to Problems
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Save className={`w-3.5 h-3.5 ${isDirty ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>{isSaving ? 'Saving...' : isDirty ? 'Save Draft*' : 'Draft Saved'}</span>
          </button>
          <button
            type="button"
            onClick={handleInitiateSubmit}
            disabled={!validationResults.canSubmit || isSubmitting}
            title={
              !validationResults.canSubmit
                ? `Fix issues to enable evaluation (${validationResults.blockingErrors[0] || 'Incomplete'})`
                : 'Submit your LLD attempt for rubric evaluation'
            }
            className={`btn-primary-glow px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              !validationResults.canSubmit ? 'opacity-85' : 'cursor-pointer'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Attempt →'}</span>
          </button>
        </div>
      </div>

      {/* ====================================================
          PRACTICE WORKBENCH ARCHITECTURAL COMPANION & RUBRIC GUIDE
         ==================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>ARCHITECTURAL REFERENCE &amp; EVALUATION CRITERIA</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Essential design invariants, rubric expectations, and modeling principles for {problemConfig.title}
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dual-Engine Review Benchmark</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Problem Invariants */}
          <div className="saas-card p-5 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Problem Invariants</span>
              </h4>
              <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-bold">
                {problemConfig.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Critical architectural checkpoints expected in high-scoring implementations:
            </p>
            <div className="space-y-2.5">
              {architecturalCheckpoints.map((cp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">{cp.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                      {cp.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{cp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: 8 Rubric Dimensions Overview */}
          <div className="saas-card p-5 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rubric Scoring Pillars</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">8 Dimensions</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every attempt is graded against eight standardized LLD dimensions:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {[
                { name: 'Cohesion (SRP)', desc: 'Single clear purpose' },
                { name: 'Coupling', desc: 'Appropriate relations' },
                { name: 'Spec Coverage', desc: 'All R1-RN requirements' },
                { name: 'Encapsulation', desc: 'Data hiding & typing' },
                { name: 'Concurrency', desc: 'Thread-safety guards' },
                { name: 'Extensibility', desc: 'Open-Closed design' },
                { name: 'Trade-Offs', desc: 'Explicit justification' },
                { name: 'Clean Code', desc: 'Idiomatic signatures' },
              ].map((dim, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-50/70 border border-slate-200/60">
                  <div className="font-semibold text-slate-800">{dim.name}</div>
                  <div className="text-[10px] text-slate-500">{dim.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Best Practice Modeling Guidelines */}
          <div className="saas-card p-5 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Modeling Best Practices</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Interview Tips</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Techniques to produce resilient, interview-ready domain models:
            </p>
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50/70 border border-slate-200/60">
                <span className="font-mono text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                <span>
                  <strong className="text-slate-800">Identify core entities first:</strong> Map candidate domain classes ({problemConfig.classExamples.slice(0, 3).map(c => c.name).join(', ')}) before adding helper utilities.
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50/70 border border-slate-200/60">
                <span className="font-mono text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                <span>
                  <strong className="text-slate-800">Favor Composition:</strong> Use composition when child lifecycle is strictly tied to parent (e.g. slots in vending machine, floors in parking lot).
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50/70 border border-slate-200/60">
                <span className="font-mono text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                <span>
                  <strong className="text-slate-800">Detail trade-offs:</strong> Use the Explanation tab to document why alternative designs were rejected; this directly boosts your rubric score.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SUBMIT CONFIRMATION MODAL
         ==================================================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="saas-card max-w-md w-full p-6 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-3">
                <Send className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Submit LLD Attempt for Review?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Your low-level design for <span className="font-semibold text-slate-800">{problem.title}</span> will be evaluated across the 8-dimension rubric citing concrete evidence from your model.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-700">
                <span>Problem:</span>
                <span className="font-bold">{problem.title}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Classes to evaluate:</span>
                <span className="font-bold">{classes.length}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Relationships:</span>
                <span className="font-bold">{relationships.length}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Explanation:</span>
                <span className="font-bold">{explanation.length} characters</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="btn-primary-glow px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Evaluating...' : 'Confirm Submission'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
