🤖 AI Usage — LLD Mentor

<p align="center">

<img src="https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white">
<img src="https://img.shields.io/badge/AI%20Evaluation-Evidence%20Grounded-4285F4?style=for-the-badge">
<img src="https://img.shields.io/badge/Architecture-Hybrid-00A98F?style=for-the-badge">
<img src="https://img.shields.io/badge/Fallback-Rule--Based-F59E0B?style=for-the-badge">

</p>

<p align="center">

<strong>Artificial Intelligence Usage & Evaluation Architecture</strong>

<br>

<sub>
How AI is used, controlled, evaluated, and integrated inside LLD Mentor
</sub>

</p>

[!NOTE]
LLD Mentor uses Artificial Intelligence as an evaluation assistant for reviewing learner-submitted Low-Level Design solutions.

AI is not used as the sole source of truth. Deterministic validation, persistence, structured evaluation, and rule-based fallback remain independent parts of the system.

🌌 01 — Overview

LLD Mentor uses Artificial Intelligence as an evaluation assistant for reviewing learner-submitted Low-Level Design solutions.

The goal is not to replace deterministic validation with AI.

Instead, the system combines three complementary layers:

┌─────────────────────────────────────────────┐
│        🧱 DETERMINISTIC VALIDATION          │
│                                             │
│   Structural rules • Invariants • Checks    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│            🤖 AI-ASSISTED EVALUATION        │
│                                             │
│   Reasoning • Design Quality • Feedback     │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             🛡️ RULE-BASED FALLBACK          │
│                                             │
│      Reliability when AI is unavailable    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             💡 EXPLAINABLE FEEDBACK         │
│                                             │
│       Evidence • Score • Suggestions       │
└─────────────────────────────────────────────┘

This hybrid approach allows the platform to use AI where qualitative reasoning is valuable while keeping structural validation deterministic and predictable.

🎯 02 — Why AI Is Used

Low-Level Design evaluation involves both structural correctness and design reasoning.

🧱 Deterministic Validation

Some aspects can be checked deterministically:

Required classes

Non-empty responsibilities

Relationship validity

Required structural elements

Domain constraints

🧠 Higher-Level Design Reasoning

Some aspects require higher-level reasoning:

Whether responsibilities are well distributed

Whether abstractions are appropriate

Whether coupling is unnecessarily high

Whether a design is extensible

Whether the selected pattern is justified

Whether trade-offs are clearly explained

Whether edge cases have been considered

AI is therefore used primarily for qualitative design reasoning rather than basic structural validation.

🏗️ 03 — AI Architecture

<p align="center">

                         👨‍💻 LEARNER DESIGN
                                │
                                ▼
                  ┌──────────────────────────┐
                  │ 🔍 DETERMINISTIC         │
                  │    PRE-VALIDATOR         │
                  └────────────┬─────────────┘
                               │
                         Valid Design
                               │
                               ▼
                  ┌──────────────────────────┐
                  │ 💾 PERSIST SUBMISSION    │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │ 🏭 EVALUATOR FACTORY     │
                  └────────────┬─────────────┘
                               │
                     ┌─────────┴─────────┐
                     │                   │
                     ▼                   ▼
          ┌──────────────────┐  ┌──────────────────┐
          │ 🤖 AI EVALUATOR  │  │ 📋 RULE-BASED    │
          │    Gemini API    │  │    EVALUATOR     │
          └────────┬─────────┘  └────────┬─────────┘
                   │                     │
                   └──────────┬──────────┘
                              ▼
                  ┌──────────────────────────┐
                  │ 📊 STRUCTURED            │
                  │    EVALUATION RESULT     │
                  └────────────┬─────────────┘
                               ▼
                  ┌──────────────────────────┐
                  │ 🔎 Evidence + Score +    │
                  │    Suggestions           │
                  └──────────────────────────┘

</p>

🔄 Architecture Philosophy

                    LLD Mentor
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
  🧱 Predictable               🤖 Reasoning
     Rules                       AI
          │                         │
          └────────────┬────────────┘
                       ▼
               💡 Better Feedback

The AI component is intentionally isolated behind an evaluation abstraction so that the platform can maintain flexibility and reliability.

🤖 04 — AI Technology

<p align="center">

<img src="https://img.shields.io/badge/Google-Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white">
<img src="https://img.shields.io/badge/SDK-%40google%2Fgenai-4285F4?style=for-the-badge">
<img src="https://img.shields.io/badge/API-Generative%20AI-34A853?style=for-the-badge">

</p>

The AI evaluator uses the Google Gemini API through:

@google/genai

🧠 Configured Evaluation Model

Gemini 3.8 Flash

The AI evaluator is implemented behind an Evaluator abstraction so that the application does not directly depend on a specific AI provider.

🔌 Technology Boundary

Application
     │
     ▼
Evaluator Abstraction
     │
     ▼
AIEvaluator
     │
     ▼
@google/genai
     │
     ▼
Gemini API

This separation makes it easier to introduce or replace evaluation strategies in the future.

📊 05 — What the AI Evaluates

The AI evaluator reviews the learner's submitted design against the platform's eight evaluation dimensions.

#

Dimension

AI Evaluation Focus

01

📋 Requirement Understanding

Whether the design addresses the stated requirements

02

🧩 Class Responsibilities

Responsibility distribution and SRP

03

🔗 Coupling / Cohesion

Dependency structure and class cohesion

04

🔐 Encapsulation / Interfaces

Abstraction boundaries and interface usage

05

🏗️ Abstraction / Patterns

Quality and appropriateness of abstractions

06

🚀 Extensibility

Ability to accommodate future changes

07

⚡ Edge Cases / Concurrency

Handling of unusual cases and concurrent operations

08

💬 Explanation Quality & Trade-offs

Clarity of reasoning and design decisions

🎯 Evaluation Output

Each dimension can produce:

┌─────────────────────────────┐
│ 📊 SCORE                    │
├─────────────────────────────┤
│ 🔎 EVIDENCE                 │
├─────────────────────────────┤
│ ⚠️ ARCHITECTURAL CONCERN    │
├─────────────────────────────┤
│ 💡 SUGGESTION               │
├─────────────────────────────┤
│ 🎯 CONFIDENCE               │
└─────────────────────────────┘

🔎 06 — Evidence-Grounded Evaluation

A key design requirement is that AI feedback should be connected to the learner's actual submission.

Instead of producing only generic statements such as:

"The design has high coupling."

The evaluator is designed to ground feedback in submitted design elements such as:

🏷️ Class Names
       +
⚙️ Method Signatures
       +
📦 Responsibilities
       +
🔗 Relationships
       +
🧠 Design Decisions

💡 Why Evidence Matters

Evidence-grounded evaluation makes the feedback more useful for learning because the learner can identify which part of their design led to the feedback.

Learner Design
      │
      ├── Class
      ├── Method
      ├── Responsibility
      └── Relationship
              │
              ▼
       🤖 AI Analysis
              │
              ▼
       🔎 Evidence
              │
              ▼
       💡 Feedback

🔄 07 — AI Evaluation Flow

The complete evaluation workflow is:

01 ── 👨‍💻 Learner creates a design
          │
          ▼
02 ── 📤 Design is submitted
          │
          ▼
03 ── 🔍 Deterministic validation
          │
          ▼
04 ── 💾 Submission is persisted
          │
          ▼
05 ── ⚙️ Evaluation begins
          │
          ▼
06 ── 🏭 EvaluatorFactory selects evaluator
          │
          ▼
07 ── 🤖 Gemini evaluates the design
          │
          ▼
08 ── 📊 Structured evaluation is generated
          │
          ▼
09 ── 💾 Evaluation is stored
          │
          ▼
10 ── 🎓 Learner reviews feedback

🔁 End-to-End Learning Loop

        PRACTICE
           │
           ▼
       SUBMIT DESIGN
           │
           ▼
       VALIDATE
           │
           ▼
        EVALUATE
           │
           ▼
      RECEIVE FEEDBACK
           │
           ▼
         REVIEW
           │
           ▼
         IMPROVE
           │
           └──────────────► PRACTICE

🛡️ 08 — Why Deterministic Validation Comes First

AI is not responsible for basic structural validation.

The platform first checks whether the submission satisfies required structural conditions.

🔍 Examples

Required design elements are present

Classes contain meaningful responsibilities

Relationships are structurally valid

Required explanations are provided

Submission content is not empty

This creates a clear separation:

┌──────────────────────────┐
│ STRUCTURAL VALIDATION    │
│           ↓              │
│     DETERMINISTIC        │
└──────────────────────────┘

and:

┌──────────────────────────┐
│ DESIGN REASONING         │
│           ↓              │
│      AI-ASSISTED         │
└──────────────────────────┘

🎯 Result

This separation:

Reduces unnecessary AI calls

Keeps basic validation predictable

Separates rules from reasoning

Makes failure handling easier

Improves system reliability

🎯 09 — Evaluator Strategy

The application uses the Strategy Pattern through the Evaluator interface.

                    Evaluator
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
        🤖 AIEvaluator    📋 RuleBasedEvaluator

The application therefore does not need to know the internal implementation of each evaluator.

🧩 Strategy Pattern Benefit

Practice Workflow
       │
       ▼
  Evaluator Interface
       │
   ┌───┴────┐
   ▼        ▼
  AI      Rules

This makes it possible to introduce additional evaluation strategies in the future without rewriting the main practice workflow.

🏭 10 — Evaluator Factory

EvaluatorFactory is responsible for selecting the evaluation strategy.

Supported Modes

🤖 AI
📋 RULE_BASED
⚡ AUTO

🤖 AI Mode

Uses the Gemini-based evaluator.

AI
 │
 ▼
AIEvaluator
 │
 ▼
Gemini API

📋 RULE_BASED Mode

Uses deterministic evaluation logic.

RULE_BASED
     │
     ▼
RuleBasedEvaluator
     │
     ▼
Deterministic Rules

⚡ AUTO Mode

Automatically selects the available evaluation mechanism and provides a fallback when AI evaluation cannot be used.

                         AUTO
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
       Gemini Available       Gemini Unavailable
                │                   │
                ▼                   ▼
         🤖 AI Evaluator      📋 Rule-Based

🔄 AUTO Principle

AI Available?
     │
 ┌───┴───┐
YES      NO
 │        │
 ▼        ▼
AI      Rules

🚨 11 — AI Failure Handling

LLD Mentor does not assume that an external AI service will always be available.

Possible causes of AI evaluation failure include:

Failure Category

Example

🔑 Authentication

Missing API key

🌐 External API

External API failure

⏱️ Service

Temporary service failure

📦 Response

Invalid AI response

📡 Network

Network-related problems

⚠️ Runtime

Unexpected evaluation errors

🛡️ Reliability Principle

AI failure should not remove the learner's submitted work.

Learner Submission
       │
       ▼
    Persisted
       │
       ▼
 AI Evaluation
       │
   ┌───┴────┐
   │        │
Success   Failure
   │        │
   ▼        ▼
Result    Retry /
          Fallback

💾 12 — Persistence Before AI Evaluation

One of the most important reliability decisions is:

The submission is persisted before evaluation begins.

Submission Lifecycle

        ┌─────────┐
        │  DRAFT  │
        └────┬────┘
             │
             ▼
       ┌───────────┐
       │ SUBMITTED │
       └─────┬─────┘
             │
             ▼
       ┌────────────┐
       │ EVALUATING │
       └─────┬──────┘
             │
             ▼
       ┌───────────┐
       │ COMPLETED │
       └───────────┘

If AI evaluation fails:

┌────────────┐
│ SUBMITTED  │
└─────▲──────┘
      │
      │ Evaluation Failure
      │
      └─────── 🔄 Retry

🎯 Reliability Outcome

The learner's design remains available even when the external AI evaluation step fails.

🔁 13 — Rule-Based Fallback

The rule-based evaluator provides deterministic evaluation when AI evaluation is unavailable.

It focuses on:

Structural validation

Domain-specific validation

Deterministic evaluation logic

It does not attempt to imitate the full reasoning capability of the AI evaluator.

Two Complementary Evaluation Layers

Layer

Purpose

🧱 Deterministic Evaluator

Structural and invariant validation

🤖 AI Evaluator

Qualitative design reasoning

🛡️ Fallback Philosophy

The fallback is a reliability mechanism, not a replacement for AI reasoning.

              Evaluation
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
       AI Path         Rule Path
          │                 │
          └────────┬────────┘
                   ▼
             Evaluation

📊 14 — Structured AI Output

The AI evaluator is designed to return structured evaluation information rather than an unrestricted block of text.

Conceptual Structure

Evaluation
│
├── 📊 Overall Result
│
├── 🎯 Criterion 1
│   ├── Score
│   ├── Evidence
│   ├── Concern
│   └── Suggestion
│
├── 🎯 Criterion 2
│   ├── Score
│   ├── Evidence
│   ├── Concern
│   └── Suggestion
│
├── 🎯 ...
│
└── 🎯 Confidence

🧩 Why Structured Output?

Structured output allows the frontend to display evaluation results consistently.

AI Response
     │
     ▼
Structured Data
     │
     ├── Score
     ├── Evidence
     ├── Concern
     ├── Suggestion
     └── Confidence
             │
             ▼
       Frontend UI

🛠️ 15 — AI-Assisted Development

AI tools were also used during development as a productivity and reasoning aid.

Potential development uses included:

Exploring implementation approaches

Reviewing architecture ideas

Generating development suggestions

Refining documentation

Assisting with debugging

Improving code organization

Exploring test cases

Reviewing design trade-offs

However, generated suggestions were treated as development assistance, not as automatically trusted implementation.

The final implementation decisions were integrated into the project's architecture and requirements.

👨‍💻 16 — Human Responsibility

AI-generated suggestions are not treated as authoritative software-engineering decisions.

The developer remains responsible for:

        Requirements
             │
             ▼
         Architecture
             │
             ▼
        Implementation
             │
             ▼
           Testing
             │
             ▼
         Validation
             │
             ▼
        Final Decision

🧠 Human-in-the-Loop

              🤖 AI
               │
               ▼
          Suggestions
               │
               ▼
       👨‍💻 Human Review
               │
               ▼
       Engineering Decision

AI is used as an assistant within this workflow.

⚠️ 17 — AI Limitations

AI evaluation has inherent limitations.

🧠 17.1 — Reasoning Limitations

An AI model may misunderstand:

Complex design intent

Implicit requirements

Unusual architectural decisions

Context not explicitly represented in the submission

Complex Context
      │
      ▼
 AI Interpretation
      │
      ▼
Possible Misinterpretation

🎲 17.2 — Evaluation Variability

AI-generated feedback may not always be perfectly deterministic.

Two evaluations of similar designs can potentially differ in wording or interpretation.

Therefore:

AI feedback should be treated as engineering guidance, not as an absolute correctness proof.

🌐 17.3 — External Dependency

The AI evaluator depends on an external Gemini API.

Possible issues include:

┌─────────────────────┐
│ API Availability    │
├─────────────────────┤
│ API Errors          │
├─────────────────────┤
│ Network Problems    │
├─────────────────────┤
│ Rate Limits         │
├─────────────────────┤
│ Authentication      │
└─────────────────────┘

The rule-based evaluator provides an alternative evaluation path.

👨‍🏫 17.4 — No Replacement for Human Review

AI evaluation does not replace:

Senior engineer review

Interviewer feedback

Production architecture review

Human judgment

Real-world system constraints

LLD Mentor is intended primarily as a practice and feedback tool.

🛡️ 18 — Responsible AI Considerations

LLD Mentor follows a simple principle:

Use AI where reasoning assistance provides value, while keeping predictable checks deterministic.

The architecture therefore avoids making the complete application dependent on an AI response.

                    LLD Mentor
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
   🧱 Deterministic         🤖 AI-Assisted
      Validation              Reasoning
             │                   │
             └─────────┬─────────┘
                       ▼
                 💡 Better Feedback

Responsible AI Principles

Deterministic Where Possible
            +
AI Where Reasoning Helps
            +
Human Review
            +
Graceful Failure
            ↓
Responsible AI Integration

🔐 19 — API Key Handling

The Gemini API key is expected to be supplied through an environment variable:

GEMINI_API_KEY=your_api_key

🔒 Recommended Practice

.env
 │
 ▼
Environment Variable
 │
 ▼
Backend
 │
 ▼
Gemini API

🚫 Security Rules

Do not commit API keys to source control.

Do not place the API key directly inside frontend source code.

Keep secrets outside the application source.

Use environment variables for backend configuration.

Never place the API key directly inside frontend source code.

🚫 20 — What AI Does NOT Do

LLD Mentor does not use AI for every part of the system.

AI is not required for:

Basic application routing

Repository operations

Submission persistence

Structural validation

Attempt state management

Duplicate submission detection

Basic domain invariants

These responsibilities remain deterministic.

🧱 Deterministic Responsibilities

Routing
   │
Repository
   │
Persistence
   │
Validation
   │
State Management
   │
Domain Invariants
   ▼
DETERMINISTIC

📋 21 — AI Usage Summary

Area

AI Used?

Reason

🧠 LLD Design Evaluation

✅

Qualitative reasoning

🔎 Evidence-Based Feedback

✅

Explain learner decisions

📊 Rubric Evaluation

✅

Evaluate design quality

🧱 Basic Structural Validation

❌

Deterministic rules are sufficient

💾 Persistence

❌

Must remain predictable

📦 Repository Operations

❌

Standard application logic

🔄 Attempt State Management

❌

Deterministic workflow

🛡️ Fallback Evaluation

❌

Rule-based reliability mechanism

📝 Documentation Assistance

✅

Development productivity

🏗️ Architecture Exploration

✅

Development assistance

💎 22 — Key AI Design Principles

LLD Mentor follows five main principles.

01 — 🤖 AI as an Evaluator

AI assists with qualitative design analysis.

Design
  ↓
AI Reasoning
  ↓
Evaluation

02 — 🧱 Deterministic First

Structural validation happens before AI evaluation.

Submission
    ↓
Validation
    ↓
AI Evaluation

03 — 🔎 Evidence Over Generic Feedback

Evaluation should reference actual submitted design elements.

Class
  +
Method
  +
Responsibility
  +
Relationship
  ↓
Evidence-Based Feedback

04 — 💾 Persistence Before Evaluation

Learner work is stored before external AI processing.

Submit
  ↓
Persist
  ↓
Evaluate

05 — 🛡️ Graceful Fallback

AI failure should not destroy the practice workflow.

AI Available
    │
    ├── YES ──► AI Evaluation
    │
    └── NO ───► Rule-Based Evaluation

🌐 23 — Final Architecture Principle

The central philosophy behind AI usage in LLD Mentor is:

                         🤖 AI
                          │
                 ┌────────┴────────┐
                 │                 │
                 ▼                 ▼
          🧠 Qualitative      💡 Explainable
             Reasoning           Feedback
                 │                 │
                 └────────┬────────┘
                          ▼
                  👨‍🎓 Human Learning Loop
                          │
                          ▼
                  Practice → Review
                          │
                          ▼
                        Improve

LLD Mentor is therefore designed not as an AI-only application, but as an engineering practice platform where AI is one component of a larger deterministic and explainable evaluation system.

🏁 24 — Conclusion

AI is used in LLD Mentor where it provides meaningful value:

Reasoning about software design quality and producing evidence-grounded feedback.

Deterministic validation, persistence, state management, and fallback evaluation remain independent of the AI service.

This separation provides a practical balance between:

🤖 AI Reasoning
       +
🧱 Deterministic Engineering
       +
💾 Reliable Persistence
       +
🔎 Explainable Feedback
       ↓
🎓 Human Learning

✨ The LLD Mentor AI Loop

                👨‍💻 PRACTICE
                     │
                     ▼
               📐 DESIGN
                     │
                     ▼
               🔍 VALIDATE
                     │
                     ▼
               💾 PERSIST
                     │
                     ▼
                🤖 EVALUATE
                     │
             ┌───────┴───────┐
             │               │
             ▼               ▼
          Gemini          Rule-Based
             │               │
             └───────┬───────┘
                     ▼
              🔎 EVIDENCE
                     │
                     ▼
              💡 FEEDBACK
                     │
                     ▼
               🎓 REVIEW
                     │
                     ▼
                🚀 IMPROVE
                     │
                     └──────────────► PRACTICE

<p align="center">

<strong>🧠 Practice. Evaluate. Understand. Improve.</strong>

<br><br>

<img src="https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white">
<img src="https://img.shields.io/badge/Engineering-Deterministic-00A98F?style=for-the-badge">
<img src="https://img.shields.io/badge/Feedback-Explainable-4285F4?style=for-the-badge">
<img src="https://img.shields.io/badge/Fallback-Reliable-F59E0B?style=for-the-badge">

<br><br>

<sub>
LLD Mentor — AI-assisted software design practice and evaluation
</sub>

</p>

<p align="center">
<strong>Built with 🤖 AI + 🧱 Engineering + 🎓 Human Learning</strong>
</p>
