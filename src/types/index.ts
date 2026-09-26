export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  shortDescription: string;
  description: string;
  functionalRequirements: string[];
  constraints: string[];
  assumptions: string[];
  expectedDesignAreas: string[];
  suggestedPatterns?: string[];
  estimatedTime?: string;
  createdAt: string;
}

export type SubmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED';

export type ClassType = 'Class' | 'Interface' | 'Abstract Class';

export type Visibility = 'public' | 'private' | 'protected';

export interface AttributeDesign {
  name: string;
  type: string;
  visibility: Visibility;
}

export interface MethodDesign {
  name: string;
  returnType: string;
  parameters: string;
  visibility: Visibility;
}

export interface ClassDesign {
  id: string;
  name: string;
  type?: ClassType;
  responsibility: string;
  attributes: string[];
  methods: string[];
  structuredAttributes?: AttributeDesign[];
  structuredMethods?: MethodDesign[];
}

export type RelationshipType =
  | 'ASSOCIATION'
  | 'AGGREGATION'
  | 'COMPOSITION'
  | 'INHERITANCE'
  | 'IMPLEMENTATION'
  | 'DEPENDENCY';

export interface RelationshipDesign {
  id: string;
  sourceClass: string;
  targetClass: string;
  relationship: RelationshipType | string;
  reason: string;
}

export interface StructuredExplanation {
  reasoning: string;
  assumptions: string;
  tradeOffs: string;
  extensibility: string;
  patternsUsed: string;
}

export interface Submission {
  id: string;
  submissionId: string;
  attemptId: string;
  problemId: string;
  classes: ClassDesign[];
  relationships: RelationshipDesign[];
  explanation: string;
  optionalCode?: string;
  status: SubmissionStatus;
  validationErrors?: string[];
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attempt {
  id: string;
  attemptId: string;
  userId: string;
  problemId: string;
  submissionId?: string;
  attemptNumber: number;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED' | 'ABANDONED';
  score?: number;
  createdAt: string;
  completedAt?: string;
}

export interface EvaluationCriterionResult {
  name: string;
  score: number;
  evidence: string;
  concern: string;
  suggestion: string;
  confidence: number;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  attemptId: string;
  problemId: string;
  overallScore: number;
  evaluatorType: 'RULE_BASED' | 'AI_GEMINI' | 'HUMAN_EXPERT';
  criteria: EvaluationCriterionResult[];
  strengths: string[];
  priorityImprovements: string[];
  nextPracticeSuggestion: string;
  evaluatedAt: string;
  isStrict?: boolean;
  evaluationMode?: 'STANDARD' | 'STRICT';
}

export interface HistoryItem {
  attemptId: string;
  problemId: string;
  problemTitle: string;
  difficulty: ProblemDifficulty;
  attemptNumber: number;
  status: string;
  score?: number;
  submissionId?: string;
  createdAt: string;
  completedAt?: string;
  isStrict?: boolean;
  evaluationMode?: 'STANDARD' | 'STRICT';
}
