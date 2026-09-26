import React from 'react';
import { Problem } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Brain,
  Bot,
  ChartNoAxesCombined,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  FileSearch,
  CheckCircle,
  GitBranch,
  Clock,
  Car,
  Coffee,
  ArrowUpDown,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';

interface HomePageProps {
  problems: Problem[];
  onSelectProblem: (problemId: string) => void;
  onNavigate: (tab: string, param?: string) => void;
  onViewDemoEvaluation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  problems,
  onSelectProblem,
  onNavigate,
  onViewDemoEvaluation,
}) => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section - Pure White with Subtle Indigo/Cyan Accents */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 lg:p-14 shadow-sm">
        {/* Subtle Ambient Radial Glows (Light & Clean) */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-50/70 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>LLD MENTOR · AI-POWERED LLD PRACTICE</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Design Better. <br />
                <span className="text-indigo-600">
                  Think Deeper.
                </span> <br />
                <span className="text-slate-800">Build Smarter.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Interactive Low-Level Design practice for engineering interviews.
                Submit structured classes and relationships, pass deterministic validation, and receive explainable AI evaluations grounded in verified evidence.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('problems')}
                className="btn-primary-glow px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 group cursor-pointer shadow-sm"
              >
                <span>Start Practicing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('problems')}
                className="btn-secondary px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Explore Problems</span>
              </button>

              <button
                onClick={onViewDemoEvaluation}
                className="px-4 py-3.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileSearch className="w-4 h-4 text-slate-400" />
                <span>View Sample Review (84%) →</span>
              </button>
            </div>

            {/* Quick Proof Metrics */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs font-medium text-slate-500">
              <div>
                <div className="text-lg font-bold text-slate-900 font-mono">3 Curated</div>
                <div>Industry Benchmarks</div>
              </div>
              <div>
                <div className="text-lg font-bold text-indigo-600 font-mono">8 Rubrics</div>
                <div>Evaluation Dimensions</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-600 font-mono">100%</div>
                <div>Evidence-Backed Citations</div>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Interactive Class Diagram Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md bg-slate-50/70 p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
              {/* Diagram Node 1 */}
              <div className="bg-white rounded-xl p-3.5 border border-blue-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="font-mono font-bold text-xs text-slate-900">class ParkingLot</span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Core Controller
                  </span>
                </div>
                <div className="pt-2 font-mono text-[11px] text-slate-600 space-y-1">
                  <div>+ parkVehicle(v: Vehicle): Ticket</div>
                  <div>+ vacateSpot(t: Ticket): Receipt</div>
                </div>
              </div>

              {/* Connecting Line Indicator */}
              <div className="flex items-center justify-center -my-1 text-slate-400">
                <div className="flex items-center gap-2 text-[10px] font-mono font-semibold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  <GitBranch className="w-3 h-3 text-cyan-600" />
                  <span className="text-slate-600">Composition 1..*</span>
                </div>
              </div>

              {/* Diagram Node 2 */}
              <div className="bg-white rounded-xl p-3.5 border border-cyan-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span className="font-mono font-bold text-xs text-slate-900">class ParkingFloor</span>
                  </div>
                  <span className="text-[10px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">
                    Capacity Domain
                  </span>
                </div>
                <div className="pt-2 font-mono text-[11px] text-slate-600 space-y-1">
                  <div>- spots: List&lt;ParkingSpot&gt;</div>
                  <div>+ findAvailableSpot(type): Spot</div>
                </div>
              </div>

              {/* AI Verification Badge */}
              <div className="p-2.5 rounded-xl bg-indigo-50/90 border border-indigo-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-medium">
                  <Bot className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Rubric Validation: Invariants Enforced</span>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                  9.2 / 10
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Learner Dashboard Summary Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user ? user.name.split(' ')[0] : 'Learner'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Continue your Low-Level Design journey with structured practice.
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Colorful SaaS Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Blue - Problems Attempted */}
          <div className="saas-card p-5 border-l-4 border-l-blue-500 bg-white">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Problems Attempted
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              3 / 3
            </div>
            <div className="text-xs text-blue-600 font-medium mt-1">
              100% catalog coverage
            </div>
          </div>

          {/* Card 2: Green - Completed Evaluations */}
          <div className="saas-card p-5 border-l-4 border-l-emerald-500 bg-white">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Completed Drills
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              4
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              Evaluated &amp; critiqued
            </div>
          </div>

          {/* Card 3: Violet - Average Score */}
          <div className="saas-card p-5 border-l-4 border-l-violet-500 bg-white">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Average Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              82<span className="text-base text-slate-400 font-normal">%</span>
            </div>
            <div className="text-xs text-violet-600 font-medium mt-1">
              +14% gain across attempts
            </div>
          </div>

          {/* Card 4: Orange - Practice Streak */}
          <div className="saas-card p-5 border-l-4 border-l-amber-500 bg-white">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Practice Streak
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {user ? user.streakDays : 7} <span className="text-base text-slate-400 font-normal">days</span>
            </div>
            <div className="text-xs text-amber-600 font-medium mt-1">
              Active daily momentum
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem Benchmarks with Unique Color Accents */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
              CURATED BENCHMARKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
              Standard Machine Coding Challenges
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Each problem card is tailored with core functional requirements and expected design patterns.
            </p>
          </div>

          <button
            onClick={() => onNavigate('problems')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Problems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map(problem => {
            const isParking = problem.slug.includes('parking');
            const isVending = problem.slug.includes('vending');
            const isElevator = problem.slug.includes('elevator');

            // Unique color styling per prompt specification
            let iconBg = 'bg-blue-50 text-blue-600 border-blue-200/80';
            let cardBorder = 'border-slate-200 hover:border-blue-300';
            let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200/70';
            let buttonStyle = 'bg-blue-600 hover:bg-blue-700 text-white';
            let IconComponent = Car;

            if (isParking) {
              iconBg = 'bg-blue-50 text-blue-600 border-blue-200/80';
              cardBorder = 'border-slate-200 hover:border-blue-400';
              badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
              buttonStyle = 'bg-blue-600 hover:bg-blue-700 text-white';
              IconComponent = Car;
            } else if (isVending) {
              iconBg = 'bg-amber-50 text-amber-600 border-amber-200/80';
              cardBorder = 'border-slate-200 hover:border-amber-400';
              badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
              buttonStyle = 'bg-amber-600 hover:bg-amber-700 text-white';
              IconComponent = Coffee;
            } else if (isElevator) {
              iconBg = 'bg-emerald-50 text-emerald-600 border-emerald-200/80';
              cardBorder = 'border-slate-200 hover:border-emerald-400';
              badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              buttonStyle = 'bg-emerald-600 hover:bg-emerald-700 text-white';
              IconComponent = ArrowUpDown;
            }

            return (
              <div
                key={problem.id}
                className={`saas-card saas-card-hover p-6 flex flex-col justify-between space-y-5 bg-white border ${cardBorder}`}
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-2xs ${iconBg}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${badgeStyle}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        30m
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5 line-clamp-3">
                      {problem.shortDescription}
                    </p>
                  </div>

                  {/* Suggested Patterns */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Architectural Patterns
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(problem.suggestedPatterns || ['Strategy Pattern', 'State Pattern']).map((pat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-700"
                        >
                          {pat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => onSelectProblem(problem.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${buttonStyle}`}
                >
                  <span>Start Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Core Value Prop / Educational Methodology */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            THE DELIBERATE PRACTICE METHOD
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How LLD Mentor Coaches Senior System Design
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Traditional interview prep relies on passive reading or memorized code. LLD Mentor engages your architectural decision-making.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Blue */}
          <div className="saas-card saas-card-hover p-6 sm:p-7 space-y-3.5 bg-white border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. Structured Model IR
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Design like an architect: define cohesive classes, explicit relationships (Aggregation, Composition, Inheritance), and state management invariants in an IDE workspace.
            </p>
          </div>

          {/* Pillar 2: Violet */}
          <div className="saas-card saas-card-hover p-6 sm:p-7 space-y-3.5 bg-white border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. Evidence-Backed Evaluation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No generic chatbot praise. Our dual-engine evaluates 8 standardized dimensions, directly quoting your submitted class names, method signatures, and concurrency guards.
            </p>
          </div>

          {/* Pillar 3: Emerald */}
          <div className="saas-card saas-card-hover p-6 sm:p-7 space-y-3.5 bg-white border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
              <ChartNoAxesCombined className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. Measurable Improvement
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drill iteratively. View side-by-side progression between attempts to see how single responsibility and open-closed principles improve your score from 60% to 85%+.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
