import { Database } from '../database/db.js';
import { Submission, SubmissionStatus } from '../../domain/models/Submission.js';

export interface ISubmissionRepository {
  create(submission: Submission): Promise<Submission>;
  findById(id: string): Promise<Submission | null>;
  findByAttempt(attemptId: string): Promise<Submission | null>;
  update(id: string, updates: Partial<Submission>): Promise<Submission | null>;
  findRecentSubmissions(problemId: string, limit?: number): Promise<Submission[]>;
}

export class SubmissionRepository implements ISubmissionRepository {
  private db = Database.getInstance();

  public async create(submission: Submission): Promise<Submission> {
    return this.db.submissions.insertOne(submission);
  }

  public async findById(id: string): Promise<Submission | null> {
    return this.db.submissions.findOne(
      (s: Submission) => s.id === id || s.submissionId === id
    );
  }

  public async findByAttempt(attemptId: string): Promise<Submission | null> {
    const list = await this.db.submissions.find(
      (s: Submission) => s.attemptId === attemptId
    );
    return list[list.length - 1] || null;
  }

  public async update(id: string, updates: Partial<Submission>): Promise<Submission | null> {
    return this.db.submissions.updateOne(
      (s: Submission) => s.id === id || s.submissionId === id,
      { ...updates, updatedAt: new Date().toISOString() }
    );
  }

  public async findRecentSubmissions(problemId: string, limit: number = 5): Promise<Submission[]> {
    const list = await this.db.submissions.find((s: Submission) => s.problemId === problemId);
    return list
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}
