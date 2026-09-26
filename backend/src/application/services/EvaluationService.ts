import { SubmissionRepository, ISubmissionRepository } from '../../infrastructure/repositories/SubmissionRepository.js';
import { ProblemRepository, IProblemRepository } from '../../infrastructure/repositories/ProblemRepository.js';
import { AttemptRepository, IAttemptRepository } from '../../infrastructure/repositories/AttemptRepository.js';
import { EvaluationRepository, IEvaluationRepository } from '../../infrastructure/repositories/EvaluationRepository.js';
import { EvaluatorFactory, EvaluatorStrategy } from '../../domain/evaluators/EvaluatorFactory.js';
import { SubmissionValidator } from '../../domain/validators/SubmissionValidator.js';
import { Evaluation } from '../../domain/models/Evaluation.js';

export interface EvaluationOptions {
  evaluatorStrategy?: EvaluatorStrategy;
  isStrict?: boolean;
}

export class EvaluationService {
  constructor(
    private submissionRepo: ISubmissionRepository = new SubmissionRepository(),
    private problemRepo: IProblemRepository = new ProblemRepository(),
    private attemptRepo: IAttemptRepository = new AttemptRepository(),
    private evaluationRepo: IEvaluationRepository = new EvaluationRepository()
  ) {}

  public async evaluateSubmission(
    submissionId: string,
    options: EvaluationOptions = {}
  ): Promise<{ evaluation: Evaluation; submissionStatus: string }> {
    const submission = await this.submissionRepo.findById(submissionId);
    if (!submission) {
      throw new Error(`Submission with ID "${submissionId}" was not found.`);
    }

    const problem = await this.problemRepo.findById(submission.problemId);
    if (!problem) {
      throw new Error(`Problem associated with submission ("${submission.problemId}") does not exist.`);
    }

    // 1. Deterministic Validation prior to evaluation
    const validation = SubmissionValidator.validate(submission, problem);
    if (!validation.isValid) {
      await this.submissionRepo.update(submission.id, {
        status: 'DRAFT',
        validationErrors: validation.errors,
      });
      const err = new Error(`Deterministic validation failed: ${validation.errors.join(' ')}`);
      (err as any).validationErrors = validation.errors;
      throw err;
    }

    // 2. Duplicate submission detection against prior completed submissions for the same problem
    const recentSubmissions = await this.submissionRepo.findRecentSubmissions(problem.id, 5);
    const isExactDuplicate = recentSubmissions.some(
      prev => prev.id !== submission.id && prev.status === 'COMPLETED' && SubmissionValidator.isDuplicate(submission, prev)
    );
    if (isExactDuplicate) {
      // We still evaluate, but we flag it in failure logs or warning if needed
      console.warn(`[EvaluationService] Notice: Submission ${submission.id} is structurally identical to a prior completed submission.`);
    }

    // 3. PERSIST STATE BEFORE EVALUATION:
    // Transition to EVALUATING state to guarantee no data loss if process crashes
    await this.submissionRepo.update(submission.id, {
      status: 'EVALUATING',
      validationErrors: [],
      failureReason: undefined,
    });
    await this.attemptRepo.update(submission.attemptId, {
      status: 'EVALUATING',
    });

    // 4. Extensible Evaluator execution (Evaluator Abstraction)
    const evaluator = EvaluatorFactory.getEvaluator(options.evaluatorStrategy || 'AUTO');

    try {
      const evaluation = await evaluator.evaluate(submission, problem, {
        isStrict: options.isStrict ?? true,
      });

      // Save Evaluation
      await this.evaluationRepo.create(evaluation);

      // Transition to COMPLETED
      await this.submissionRepo.update(submission.id, {
        status: 'COMPLETED',
        updatedAt: new Date().toISOString(),
      });

      await this.attemptRepo.update(submission.attemptId, {
        status: 'COMPLETED',
        score: evaluation.overallScore,
        completedAt: new Date().toISOString(),
      });

      return { evaluation, submissionStatus: 'COMPLETED' };
    } catch (evalError: any) {
      // Evaluation failed: Submission is PRESERVED, state marked as FAILED with detailed reason
      const reason = evalError?.message || 'Unexpected evaluation runtime failure';
      console.error(`[EvaluationService] Evaluation failed for submission ${submission.id}:`, evalError);

      await this.submissionRepo.update(submission.id, {
        status: 'FAILED',
        failureReason: reason,
        updatedAt: new Date().toISOString(),
      });

      await this.attemptRepo.update(submission.attemptId, {
        status: 'FAILED',
      });

      throw new Error(`Evaluation pipeline error: ${reason}`);
    }
  }

  public async getEvaluationBySubmission(submissionId: string): Promise<Evaluation | null> {
    return this.evaluationRepo.findBySubmission(submissionId);
  }

  public async getEvaluationByAttempt(attemptId: string): Promise<Evaluation | null> {
    return this.evaluationRepo.findByAttempt(attemptId);
  }
}
