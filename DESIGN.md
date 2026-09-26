# LLD Mentor – System Architecture & Software Design Specification

## 1. Architectural Philosophy

LLD Mentor is built on the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**:
- **Separation of Concerns**: Core domain rules have zero dependencies on frameworks, databases, or third-party AI SDKs.
- **Dependency Inversion**: High-level policy (Practice and Evaluation Services) depends on abstract interfaces (`IProblemRepository`, `ISubmissionRepository`, `Evaluator`), not concrete implementations.
- **Fault Tolerance**: Submissions are strictly persisted before triggering any downstream evaluation pipeline, guaranteeing zero data loss on crashes or timeouts.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│    React 19 SPA (Vite, Tailwind CSS, Lucide Components)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (Express Routes)
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Layer                        │
│   ProblemService  │  PracticeService  │  EvaluationService  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                      Domain Layer                           │
│  Entities: Problem, Submission, Attempt, Evaluation, User   │
│  Validators: SubmissionValidator (Deterministic)            │
│  Evaluators: Evaluator Interface, RuleBased, AIEvaluator    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Inversion of Control
┌──────────────────────────────▼──────────────────────────────┐
│                  Infrastructure Layer                       │
│  Repositories: MemoryMongo, Database, Gemini API Client     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Domain Models & Invariants

### 1. `Problem`
Represents an engineering challenge.
- **Attributes**: `id`, `slug`, `title`, `difficulty`, `description`, `functionalRequirements`, `constraints`, `assumptions`, `expectedDesignAreas`, `suggestedPatterns`.
- **Invariants**: Must contain at least 2 functional requirements and 1 constraint.

### 2. `Attempt`
Represents a learning session for a problem.
- **Attributes**: `id`, `attemptId`, `userId`, `problemId`, `submissionId`, `attemptNumber`, `status`, `score`, `createdAt`, `completedAt`.
- **Invariants**: `attemptNumber` is monotonically incremented per `(userId, problemId)` pair to visualize deliberate improvement over time.

### 3. `Submission`
The architectural design submitted by the learner.
- **Attributes**: `id`, `submissionId`, `attemptId`, `problemId`, `classes` (list of `ClassDesign`), `relationships` (list of `RelationshipDesign`), `explanation`, `optionalCode`, `status`, `validationErrors`, `failureReason`, `createdAt`, `updatedAt`.
- **Invariants**: Must pass deterministic validation before progressing to `EVALUATING`.

### 4. `Evaluation`
The explainable rubric assessment produced for a submission.
- **Attributes**: `id`, `submissionId`, `attemptId`, `problemId`, `overallScore` (0-100), `evaluatorType` (`RULE_BASED` | `AI_GEMINI` | `HUMAN_EXPERT`), `criteria` (8 criterion evaluations), `strengths`, `priorityImprovements`, `nextPracticeSuggestion`, `evaluatedAt`.
- **Invariants**: Every criterion must cite concrete `evidence` directly from the user's classes or explanation.

---

## 3. Submission Lifecycle & State Machine

The submission transitions through a strict finite state machine:

```
    ┌────────┐
    │  DRAFT │ ◄──┐ User edits design in workspace
    └───┬────┘    │
        │ User clicks Submit
        ▼
   [Deterministic Pre-Validation]
        │
        ├─► [Validation Failed] ──► Returns validation errors, remains in DRAFT
        │
        ▼ [Validation Passed]
 ┌──────────────┐
 │  SUBMITTED   │ (Persisted to database)
 └──────┬───────┘
        │
        ▼ (Transaction updates state before calling external evaluator)
 ┌──────────────┐
 │  EVALUATING  │ (Safely locked; submission cannot be lost)
 └──────┬───────┘
        │
        ├─────────────────────────────┐
        ▼ Evaluator Success           ▼ Evaluator Throws Error
 ┌──────────────┐              ┌──────────────┐
 │  COMPLETED   │              │    FAILED    │
 └──────────────┘              └──────┬───────┘
        │                             │
        │ View Report                 │ Retry with Rule-Based / AI
        ▼                             ▼
 [EvaluationReport]             [Retry Evaluation]
```

### Zero Data Loss Guarantee
1. When the learner clicks **Submit for Evaluation**, the payload is written to the repository with status `SUBMITTED`.
2. The `EvaluationService` updates the status to `EVALUATING` *before* invoking the `evaluator.evaluate()` method.
3. If an uncaught exception occurs (network timeout, API quota exhaustion, unparseable LLM output), the `catch` block updates the record to `FAILED` with `failureReason`, preserving all user classes, relationships, and code intact.
4. The learner can click **Retry Evaluation** or **Return to Workspace** without losing any work.

---

## 4. Extensibility & Design Patterns

### 1. Evaluator Strategy Pattern (`Evaluator` & `EvaluatorFactory`)
The platform decouples the evaluation logic through an interface:
```typescript
export interface Evaluator {
  evaluate(submission: Submission, problem: Problem): Promise<Evaluation>;
}
```
Implementations:
- `RuleBasedEvaluator`: Algorithmic heuristic engine.
- `AIEvaluator`: Google Gemini 3.8 Flash with structured JSON Schema output.
- `HumanExpertEvaluator` (Future extension): Queues submissions for human senior engineers or instructors to review asynchronously.

### 2. Extensibility for New Problems
To add a new problem (e.g. *Rate Limiter*, *Chess Game*, *BookMyShow*):
1. Simply add the domain definition to `seedData.ts` or database repository.
2. The workspace, validation engine, and 8-dimension rubric adapt dynamically with zero code changes required.

### 3. Extensibility for Diagram Visualizers & Code Generation
The structured submission format (`classes` + `relationships`) is an intermediate domain representation (IR). It can be directly piped into:
- Mermaid.js or PlantUML class diagram generators.
- Boilerplate Java/TypeScript code stub generators.
- Static analysis linters for cyclomatic complexity.
