import React from 'react';
import { ShieldCheck, Cpu, CheckCircle2, BookOpen, Layers, Terminal, Sparkles, Scale } from 'lucide-react';

export const RubricDocsPage: React.FC = () => {
  const rubricList = [
    {
      name: '1. Requirement Understanding',
      desc: 'Assesses whether all core functional requirements and physical constraints are satisfied by the proposed classes.',
      scoringCriteria: 'Scale 1-10: Identifies essential entities (e.g. ParkingSpots, Floors, Tickets, Elevators, Controllers) versus missing core requirements.',
      weight: '10%',
    },
    {
      name: '2. Class Responsibilities (SRP)',
      desc: 'Verifies Single Responsibility Principle. Checks if classes have clear, focused boundaries or if bloated god-classes exist.',
      scoringCriteria: 'Scale 1-10: Penalizes god-classes handling multiple distinct domain invariants simultaneously.',
      weight: '15%',
    },
    {
      name: '3. Coupling & Cohesion',
      desc: 'Examines the degree of dependency and relationships between classes (Composition, Aggregation, Association, Inheritance).',
      scoringCriteria: 'Scale 1-10: High cohesion within classes, loose coupling between components via explicit ownership.',
      weight: '15%',
    },
    {
      name: '4. Encapsulation & Interfaces',
      desc: 'Checks data hiding (private/protected attributes vs public getters/setters) and clear behavioral contracts.',
      scoringCriteria: 'Scale 1-10: Invariants must be protected by methods rather than direct attribute mutation.',
      weight: '10%',
    },
    {
      name: '5. Abstraction & Design Patterns',
      desc: 'Evaluates proper application of classic GoF patterns (Strategy, State, Factory, Observer) where appropriate.',
      scoringCriteria: 'Scale 1-10: Rewards idiomatic patterns (e.g. State Pattern for Vending Machine, Strategy for Parking Fee / Elevator Scheduling).',
      weight: '15%',
    },
    {
      name: '6. Extensibility (OCP)',
      desc: 'Measures how easily the system can support new vehicle types, payment methods, or elevator dispatch algorithms without rewriting core controllers.',
      scoringCriteria: 'Scale 1-10: Open for extension, closed for modification via polymorphism and interfaces.',
      weight: '10%',
    },
    {
      name: '7. Edge Cases & Concurrency',
      desc: 'Checks consideration for race conditions (e.g. two cars grabbing the last spot, multiple call requests), capacity limits, and error recovery.',
      scoringCriteria: 'Scale 1-10: Evaluates thread-safety mechanisms (synchronized, volatile, atomic operations, lock-free queues).',
      weight: '15%',
    },
    {
      name: '8. Explanation Quality & Trade-offs',
      desc: 'Evaluates the learner’s justification for architectural trade-offs, assumptions made, and why responsibilities were partitioned.',
      scoringCriteria: 'Scale 1-10: Depth and clarity of design rationale provided in the design explanation.',
      weight: '10%',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>EVALUATION SPECIFICATION &amp; ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          The 8-Dimension Evaluation Rubric
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          How our dual-engine architecture combines deterministic pre-validation with explainable rubric scoring to mentor engineering learners.
        </p>
      </div>

      {/* Two Pipeline Stages Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="saas-card p-6 sm:p-7 space-y-4 bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-xs uppercase tracking-wider">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Phase 1: Deterministic Pre-Validation</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Before running any AI or heuristic evaluation, submissions pass through a fast, non-AI validator to guarantee data completeness:
          </p>

          <ul className="text-xs text-slate-700 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>At least one non-empty class defined</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Every class has an explicit responsibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Explanation meets minimum 50-character depth</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Relationship targets connect valid classes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">⚡</span>
              <span>Safely persisted before invoking evaluators</span>
            </li>
          </ul>
        </div>

        <div className="saas-card p-6 sm:p-7 space-y-4 bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 text-blue-900 font-bold text-xs uppercase tracking-wider">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Cpu className="w-4 h-4" />
            </div>
            <span>Phase 2: Explainable Rubric Engine</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            The evaluation engine implements a standardized domain interface (<code className="text-blue-700 font-mono">Evaluator</code>) supporting:
          </p>

          <ul className="text-xs text-slate-700 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Gemini 3.8 Flash</strong>: Structured JSON Schema output</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Mandatory Citation</strong>: Quotes user's actual classes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Anti-Hallucination</strong>: Rejects fabricated methods</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Rule-Based Fallback</strong>: 100% deterministic offline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Confidence Meter</strong>: Calibrated reliability score</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Detailed Rubric Dimension List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rubric Dimensions Specification
          </h2>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            8 Total Criteria (100% Total Weight)
          </span>
        </div>

        <div className="space-y-3.5">
          {rubricList.map((item, idx) => (
            <div
              key={idx}
              className="saas-card p-5 space-y-2.5 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    Weight: {item.weight}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Scale 1–10 pts
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {item.desc}
              </p>

              <div className="text-[11px] text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-900 font-bold uppercase">Assessment Standard: </span>
                <span>{item.scoringCriteria}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
