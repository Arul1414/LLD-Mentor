# LLD Mentor – AI-Powered Low-Level Design Practice Platform

> A production-grade web application that helps software engineers and learners master Low-Level Design (LLD) through deliberate, repeated practice, deterministic pre-validation, and explainable rubric-based evaluations.

---

## 🚀 Key Features

- **Cyclical Learner Journey**:
  `Choose Problem` → `Read Requirements & Constraints` → `Start Practice` → `Design Solution (Classes, Relationships, Trade-offs, Optional Code)` → `Deterministic Pre-Validation` → `Persistence Prior to Evaluation` → `8-Dimension Rubric Evaluation` → `Explainable Evidence Citations` → `Review Attempt` → `Try Again (Progression Tracking)` → `Attempt History`.
- **MVP Problems**:
  1. **Parking Lot** (Medium) – Multi-tier spot allocation, ticket vouchers, rate strategies, concurrency protection.
  2. **Vending Machine** (Easy) – State Pattern lifecycle, inventory management, cash bank change calculation.
  3. **Elevator System** (Hard) – LOOK/SCAN dispatch algorithm, multiple cabins, hall vs cabin calls, door state invariants.
- **Dual-Engine Evaluation Architecture**:
  - **Deterministic Pre-Validator**: Validates class schemas, non-empty responsibilities, relationship validity, and explanation depth without hallucination.
  - **Explainable Evaluator**: Implements `Evaluator` interface via `EvaluatorFactory`. Uses Gemini 3.8 Flash with structured schema output when `GEMINI_API_KEY` is present, or gracefully falls back to deterministic `RuleBasedEvaluator`.
- **Zero Data Loss Guarantee**: Submissions are persisted in the database with status `SUBMITTED` / `EVALUATING` *before* the evaluation pipeline executes. If evaluation fails, the submission is preserved and can be retried.
- **8-Dimension Rubric**:
  1. *Requirement Understanding*
  2. *Class Responsibilities (SRP)*
  3. *Coupling / Cohesion*
  4. *Encapsulation / Interfaces*
  5. *Abstraction / Patterns*
  6. *Extensibility (OCP)*
  7. *Edge Cases / Concurrency*
  8. *Explanation Quality & Trade-offs*
- **Explainable Feedback**: Every criterion produces a score (1–10), concrete evidence cited directly from the user's design, architectural concerns, actionable suggestions, and a confidence meter.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, TypeScript, `@google/genai` SDK, Node Test Runner (`node:test`).
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Lucide Icons.
- **Architecture**: Domain-Driven Design (Domain Models, Validators, Evaluator Strategy Pattern, Repositories, Application Services).
- **Storage**: MongoDB-compatible persistent store with seed data initialization.

---

## 🏃 Running the Application

### 1. Installation
```bash
npm install
```

### 2. Running the Development Server
```bash
npm run dev
```
The server starts on `http://0.0.0.0:3000` with Express backend routes mounted alongside Vite frontend middleware.

### 3. Running Unit Tests
```bash
npm test
```
Executes the comprehensive suite of tests verifying:
1. Creating an attempt
2. Valid submission acceptance
3. Empty submission rejection
4. Submission status transitions (`DRAFT` → `SUBMITTED` → `EVALUATING` → `COMPLETED`)
5. `RuleBasedEvaluator` 8-dimension scoring & evidence generation
6. Evaluation failure handling & persistence guarantee
7. Attempt history tracking
8. Duplicate submission detection

---

## 📂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── models/           # Domain models: Problem, Submission, Attempt, Evaluation, User
│   │   │   ├── validators/       # SubmissionValidator (deterministic schema & semantic checks)
│   │   │   └── evaluators/       # Evaluator interface, RuleBasedEvaluator, AIEvaluator, EvaluatorFactory
│   │   ├── infrastructure/
│   │   │   ├── database/         # Database store & seedData (Parking Lot, Vending Machine, Elevator)
│   │   │   └── repositories/     # Problem, Attempt, Submission, Evaluation Repositories
│   │   ├── application/
│   │   │   └── services/         # ProblemService, PracticeService, EvaluationService
│   │   └── routes/               # Express REST API routes (/api/*)
│   └── tests/
│       └── lld-mentor.test.ts    # Node.js native unit tests covering all required behaviors
├── src/
│   ├── components/               # Navbar, Footer, ScoreGauge, RubricCriterionCard, ClassEditor, etc.
│   ├── pages/                    # Home, Problems, ProblemDetail, PracticeWorkspace, Status, Report, History, Rubric
│   ├── services/                 # Frontend API client
│   └── types/                    # Shared TypeScript interfaces
├── server.ts                     # Full-stack server entry point (Express + Vite)
├── RESEARCH.md                   # LLD domain analysis and rubric research
├── DESIGN.md                     # Architecture, state machines, and extensibility patterns
└── AI_USAGE.md                   # AI integration, prompt design, anti-hallucination, and fallback strategy
```
