import { GoogleGenAI, Type } from '@google/genai';
import { Evaluator, EvaluatorOptions } from './Evaluator.js';
import { Submission } from '../models/Submission.js';
import { Problem } from '../models/Problem.js';
import { Evaluation, EvaluationCriterionResult, RUBRIC_DIMENSIONS } from '../models/Evaluation.js';
import { RuleBasedEvaluator } from './RuleBasedEvaluator.js';

export class AIEvaluator implements Evaluator {
  public readonly id = 'ai-gemini-evaluator';
  public readonly name = 'Gemini AI Evaluator';
  private fallbackEvaluator = new RuleBasedEvaluator();

  public async evaluate(
    submission: Submission,
    problem: Problem,
    options?: EvaluatorOptions
  ): Promise<Evaluation> {
    const isStrict = options?.isStrict ?? true;
    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful fallback if no Gemini API key is configured in environment
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.warn('[AIEvaluator] No valid GEMINI_API_KEY detected. Utilizing deterministic RuleBasedEvaluator.');
      const fallbackResult = await this.fallbackEvaluator.evaluate(submission, problem, options);
      return {
        ...fallbackResult,
        evaluatorType: 'RULE_BASED',
        isStrict,
        evaluationMode: isStrict ? 'STRICT' : 'STANDARD',
      };
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          timeout: 10000,
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const submissionSummary = {
        problemTitle: problem.title,
        problemSlug: problem.slug,
        classes: submission.classes.map(c => ({
          name: c.name,
          type: c.type || 'Class',
          responsibility: c.responsibility,
          attributes: c.attributes,
          methods: c.methods,
        })),
        relationships: submission.relationships.map(r => ({
          source: r.sourceClass,
          target: r.targetClass,
          relationship: r.relationship,
          reason: r.reason,
        })),
        explanation: submission.explanation,
        optionalCode: submission.optionalCode || '(No code provided)',
      };

      const systemInstruction = `You are a Low-Level Design (LLD) Mentor conducting an objective learning review of an engineering design attempt.
Your role is to rigorously and constructively evaluate the candidate's LLD submission against an established 8-dimension rubric specifically for the SELECTED problem.

CRITICAL RULES:
1. PROBLEM-AWARE EVALUATION: Evaluate ONLY against the specific selected problem (${problem.title}). Do NOT assume or expect classes from other problems (e.g. do not expect ParkingLot classes when evaluating Vending Machine, or VendingMachine classes when evaluating Elevator System).
2. OBJECTIVE LEARNING FEEDBACK: Provide realistic, objective educational guidance. Distinguish clearly: Score, Evidence, Concern, Suggested Improvement. Do NOT use inflated certification language like "Production Ready", "Enterprise Ready", "Industry Standard", or "Perfect Architecture".
3. SUBMISSION-GROUNDED EVIDENCE: Never invent evidence. Every "evidence" string MUST explicitly cite, quote, or point directly to classes, attributes, methods, relationships, or explanation text from the candidate's actual submission.
4. SCOPE-AWARE SCORING: If the learner has submitted only a few classes, score reflects only the submitted design scope.
5. Score each criterion between 1 and 10 based on standard Object-Oriented Design principles (SOLID, cohesion, coupling, domain boundaries).
6. Evaluate EXACTLY these 8 criteria in this order:
   - "Requirement Understanding"
   - "Class Responsibilities"
   - "Coupling / Cohesion"
   - "Encapsulation / Interfaces"
   - "Abstraction / Design Patterns"
   - "Extensibility"
   - "Edge Cases / Testability"
   - "Explanation Quality"
7. Compute an overallScore between 0 and 100 reflecting the design evaluation score.
8. Provide 2-3 key strengths and 2-3 priority actionable improvements.
9. Provide a concise nextPracticeSuggestion suggesting another problem to practice next (e.g., "Continue with another LLD problem such as Vending Machine to practice state-based design.").
${isStrict ? `10. STRICT SENIOR/STAFF BAR EVALUATION (STRICT MODE ACTIVE):
- Grade with uncompromising rigor equivalent to a Tier-1 tech company Senior/Staff LLD interview.
- Do NOT award scores >= 8 casually. A score of 8 or above requires explicit, concrete proof in the submission.
- Scrutinize domain completeness: If fewer than 3 classes are defined, overallScore MUST NOT exceed 50, and Requirement Understanding must not exceed 5.
- Scrutinize concurrency and race conditions: If the system lacks explicit locks, synchronization, atomic variables, or thread-safety guards, cap "Edge Cases / Testability" at 4-5.
- Scrutinize God classes and cohesion: If a class mixes coordination with entity state or storage, penalize "Class Responsibilities" (4-6 max).
- Scrutinize Encapsulation: If attributes lack explicit private access modifiers or if methods expose raw mutable state, penalize "Encapsulation / Interfaces" (4-6 max).
- Scrutinize Design Patterns: If no recognized behavioral or structural design pattern is applied to handle variability, cap "Abstraction / Design Patterns" at 4-5.
- Scrutinize Explanation: If the candidate does not articulate alternative designs, assumptions, and scalability trade-offs, penalize "Explanation Quality" (4-5 max).` : ''}`;

      const prompt = `Selected Problem: ${problem.title} (Slug: ${problem.slug})
Difficulty: ${problem.difficulty}
Problem Description: ${problem.description}
${isStrict ? 'Evaluation Bar: STRICT SENIOR / STAFF INTERVIEW (Heavily penalize missing domain classes, lack of concurrency, God classes, and absent design patterns)\n' : ''}
Functional Requirements to satisfy:
${problem.functionalRequirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Constraints & Assumptions:
${[...problem.constraints, ...problem.assumptions].map((c, i) => `${i + 1}. ${c}`).join('\n')}

Learner's Actual Submitted LLD Design:
${JSON.stringify(submissionSummary, null, 2)}

Please evaluate this submission ${isStrict ? 'STRICTLY and RIGOROUSLY' : 'constructively'} against ${problem.title} and return the structured JSON evaluation adhering to the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: {
                type: Type.INTEGER,
                description: 'Design evaluation score between 0 and 100',
              },
              criteria: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.INTEGER, description: 'Score between 1 and 10' },
                    evidence: { type: Type.STRING, description: 'Specific evidence cited directly from candidate submission' },
                    concern: { type: Type.STRING, description: 'Design risk or area of concern' },
                    suggestion: { type: Type.STRING, description: 'Concrete, actionable suggestion to improve' },
                    confidence: { type: Type.NUMBER, description: 'Confidence between 0.0 and 1.0' },
                  },
                  required: ['name', 'score', 'evidence', 'concern', 'suggestion', 'confidence'],
                },
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              priorityImprovements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              nextPracticeSuggestion: {
                type: Type.STRING,
              },
            },
            required: ['overallScore', 'criteria', 'strengths', 'priorityImprovements', 'nextPracticeSuggestion'],
          },
        },
      });

      const text = response?.text;
      if (!text) {
        throw new Error('Empty response received from Gemini model.');
      }

      const parsed = JSON.parse(text);

      // Validate parsed criteria structure
      const criteriaMap = new Map<string, EvaluationCriterionResult>();
      if (Array.isArray(parsed.criteria)) {
        for (const item of parsed.criteria) {
          criteriaMap.set(item.name, {
            name: item.name,
            score: Math.min(10, Math.max(1, Number(item.score) || 7)),
            evidence: String(item.evidence || 'Demonstrated in class design.'),
            concern: String(item.concern || 'Consider reviewing modularity.'),
            suggestion: String(item.suggestion || 'Refine responsibilities.'),
            confidence: Math.min(1.0, Math.max(0.1, Number(item.confidence) || 0.9)),
          });
        }
      }

      // Ensure all 8 rubric dimensions are present
      const finalCriteria: EvaluationCriterionResult[] = RUBRIC_DIMENSIONS.map(dimension => {
        if (criteriaMap.has(dimension)) {
          return criteriaMap.get(dimension)!;
        }
        return {
          name: dimension,
          score: 7,
          evidence: `Analyzed submitted model for ${dimension}.`,
          concern: 'Meets basic structural criteria.',
          suggestion: `Continue refining ${dimension} for ${problem.title}.`,
          confidence: 0.85,
        };
      });

      let overallScore = Math.min(100, Math.max(0, Number(parsed.overallScore) || 75));
      if (isStrict && submission.classes.length < 3) {
        overallScore = Math.min(overallScore, 48);
      }

      return {
        id: `eval_ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        submissionId: submission.id,
        attemptId: submission.attemptId,
        problemId: problem.id,
        overallScore,
        evaluatorType: 'AI_GEMINI',
        criteria: finalCriteria,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Cohesive object-oriented design.'],
        priorityImprovements: Array.isArray(parsed.priorityImprovements) ? parsed.priorityImprovements : ['Deepen edge case handling.'],
        nextPracticeSuggestion: String(parsed.nextPracticeSuggestion || 'Continue with another LLD problem to practice additional concepts.'),
        evaluatedAt: new Date().toISOString(),
        isStrict,
        evaluationMode: isStrict ? 'STRICT' : 'STANDARD',
      };
    } catch (error: any) {
      console.warn(
        `[AIEvaluator] Gemini model temporarily unavailable (${error?.status || error?.code || 'demand spike'}). Seamlessly activating deterministic RuleBasedEvaluator.`
      );
      const fallbackResult = await this.fallbackEvaluator.evaluate(submission, problem, options);
      return {
        ...fallbackResult,
        evaluatorType: 'RULE_BASED',
        isStrict,
        evaluationMode: isStrict ? 'STRICT' : 'STANDARD',
      };
    }
  }
}
