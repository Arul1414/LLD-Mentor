# LLD Mentor – Architectural Research & Domain Analysis

## 1. Executive Summary & Problem Space

Low-Level Design (LLD), also known as Object-Oriented Design (OOD) or Machine Coding, is a staple of technical evaluations at leading engineering organizations (FAANG, tier-1 tech, fintech). Unlike High-Level Design (HLD) which deals with distributed systems and databases, or LeetCode algorithmic problems that feature binary test cases, LLD evaluates:
1. **Domain Modeling**: Translating ambiguous real-world requirements into coherent class boundaries.
2. **SOLID Principles**: Adhering to Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
3. **Behavioral Invariants**: Protecting internal state through encapsulation rather than exposing mutable data structures.
4. **Design Patterns**: Applying proven GoF patterns (Strategy, State, Factory, Observer) where warranted without premature over-engineering.
5. **Concurrency & Thread Safety**: Defending against race conditions and deadlocks in shared mutable environments.

### The Learning Bottleneck
Learners struggle with LLD because **feedback loops do not exist**:
- LeetCode gives immediate green/red compiler test results.
- LLD has no standard compiler for "good design". A program can compile and pass functional tests while possessing terrible, unmaintainable architecture (e.g., a 1,000-line God class with public mutable fields).
- Peer reviews and mock interviews are expensive, non-standardized, and infrequent.

---

## 2. Common Candidate Anti-Patterns in LLD

Based on empirical analysis of hiring assignment submissions and interview debriefs, candidate submissions typically suffer from five recurring anti-patterns:

| Anti-Pattern | Description | Typical Failure in Practice |
| :--- | :--- | :--- |
| **The God Object** | Concentrating all business logic, state mutations, and I/O inside a single controller (e.g., `ParkingLotManager`). | Classes become tightly coupled, impossible to unit test in isolation, and violate SRP. |
| **Anemic Domain Model** | Classes only have getters/setters with zero behavioral logic; all invariants are evaluated externally by procedural service functions. | Loss of encapsulation; internal state invariants can be bypassed arbitrarily. |
| **Primitive Obsession** | Using raw strings and integers for rich concepts (e.g. `String spotType = "LARGE"` instead of typed enums or value objects). | Fragile validation, typos causing runtime failures, lack of compile-time guarantees. |
| **Monolithic Control Flow (Missing Patterns)** | Handling state lifecycles with deeply nested `switch/case` or `if/else` ladders (e.g., in Vending Machine). | Violates OCP; adding a new state requires modifying existing stable code. |
| **Concurrency Blindness** | Ignoring race conditions when multiple physical agents interact concurrently (e.g., two entry gates assigning the same parking spot). | Data corruption, double-booking, and catastrophic failures in multi-threaded runtimes. |

---

## 3. Why Naive AI Evaluation Fails

When developers attempt to use general-purpose LLMs (e.g., simple ChatGPT prompts) to grade LLD solutions, the results are notoriously unreliable:
1. **The "Compliment Sandwich" Bias**: LLMs default to polite affirmations ("Great job! Your design is clean.") even when critical race conditions or God objects are present.
2. **Hallucinated Evidence**: LLMs frequently critique classes or methods that the learner never wrote, eroding user trust.
3. **Inconsistent Scoring**: The exact same submission graded twice might receive a 45/100 and then an 85/100 due to non-deterministic temperature and vague evaluation rubrics.
4. **Lack of Actionable Remediation**: Giving advice like "make it more modular" without explaining *how* to refactor the specific relationship.

---

## 4. The 8-Dimension Evaluation Rubric

To solve this, LLD Mentor establishes an objective, evidence-based rubric consisting of 8 orthogonal dimensions:

```
                                  [ Architectural Evaluation ]
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         ▼                  ▼                   ▼                   ▼                  ▼
1. Requirements     2. SRP / Cohesion   3. Coupling & Ownership   4. Encapsulation   5. Patterns
         ▼                  ▼                   ▼                   ▼                  ▼
6. Extensibility    7. Concurrency      8. Explanation & Trade-offs
```

### Rubric Dimensions Breakdown

1. **Requirement Understanding (Weight: 10%)**:
   - Assesses whether the model accounts for all functional requirements and physical constraints.
2. **Class Responsibilities & SRP (Weight: 15%)**:
   - Verifies each class has a singular, cohesive purpose. Detects God objects.
3. **Coupling & Cohesion (Weight: 15%)**:
   - Checks relationship types. Promotes composition over inheritance; demands aggregation for shared references.
4. **Encapsulation & Interface Contracts (Weight: 10%)**:
   - Verifies data hiding (private/protected attributes) and meaningful domain methods instead of anemic property bags.
5. **Abstraction & Design Patterns (Weight: 15%)**:
   - Verifies appropriate pattern usage (Strategy for algorithms, State for lifecycles, Factory for polymorphic creation).
6. **Extensibility & Open-Closed Principle (Weight: 10%)**:
   - Tests whether new features can be added via polymorphism without mutating core controllers.
7. **Edge Cases & Concurrency (Weight: 15%)**:
   - Evaluates thread safety (synchronized blocks, lock-free queues, idempotency, atomic operations).
8. **Explanation Quality & Trade-offs (Weight: 10%)**:
   - Evaluates the depth of the learner's justification: why certain decisions were made over alternatives.

---

## 5. Dual-Engine Architecture: Heuristic vs. AI

LLD Mentor employs a hybrid architecture:

| Aspect | Deterministic Rule-Based Engine | Gemini 3.8 Flash AI Engine |
| :--- | :--- | :--- |
| **Speed** | Instantaneous (< 5ms) | Low latency (~1.5s - 2.5s) |
| **Reliability** | 100% deterministic, offline capable | Requires network & API credentials |
| **Semantic Nuance** | Keyword and structure heuristics | Deep architectural reasoning and natural language synthesis |
| **Anti-Hallucination** | Strictly based on AST/form data | Controlled via JSON Schema & Mandatory Citation Prompting |
| **Role in Platform** | Baseline evaluation, offline fallback, unit tests | Primary intelligent mentor when online |

By decoupling evaluation through an `Evaluator` interface, the platform switches seamlessly between engines without touching application or UI layers.
