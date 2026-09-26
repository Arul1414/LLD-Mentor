import { Database } from '../database/db.js';
import { Evaluation } from '../../domain/models/Evaluation.js';

export interface IEvaluationRepository {
  create(evaluation: Evaluation): Promise<Evaluation>;
  findBySubmission(submissionId: string): Promise<Evaluation | null>;
  findByAttempt(attemptId: string): Promise<Evaluation | null>;
}

export class EvaluationRepository implements IEvaluationRepository {
  private db = Database.getInstance();

  public async create(evaluation: Evaluation): Promise<Evaluation> {
    await this.db.evaluations.deleteOne((e: Evaluation) => e.submissionId === evaluation.submissionId);
    return this.db.evaluations.insertOne(evaluation);
  }

  public async findBySubmission(submissionId: string): Promise<Evaluation | null> {
    const results = await this.db.evaluations.find(
      (e: Evaluation) => e.submissionId === submissionId
    );
    return results[results.length - 1] || null;
  }

  public async findByAttempt(attemptId: string): Promise<Evaluation | null> {
    const results = await this.db.evaluations.find(
      (e: Evaluation) => e.attemptId === attemptId
    );
    return results[results.length - 1] || null;
  }
}
