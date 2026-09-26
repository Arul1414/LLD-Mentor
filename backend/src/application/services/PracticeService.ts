import { AttemptRepository, IAttemptRepository } from '../../infrastructure/repositories/AttemptRepository.js';
import { SubmissionRepository, ISubmissionRepository } from '../../infrastructure/repositories/SubmissionRepository.js';
import { ProblemRepository, IProblemRepository } from '../../infrastructure/repositories/ProblemRepository.js';
import { EvaluationRepository, IEvaluationRepository } from '../../infrastructure/repositories/EvaluationRepository.js';
import { Attempt } from '../../domain/models/Attempt.js';
import { Submission, ClassDesign, RelationshipDesign } from '../../domain/models/Submission.js';
import { SubmissionValidator } from '../../domain/validators/SubmissionValidator.js';

export interface CreateSubmissionInput {
  attemptId: string;
  problemId: string;
  classes: ClassDesign[];
  relationships: RelationshipDesign[];
  explanation: string;
  optionalCode?: string;
  status?: 'DRAFT' | 'SUBMITTED';
}

export interface HistoryItem {
  attemptId: string;
  problemId: string;
  problemTitle: string;
  difficulty: string;
  attemptNumber: number;
  status: string;
  score?: number;
  submissionId?: string;
  createdAt: string;
  completedAt?: string;
  isStrict?: boolean;
  evaluationMode?: 'STANDARD' | 'STRICT';
}

export class PracticeService {
  constructor(
    private attemptRepo: IAttemptRepository = new AttemptRepository(),
    private submissionRepo: ISubmissionRepository = new SubmissionRepository(),
    private problemRepo: IProblemRepository = new ProblemRepository(),
    private evaluationRepo: IEvaluationRepository = new EvaluationRepository()
  ) {}

  public async startAttempt(
    problemId: string,
    userId: string = 'user_default',
    forceNew: boolean = false
  ): Promise<{ attempt: Attempt; submission: Submission; resumed?: boolean }> {
    const problem = await this.problemRepo.findById(problemId);
    if (!problem) {
      throw new Error(`Problem with ID "${problemId}" does not exist.`);
    }

    if (!forceNew) {
      const existingAttempts = await this.attemptRepo.findByProblem(problem.id, userId);
      const activeDraft = existingAttempts.find(a => a.status === 'IN_PROGRESS');
      if (activeDraft) {
        const sub = activeDraft.submissionId
          ? await this.submissionRepo.findById(activeDraft.submissionId)
          : await this.submissionRepo.findByAttempt(activeDraft.id);
        if (sub) {
          return { attempt: activeDraft, submission: sub, resumed: true };
        }
      }
    }

    const previousAttemptsCount = await this.attemptRepo.countByProblem(problem.id, userId);
    const attemptNumber = previousAttemptsCount + 1;

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const attempt: Attempt = {
      id: attemptId,
      attemptId,
      userId,
      problemId: problem.id,
      submissionId,
      attemptNumber,
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
    };

    const initialSubmission: Submission = {
      id: submissionId,
      submissionId,
      attemptId,
      problemId: problem.id,
      status: 'DRAFT',
      classes: [],
      relationships: [],
      explanation: '',
      optionalCode: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.attemptRepo.create(attempt);
    await this.submissionRepo.create(initialSubmission);

    return { attempt, submission: initialSubmission, resumed: false };
  }

  public async getAttemptsByProblem(problemId: string, userId: string = 'user_default'): Promise<Attempt[]> {
    const problem = await this.problemRepo.findById(problemId);
    if (!problem) return [];
    return this.attemptRepo.findByProblem(problem.id, userId);
  }

  public async getAttempt(attemptId: string): Promise<{ attempt: Attempt; submission: Submission | null; problem: any } | null> {
    const attempt = await this.attemptRepo.findById(attemptId);
    if (!attempt) return null;

    const problem = await this.problemRepo.findById(attempt.problemId);
    const submission = attempt.submissionId
      ? await this.submissionRepo.findById(attempt.submissionId)
      : await this.submissionRepo.findByAttempt(attemptId);

    return { attempt, submission, problem };
  }

  public async saveSubmission(input: CreateSubmissionInput): Promise<{ submission: Submission; validation: { isValid: boolean; errors: string[] } }> {
    const attempt = await this.attemptRepo.findById(input.attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID "${input.attemptId}" does not exist.`);
    }

    const problem = await this.problemRepo.findById(input.problemId);
    const validation = SubmissionValidator.validate(input, problem);

    let existing = await this.submissionRepo.findByAttempt(input.attemptId);
    const isSubmitted = input.status === 'SUBMITTED';

    if (!existing) {
      const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newSub: Submission = {
        id: submissionId,
        submissionId,
        attemptId: input.attemptId,
        problemId: input.problemId,
        classes: input.classes,
        relationships: input.relationships,
        explanation: input.explanation,
        optionalCode: input.optionalCode || '',
        status: isSubmitted ? 'SUBMITTED' : 'DRAFT',
        validationErrors: validation.errors,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await this.submissionRepo.create(newSub);
      await this.attemptRepo.update(input.attemptId, {
        submissionId: newSub.id,
        status: isSubmitted ? 'SUBMITTED' : 'IN_PROGRESS',
      });
      return { submission: newSub, validation };
    }

    const updated = await this.submissionRepo.update(existing.id, {
      classes: input.classes,
      relationships: input.relationships,
      explanation: input.explanation,
      optionalCode: input.optionalCode || '',
      status: isSubmitted ? 'SUBMITTED' : (existing.status === 'SUBMITTED' ? 'SUBMITTED' : 'DRAFT'),
      validationErrors: validation.errors,
      updatedAt: new Date().toISOString(),
    });

    if (isSubmitted) {
      await this.attemptRepo.update(input.attemptId, { status: 'SUBMITTED' });
    }

    return { submission: updated || existing, validation };
  }

  public async getHistory(userId: string = 'user_default'): Promise<HistoryItem[]> {
    const attempts = await this.attemptRepo.findByUser(userId);
    const problems = await this.problemRepo.findAll();
    const problemMap = new Map(problems.map(p => [p.id, p]));

    const historyItems: HistoryItem[] = [];
    for (const att of attempts) {
      const prob = problemMap.get(att.problemId);
      let isStrict: boolean | undefined = undefined;
      let evaluationMode: 'STANDARD' | 'STRICT' | undefined = undefined;

      if (att.submissionId) {
        const evalDoc = await this.evaluationRepo.findBySubmission(att.submissionId);
        if (evalDoc) {
          isStrict = evalDoc.isStrict;
          evaluationMode = evalDoc.evaluationMode || (evalDoc.isStrict ? 'STRICT' : 'STANDARD');
        }
      }

      historyItems.push({
        attemptId: att.id,
        problemId: att.problemId,
        problemTitle: prob?.title || 'Unknown Problem',
        difficulty: prob?.difficulty || 'MEDIUM',
        attemptNumber: att.attemptNumber,
        status: att.status,
        score: att.score,
        submissionId: att.submissionId,
        createdAt: att.createdAt,
        completedAt: att.completedAt,
        isStrict,
        evaluationMode,
      });
    }

    return historyItems;
  }
}
