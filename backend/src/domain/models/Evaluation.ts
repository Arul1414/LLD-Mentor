export interface EvaluationCriterionResult {
  name: string;
  score: number; // 0 - 10
  evidence: string;
  concern: string;
  suggestion: string;
  confidence: number; // 0.0 - 1.0
}

export type EvaluatorType = 'RULE_BASED' | 'AI_GEMINI' | 'HUMAN_EXPERT';

export interface Evaluation {
  id: string;
  submissionId: string;
  attemptId: string;
  problemId: string;
  overallScore: number; // 0 - 100
  evaluatorType: EvaluatorType;
  criteria: EvaluationCriterionResult[];
  strengths: string[];
  priorityImprovements: string[];
  nextPracticeSuggestion: string;
  evaluatedAt: string;
  isStrict?: boolean;
  evaluationMode?: 'STANDARD' | 'STRICT';
}

export const RUBRIC_DIMENSIONS = [
  'Requirement Understanding',
  'Class Responsibilities',
  'Coupling / Cohesion',
  'Encapsulation / Interfaces',
  'Abstraction / Design Patterns',
  'Extensibility',
  'Edge Cases / Testability',
  'Explanation Quality',
] as const;

export type RubricDimension = typeof RUBRIC_DIMENSIONS[number];
