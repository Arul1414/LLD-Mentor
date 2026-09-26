# LLD Mentor – AI Integration, Prompt Design & Evaluation Philosophy

## 1. The Role of AI in LLD Mentor

In LLD Mentor, Artificial Intelligence is **never** used as an open-ended conversational chatbot or unconstrained text generator. Instead, AI functions as a **structured evaluation and reasoning engine** within a strictly controlled pipeline:

1. **Deterministic Pre-Validation**: The AI model is never called on malformed, incomplete, or empty submissions.
2. **Schema Enforcement**: AI responses are validated against a rigid JSON Schema matching the 8-dimension rubric.
3. **Evidence-Grounded Output**: The model must quote direct identifiers, method signatures, or trade-off quotes from the submission.
4. **Graceful Fallback**: If the AI model is unreachable, rate-limited, or unconfigured, the system automatically falls back to the deterministic `RuleBasedEvaluator`.

---

## 2. Model Selection: Gemini 3.8 Flash

We use the Google Gen AI TypeScript SDK (`@google/genai`) with model **`gemini-2.5-flash`** for several reasons:
- **Low Latency**: Evaluations complete in ~1.5 to 2.5 seconds, providing rapid feedback in the learning loop.
- **Strict Structured JSON Support**: The model adheres to explicit JSON Schema parameters without outputting markdown wrappers or extraneous commentary.
- **Strong Reasoning on Object-Oriented Code**: High comprehension of GoF patterns, concurrency constructs, and SOLID violations.

---

## 3. Anti-Hallucination & Evidence Grounding

A fatal flaw in standard LLM feedback is claiming that a student "missed" something they actually implemented, or criticizing a class name that never existed in their code.

LLD Mentor enforces the following constraints in the model's system prompt:

```text
CRITICAL CITATION & EVIDENCE RULES:
1. Under "evidence", you MUST cite actual class names, method signatures, or specific quotes from the user's submission.
2. NEVER invent or hallucinate classes or methods that the user did not write.
3. If a concept is missing from the user's submission (e.g. concurrency handling), state: "No concurrency mechanism or synchronization was defined in the submitted classes or explanation."
4. Under "concern", identify subtle architectural smells, tight coupling, SRP violations, or missing invariants.
5. Under "suggestion", provide concrete, actionable advice on how to refactor the design.
```

---

## 4. Structured Output Schema

The evaluation response is constrained using `responseMimeType: 'application/json'` and `responseSchema`:

```typescript
{
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: 'Composite architectural score (1-100)' },
    criteria: {
      type: Type.ARRAY,
      description: 'Exactly 8 evaluations corresponding to the required rubric dimensions',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.INTEGER, description: 'Score between 1 and 10' },
          evidence: { type: Type.STRING, description: 'Direct citations from learner design' },
          concern: { type: Type.STRING, description: 'Architectural risk or smell' },
          suggestion: { type: Type.STRING, description: 'Concrete remediation advice' },
          confidence: { type: Type.NUMBER, description: 'Confidence between 0.0 and 1.0' }
        },
        required: ['name', 'score', 'evidence', 'concern', 'suggestion', 'confidence']
      }
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    priorityImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
    nextPracticeSuggestion: { type: Type.STRING }
  },
  required: ['overallScore', 'criteria', 'strengths', 'priorityImprovements', 'nextPracticeSuggestion']
}
```

---

## 5. Graceful Degradation & Fallback Strategy

The `EvaluatorFactory` checks for environment configuration:

```typescript
export class EvaluatorFactory {
  public static getEvaluator(strategy: EvaluatorStrategy = 'AUTO'): Evaluator {
    if (strategy === 'RULE_BASED') {
      return new RuleBasedEvaluator();
    }
    if (strategy === 'AI') {
      return new AIEvaluator();
    }
    // AUTO: Prefer AI if GEMINI_API_KEY is configured; otherwise fallback
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    return hasApiKey ? new AIEvaluator() : new RuleBasedEvaluator();
  }
}
```

Furthermore, inside `AIEvaluator.ts`, if any runtime API error or network exception occurs, it automatically falls back to `RuleBasedEvaluator` and logs the event, ensuring that **learner submissions are never stranded or failed due to external API outages**.

---

## 6. Security & Key Isolation

- The `GEMINI_API_KEY` is strictly accessed on the backend server (`server.ts` and `AIEvaluator.ts`).
- No client-side bundle or browser environment variable has access to the API key.
- All evaluation requests flow through the authenticated `/api/submissions/:id/evaluate` endpoint.
