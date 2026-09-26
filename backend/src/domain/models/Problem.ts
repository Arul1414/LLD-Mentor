export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ProblemRequirement {
  id: string;
  category: 'FUNCTIONAL' | 'NON_FUNCTIONAL' | 'EXTENSIBILITY';
  description: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
  shortDescription: string;
  description: string;
  functionalRequirements: string[];
  constraints: string[];
  assumptions: string[];
  expectedDesignAreas: string[];
  suggestedPatterns?: string[];
  createdAt: string;
}
