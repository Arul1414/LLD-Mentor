import { Submission } from '../models/Submission.js';
import { Problem } from '../models/Problem.js';
import { Evaluation } from '../models/Evaluation.js';

export interface EvaluatorOptions {
  isStrict?: boolean;
}

export interface Evaluator {
  readonly id: string;
  readonly name: string;
  evaluate(submission: Submission, problem: Problem, options?: EvaluatorOptions): Promise<Evaluation>;
}
